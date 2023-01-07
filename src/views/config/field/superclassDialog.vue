<template>
  <el-dialog title="父类编辑" v-model="visible" :width="400" destroy-on-close top="10px" draggable>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" label-position="left">
      <el-col>
        <el-form-item label="类名" prop="name">
          <el-input v-model="form.name" clearable placeholder="模板名"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type">
            <el-option
                v-for="item in Object.values(superclassList)"
                :key="item.code"
                :label="item.desc"
                :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="form.type === 0">
        <mk-form-table v-model="form.field" :addTemplate="classTemplate" placeholder="暂无公共字段">
          <el-table-column prop="name" label="字段名">
            <template #default="scope">
              <el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
        </mk-form-table>
      </el-col>
      <el-col>
        <el-form-item label="包路径" prop="app">
          <el-input v-model="form.path" clearable placeholder="类全路径名"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="应用名" prop="app">
          <el-input v-model="form.app" clearable placeholder="所属应用"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <el-button @click="visible=false">取 消</el-button>
      <el-button type="primary" @click="submit">保 存</el-button>
      <el-popconfirm title="该操作会清空当前未保存的内容，你确定吗？" @confirm="add">
        <template #reference>
          <el-button type="success" style="float: left">新建类</el-button>
        </template>
      </el-popconfirm>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, defineExpose, defineEmits, reactive, defineProps} from "vue";
import {Generator} from "@/models/generator";
import {Optional} from "@/utils/optional";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import MkFormTable from '@/components/mkFormTable'
import {Superclass} from "@/api/generator";
import {clearObj} from "@/utils/objectUtil";

let {superclassList} = defineProps<{
  superclassList: Generator.Type[]
}>();
let emits = defineEmits(['success']);
let form = reactive<Generator.SysGeneratorSuperclass>({app: "", name: "", type: 0})
const visible = ref(false)
let rules = reactive<FormRules>({
  app: [{required: true, message: '请填写应用名'}],
  name: [{required: true, message: '请填写类名'}],
  type: [{required: true, message: '请选择类型'}],
})
const classTemplate: Generator.Field = {fieldFill: "UPDATE", name: ""}
const open = () => visible.value = true
const formRef = ref<FormInstance>()

const setData = (data: Generator.SysGeneratorSuperclass) => {
  Optional.ofNullable(data).ifPresent(item => Object.assign(form, item))
  form.type = (data.type as Generator.Type).code
}

const submit = () => {
  Superclass.save(form).then(res => {
    if (res.code === 200) {
      emits('success')
      ElMessage.success(res.message)
    } else
      ElMessage.error(res.message)
  })
}

const add = () => {
  clearObj(form)
}


defineExpose({
  open,
  setData
})
</script>

<style scoped>

</style>