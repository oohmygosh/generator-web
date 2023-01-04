<template>
  <el-dialog :title="titleMap[mode]" v-model="visible" :width="330" destroy-on-close>
    <el-form :model="form" :rules="rules" ref="dialogForm" label-width="80px" label-position="left">
      <el-form-item label="表名" prop="name">
        <el-input v-model="form.name" clearable placeholder="表名"></el-input>
      </el-form-item>
      <el-form-item label="注释" prop="comment">
        <el-input v-model="form.comment" clearable placeholder="注释"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible=false">取 消</el-button>
      <el-button type="primary" class="submitBtn" @click="submit(dialogForm)">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, defineExpose, defineProps, defineEmits, reactive, toRefs} from "vue";
import {Generator} from "@/models/generator";
import {ElForm, ElMessage, FormInstance, FormRules} from "element-plus";
import {Table} from "@/api/generator";

let props = defineProps<{
  dbId: number
}>();
let {dbId} = toRefs(props);
let emits = defineEmits(['success'])
const titleMap = {
  add: '新增表',
  edit: '编辑表'
}
const mode = ref()
const visible = ref(false)
let form: Generator.SysGeneratorTable
let rules = reactive<FormRules>({
  name: [{required: true, message: '请输入表名'}],
  comment: [{required: true, message: '请填写表注释'}],
})
let dialogForm = ref<FormInstance>()

const open = (m = 'add') => {
  mode.value = m
  visible.value = true
  form = reactive({})
}

const setData = (data: Generator.SysGeneratorTable) => {
  Object.assign(form, data)
}

const submit = (formInstance: FormInstance | undefined,) => {
  if (!formInstance) return
  formInstance.validate(valid => {
    if (valid) {
      form.dbId = form.dbId ? form.dbId : dbId.value
      Table.save(form, {headers: {Loading: '.submitBtn'}}).then(res => {
        if (res.code === 200) {
          ElMessage.success(res.message)
          emits('success')
          visible.value = false
        } else
          ElMessage.error(res.message)
      })
    }
  })
}

defineExpose({
  open,
  setData
})

</script>

<style>
</style>
