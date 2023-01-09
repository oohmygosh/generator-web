<template>
  <el-dialog title="新增字段" v-model="visible" :width="330" destroy-on-close>
    <el-form :model="form" :rules="rules" ref="dialogForm" label-width="80px" label-position="left">
      <el-form-item label="字段名" prop="name">
        <el-input v-model="form.name" clearable placeholder="表名"></el-input>
      </el-form-item>
      <el-form-item label="字段类型" prop="name">
        <el-input v-model="form.jdbcType" clearable placeholder="表名"></el-input>
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
import {reactive, defineEmits, defineExpose, defineProps, ref} from "vue";
import {Generator} from "@/models/generator";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {Field} from "@/api/generator";

let {tableId} = defineProps<{
  tableId: number
}>();
let emits = defineEmits(['success'])

let visible = ref(false)
let form = reactive<Generator.SysGeneratorField>({
  jdbcType: "",
  comment: "",
  name: "",
  tableId: tableId
})
let dialogForm = ref<FormInstance>()
const rules = ref<FormRules>({
  name: [{required: true, message: '请输入字段名'}],
  comment: [{required: true, message: '请填写字段注释'}],
  jdbcType: [{required: true, message: '字段类型'}],
})

const open = () => visible.value = true

const submit = (formInstance: FormInstance) => {
  formInstance.validate(valid => {
    if (valid) {
      const match = form.jdbcType.match(/([A-Za-z]+)\((\d+)\)/);
      if (match && match[1] && match[2]) {
        form.jdbcType = match[1]
        form.length = parseInt(match[2])
      }
      form.jdbcType = form.jdbcType.toLocaleUpperCase()
      Field.save(form).then(res => {
        if (res.code === 200) {
          ElMessage.success(res.message)
          emits('success')
        }else
          ElMessage.error(res.message)
      })
    }
  })
}

defineExpose({
  open
})
</script>

<style scoped>

</style>