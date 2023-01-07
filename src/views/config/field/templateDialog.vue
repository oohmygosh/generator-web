<template>
  <el-dialog title="模板编辑" v-model="visible" :width="1000" destroy-on-close top="10px" draggable>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80" label-position="left">
      <el-row justify="space-around">
        <el-col :lg="5">
          <el-form-item label="模板名" prop="name">
            <el-input v-model="form.name" clearable placeholder="模板名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="5">
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type">
              <el-option
                  v-for="item in Object.values(templateList)"
                  :key="item.code"
                  :label="item.desc"
                  :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="5">
          <el-form-item label="模板类型" prop="templateType">
            <el-select v-model="form.templateType">
              <el-option
                  v-for="item in [{value:0,label:'Velocity'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="5">
          <el-form-item label="应用名" prop="app">
            <el-input v-model="form.app" clearable placeholder="所属应用"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <mk-monaco-editor :options="{
          language:templateList[form.type]?.language,
          value:form.template
        }" :height="monacoEditorHeight" :auto-format="false" v-model="form.template"/>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible=false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
      <el-popconfirm title="该操作会清空当前未保存的内容，你确定吗？" @confirm="add">
        <template #reference>
          <el-button type="success" style="float: left">新建模板</el-button>
        </template>
      </el-popconfirm>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, defineExpose, defineEmits, defineProps, reactive} from "vue";
import {Generator} from "@/models/generator";
import {Optional} from "@/utils/optional";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import MkMonacoEditor from '@/components/mkMonacoEditor'
import {Template} from "@/api/generator";

let {templateList} = defineProps<{
  templateList: Generator.Type[]
}>();
let emits = defineEmits(['success'])
const visible = ref(false)
let form = reactive<Generator.SysGeneratorTemplate>({
  app: "", name: "", templateType: 0, type: 0
})
const monacoEditorHeight = document.documentElement.clientHeight - 400 + 'px'
let formRef = ref<FormInstance>()
let rules = reactive<FormRules>({
  app: [{required: true, message: '请填写应用名'}],
  name: [{required: true, message: '请填写模板名'}],
  templateType: [{required: true, message: '请选择模板引擎'}],
  type: [{required: true, message: '请选择模板类型'}],
})

const open = () => visible.value = true

const setData = (data: Generator.SysGeneratorTemplate) => {
  Optional.ofNullable(data).ifPresent(item => Object.assign(form, item))
  form.type = (data.type as Generator.Type).code
}

const save = () => {
  Template.save(form).then(res => {
    if (res.code === 200) {
      ElMessage.success(res.message)
      emits('success')
    } else
      ElMessage.error(res.message)
  })
}

const add = () => {
  clearObj(form)
}

function clearObj(obj:any) {
  for (const key in obj) {
    if (Object.getOwnPropertyDescriptor(obj, key)) {
      const value = obj[key];
      if (value !== null && typeof value === 'object') {
        clearObj(value);
      } else {
        obj[key] = null;
      }
    }
  }
}

defineExpose({
  open,
  setData
})
</script>

<style scoped>

</style>