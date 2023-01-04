<!--
 * @Description: 编辑 or 保存数据源配置
 * @version: 1.0
 * @Author: oohmygosh
 * @Date: 2023年1月3日09:28:32
 * @LastEditors: oohmygosh
 * @LastEditTime: 2023年1月3日09:28:32
-->
<template>
  <el-dialog :title="titleMap[mode]" v-model="visible" :width="400" destroy-on-close>
    <el-tabs tab-position="top">
      <el-tab-pane label="编辑">
        <el-form :model="db" :rules="formRule" label-width="80" label-position="left" ref="formRef">
          <el-form-item label="名称" prop="dbName">
            <el-input v-model="db.dbName" clearable/>
          </el-form-item>
          <el-form-item label="连接" prop="url">
            <el-input v-model="db.url" clearable/>
          </el-form-item>
          <el-form-item label="账号" prop="username">
            <el-input v-model="db.username" clearable/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="db.password" clearable/>
          </el-form-item>
          <el-form-item label="描述" prop="comment">
            <el-input v-model="db.comment" clearable/>
          </el-form-item>
          <el-form-item style="justify-content: flex-end">
            <el-button class="submitBut" type="primary" @click="submitDb(formRef)">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="全局配置" v-if="mode === 'edit'">
        <el-form :model="globalStrategyForm" ref="globalStrategyRef" label-width="80" label-position="left">
          <el-form-item label="Package">
            <el-input v-model="globalStrategyForm.packagePath" placeholder="包路径" clearable/>
          </el-form-item>
          <el-form-item label="Author">
            <el-input v-model="globalStrategyForm.author" placeholder="作者" clearable/>
          </el-form-item>
          <el-form-item style="justify-content: flex-end">
            <el-button class="submitBut" type="primary" @click="submitGlobalStrategy(globalStrategyRef)">保存
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import {defineEmits, defineExpose, reactive, ref} from 'vue';
import {Generator} from "@/models/generator";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {Db, GlobalStrategy} from "@/api/generator";
import {IResponseData} from "@/utils/request";
import {AxiosRequestConfig} from "axios";

defineEmits(['closed', 'success'])
const titleMap = {
  add: '新增数据源',
  edit: '编辑数据源'
}
let mode = ref<string>('add')
let formRef = ref<FormInstance>()
let globalStrategyRef = ref<FormInstance>()
let visible = ref(false)
let db: Generator.SysGeneratorDb;
let globalStrategyForm: Generator.SysGeneratorStrategy = reactive({pid: -1})
let formRule = reactive<FormRules>({
  dbName: [{required: true, message: '请填写数据库名'}],
  comment: [{required: true, message: '请填写数据库描述'}],
  password: [{required: true, message: '请输入数据库密码'}],
  username: [{required: true, message: '请输入数据库用户'}],
  url: [{required: true, message: '请输入数据库连接'}],
})

const open = (m = 'add') => {
  visible.value = true
  mode.value = m
  db = reactive({comment: "", dbName: "", dbType: "", password: "", url: "", username: ""})
}

const setData = (data: Generator.SysGeneratorDb) => {
  Object.assign(db, data)
  if (mode.value === 'edit')
    GlobalStrategy.get(db.id as number, {headers: {Loading: false}}).then(res => {
      if (res.code === 200)
        Object.assign(globalStrategyForm, res.data)
    })
}

const submitDb = (form: FormInstance | undefined) => {
  submitForm(form, Db.save, {param: db, config: {headers: {Loading: '.submitBut'}}})
}

const submitGlobalStrategy = (form: FormInstance | undefined) => {
  submitForm(form, GlobalStrategy.save, {param: globalStrategyForm, config: {headers: {Loading: '.submitBut'}}})
}

function submitForm(form: FormInstance | undefined, api: (param: any, config: AxiosRequestConfig | undefined) => Promise<IResponseData>, param: {
  param: object, config?: AxiosRequestConfig
} | undefined = undefined) {
  if (!form) return
  form.validate((valid, fields) => {
    if (valid)
      api(param?.param, param?.config).then(res => {
        if (res.code === 200)
          ElMessage.success(res.message)
        else
          ElMessage.error(res.message)
      })
    else
      ElMessage.error("error submit! " + fields)
  })
}

defineExpose({
  open,
  setData
})

</script>

<style scoped>

</style>