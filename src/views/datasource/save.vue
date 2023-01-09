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
    <el-tabs tab-position="top" v-model="paneName">
      <el-tab-pane label="编辑" name="db">
        <el-form :model="db" :rules="formRule" label-width="80px" label-position="left" ref="formRef">
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
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="全局配置" v-if="mode === 'edit'" name="globalStrategy">
        <el-form :model="globalStrategyForm" ref="globalStrategyRef" label-width="100px" label-position="left">
          <el-form-item label="Package：">
            <el-input v-model="globalStrategyForm.packagePath" placeholder="包路径" clearable/>
          </el-form-item>
          <el-form-item label="Author：">
            <el-input v-model="globalStrategyForm.author" placeholder="作者" clearable/>
          </el-form-item>
          <el-form-item label="移除表前缀：">
            <el-select style="width: 100%" v-model="globalStrategyForm.tablePrefix"
                       multiple
                       filterable
                       allow-create
                       default-first-option
                       collapse-tags
                       collapse-tags-tooltip
                       :reserve-keyword="false"
                       placeholder="多个值按回车隔开"/>
          </el-form-item>
          <el-form-item label="移除表后缀：">
            <el-select style="width: 100%" v-model="globalStrategyForm.tableSuffix"
                       multiple
                       filterable
                       allow-create
                       default-first-option
                       collapse-tags
                       collapse-tags-tooltip
                       :reserve-keyword="false"
                       placeholder="多个值按回车隔开"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="visible=false">取 消</el-button>
      <el-button type="primary" @click="paneName === 'db' ? submitDb(formRef) : submitGlobalStrategy(globalStrategyRef)"
                 :loading="submitLoading">保 存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {defineEmits, defineExpose, defineProps, withDefaults, reactive, ref, toRefs} from 'vue';
import {Generator} from "@/models/generator";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {Db, GlobalStrategy} from "@/api/generator";
import {IResponseData} from "@/utils/request";
import {AxiosRequestConfig} from "axios";

let emits = defineEmits(['success']);
const titleMap = {
  add: '新增数据源',
  edit: '编辑数据源'
}
let prop = withDefaults(defineProps<{
  paneName: string
}>(), {
  paneName: 'db'
})
let {paneName} = toRefs(prop);
let mode = ref<string>('add')
let formRef = ref<FormInstance>()
let globalStrategyRef = ref<FormInstance>()
let submitLoading = ref<boolean>(false)
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
  db = reactive({comment: "", dbName: "", password: "", url: "", username: ""})
}

const setData = (data: Generator.SysGeneratorDb) => {
  Object.assign(db, data)
  if (mode.value === 'edit')
    GlobalStrategy.get(db.id as number, {headers: {Loading: false}}).then(res => {
      if (res.code === 200)
        Object.assign(globalStrategyForm, res.data)
      console.log(res.data)
    })
}

const submitDb = (form: FormInstance | undefined) => {
  submitForm(form, Db.save, {
    param: db, config: {headers: {Loading: false}},
    after: () => {
      visible.value = false
      emits('success')
    }
  })
}

const submitGlobalStrategy = (form: FormInstance | undefined) => {
  submitForm(form, GlobalStrategy.save, {
    param: globalStrategyForm,
    config: {headers: {Loading: false}}
  })
}

function submitForm(form: FormInstance | undefined, api: (param: any, config: AxiosRequestConfig | undefined) => Promise<IResponseData>, param: {
  param: object, config?: AxiosRequestConfig, after?: () => void
} | undefined = undefined) {
  if (!form) return
  submitLoading.value = true
  form.validate(async (valid) => {
    if (valid) {
      await api(param?.param, param?.config).then(res => {
        if (res.code === 200) {
          ElMessage.success(res.message)
          param?.after?.()
        } else
          ElMessage.error(res.message)
      })
    }
  })
  submitLoading.value = false
}

defineExpose({
  open,
  setData
})

</script>

<style scoped>
</style>