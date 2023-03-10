<template>
  <el-container class="root">
    <el-header><h1>{{ table.name }}</h1></el-header>
    <el-main class="nopadding" style="padding: 20px">
      <el-button type="success" v-if="fieldSaveDialog" @click="fieldSaveDialog.open">新增字段</el-button>
      <el-collapse v-for="field in fields" :key="field.id">
        <el-collapse-item>
          <template v-slot:title>
            <div class="el-input el-input-group el-input-group--prepend">
              <div class="el-input-group__prepend">字段：</div>
              <span class="el-input__wrapper" style="justify-content: left">{{ field.name }}</span>
            </div>
          </template>
          <!--<template v-slot:title>
            <el-input autosize v-model="field.name" readonly clearable>
              <template #prepend>字段:</template>
            </el-input>
          </template>-->
          <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="6">
              <el-input v-model="field.comment" clearable disabled>
                <template #prepend>注释:</template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="field.jdbcType"
                        :value="hasLength(field.jdbcType) ? `${field.jdbcType}(${field.length})` : field.jdbcType"
                        clearable disabled>
                <template #prepend>类型:</template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input v-model="field.defaultValue" clearable disabled>
                <template #prepend>默认值:</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="1.5">
              <el-checkbox v-model="field.primaryKey" disabled>主键</el-checkbox>
            </el-col>
            <el-col :span="1.5">
              <el-checkbox v-model="field.autoIncrement" :disabled="true">自增</el-checkbox>
            </el-col>
            <el-col :span="1.5">
              <el-checkbox :checked="!field.nullable" @change="field.nullable = !field.nullable" disabled>非空
              </el-checkbox>
            </el-col>
            <el-col :span="4" style="align-items: center;display: flex">
              <div class="el-input el-input-group el-input-group--prepend">
                <div class="el-input-group__prepend">数据模拟：</div>
                <el-select style="width: 140px;" v-model="field.mockType" placeholder="选择模拟策略"
                           @change="field.mockParam = null" clearable>
                  <el-option v-for="[key,comment] in Object.entries(MockType)" :key="key" :label="comment"
                             :value="key"/>
                </el-select>
              </div>
            </el-col>
            <el-col :span="4" v-if="field.mockType">
              <el-input v-if="field.mockType === 'FIXED'" placeholder="请输入固定值"
                        v-model="field.mockParam"></el-input>
              <el-input-number v-if="field.mockType === 'INCREASE'" :min="0"
                               v-model="field.mockParam"></el-input-number>
              <el-select v-if="field.mockType === 'RANDOM'" v-model="field.mockParam">
                <el-option v-for="[key,comment] in Object.entries(RandomOption)" :key="key" :label="comment"
                           :value="key"/>
              </el-select>
              <el-input v-if="field.mockType === 'REGX'" placeholder="请输入正则表达式"
                        v-model="field.mockParam"></el-input>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" :gutter="20" style="margin-bottom: 0">
            <el-button type="success" @click="saveField(field)">保存</el-button>
            <el-popconfirm title="该操作无法撤回，你确定？" @confirm="delField(field)">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-divider content-position="left">基础配置</el-divider>
      <el-row>
        <el-col :span="12">
          <el-input clearable style="width: 100%" placeholder="为空则使用全局配置"
                    v-model="tableStrategy.author">
            <template #prepend>Author:</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input clearable style="width: 100%" placeholder="为空则使用全局配置"
                    v-model="tableStrategy.packagePath">
            <template #prepend>包路径:</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="el-input el-input-group el-input-group--prepend">
            <div class="el-input-group__prepend">Mock数量：</div>
            <el-input-number :min="0" :max="50" class="el-input__wrapper"
                             v-model="tableStrategy.mockNum"></el-input-number>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-input el-input-group el-input-group--prepend">
            <div class="el-input-group__prepend">去字段前缀：</div>
            <el-select style="width: 100%" v-model="tableStrategy.fieldPrefix"
                       multiple
                       filterable
                       allow-create
                       default-first-option
                       collapse-tags
                       collapse-tags-tooltip
                       :reserve-keyword="false"
                       placeholder="多个值按回车隔开"/>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-input el-input-group el-input-group--prepend">
            <div class="el-input-group__prepend">去字段后缀：</div>
            <el-select style="width: 100%" v-model="tableStrategy.fieldSuffix"
                       multiple
                       filterable
                       allow-create
                       default-first-option
                       collapse-tags
                       collapse-tags-tooltip
                       :reserve-keyword="false"
                       placeholder="多个值按回车隔开"/>
          </div>
        </el-col>
      </el-row>
      <el-divider content-position="left">Lombok</el-divider>
      <el-row justify="space-evenly">
        <el-checkbox v-model="tableStrategy.lombok.builder">@Builder</el-checkbox>
        <el-checkbox v-model="tableStrategy.lombok.toString" :disabled="tableStrategy.lombok.data">@toString
        </el-checkbox>
        <el-checkbox v-model="tableStrategy.lombok.data"
                     :disabled="tableStrategy.lombok.getterAndSetter || tableStrategy.lombok.toString || tableStrategy.lombok.equalsAndHashCode"
                     @change="tableStrategy.lombok.getterAndSetter=false;tableStrategy.lombok.equalsAndHashCode=false;tableStrategy.lombok.toString=false">
          @Data
        </el-checkbox>
        <el-checkbox v-model="tableStrategy.lombok.getterAndSetter" :disabled="tableStrategy.lombok.data">
          @Getter & @Setter
        </el-checkbox>
        <el-checkbox v-model="tableStrategy.lombok.noArgsConstructor">@NoArgsConstructor</el-checkbox>
        <el-checkbox v-model="tableStrategy.lombok.allArgsConstructor">@AllArgsConstructor</el-checkbox>
        <el-checkbox v-model="tableStrategy.lombok.equalsAndHashCode"
                     :disabled="tableStrategy.lombok.data">@EqualsAndHashCode
        </el-checkbox>
      </el-row>
      <el-divider content-position="left">其他配置</el-divider>
      <el-row justify="start">
        <el-checkbox v-model="tableStrategy.swagger">Swagger</el-checkbox>
        <el-checkbox v-model="tableStrategy.mapper">@Mapper</el-checkbox>
        <el-checkbox v-model="tableStrategy.validation">参数校验</el-checkbox>
      </el-row>
      <el-divider content-position="left">父类</el-divider>
      <el-row>
        <el-select style="width: 100%" v-model="tableStrategy.superclass"
                   clearable
                   multiple>
          <el-option-group
              v-for="[key,value] in Object.entries(arrGroup(superclassList,item => {return {key:item.type.desc}}))"
              ref="superclassRef"
              :key="key"
              :label="key">
            <el-option v-for="item in value"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"
                       :disabled="value.filter(v => tableStrategy.superclass.includes(v.id)).length > 0 && !tableStrategy.superclass.includes(item.id)"
            >
              <span style="float: left">{{ item.name }}&nbsp;<el-button size="small"
                                                                        icon="el-icon-search"
                                                                        @click.stop="openDialog(superclassDialog,item)"
                                                                        circle/></span>
              <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">{{ item.app }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-row>
      <el-divider content-position="left">模板</el-divider>
      <el-row justify="start">
        <el-select style="width: 100%" v-model="tableStrategy.templates"
                   clearable multiple>
          <el-option-group
              v-for="[key, value] in Object.entries(arrGroup(templateList,item =>  {return {key:item.type.desc}}))"
              :key="key"
              :label="key">
            <el-option v-for="item in value"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"
                       :disabled="value.filter(v => tableStrategy.templates.includes(v.id)).length > 0 && !tableStrategy.templates.includes(item.id)"
            >
              <span style="float: left">{{ item.name }}&nbsp;<el-button size="small"
                                                                        icon="el-icon-search"
                                                                        @click.stop="openDialog(templateDialog,item)"
                                                                        circle/></span>
              <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">{{ item.app }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-row>
      <el-row>
        <el-button style="width: 100%" v-if="globalConfigDialog"
                   @click="openGlobalConfig">全局配置
        </el-button>
      </el-row>
    </el-main>
    <el-footer>
      <el-row>
        <el-col :span="12">
          <el-button type="success" style="width: 100%" plain @click="save" class="saveBtn">保 存
          </el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="width: 100%" plain @click="preview" class="previewBtn">
            预 览
          </el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
  <preview-dialog ref="previewDialog"/>
  <field-save-dialog ref="fieldSaveDialog" :tableId="table.id" @success="initFields"/>
  <template-dialog ref="templateDialog"
                   @success="initTemplate"
                   :templateList="arrGroup(templateList,item => {return {key:item.type.code,fill:item.type}})"/>
  <superclass-dialog ref="superclassDialog"
                     @success="initSuperEntity"
                     :superclassList="arrGroup(superclassList,item => {return {key:item.type.code,fill:item.type}})"/>
  <global-config-dialog ref="globalConfigDialog" :pane-name="'globalStrategy'"/>
</template>

<script setup lang="ts">
import {defineProps, reactive, ref, toRefs, watch} from 'vue'
import {Generator} from "@/models/generator";
import {Db, Exec, Field, Superclass, TableStrategy, Template} from "@/api/generator";
import SuperclassDialog from './superclassDialog.vue'
import TemplateDialog from './templateDialog.vue'
import {Optional} from "@/utils/optional";
import {AxiosHeaders} from "axios";
import {ElMessage} from "element-plus";
import PreviewDialog from './preview.vue'
import FieldSaveDialog from './save.vue'
import GlobalConfigDialog from '@/views/datasource/save.vue'

let props = defineProps<{
  table: Generator.SysGeneratorTable,
}>();
let {table} = toRefs(props);
let fields: Array<Generator.SysGeneratorField> = reactive([])
let templateList: Array<Generator.SysGeneratorTemplate> = reactive([])
let superclassList: Array<Generator.SysGeneratorSuperclass> = reactive([])
let tableStrategy = reactive<Generator.SysGeneratorTableStrategy>({
  lombok: {
    allArgsConstructor: false,
    builder: false,
    data: false,
    equalsAndHashCode: false,
    getterAndSetter: false,
    noArgsConstructor: false,
    toString: false
  }, superclass: [], templates: []
})
let templateDialog = ref<InstanceType<typeof TemplateDialog> | null>(null)
let superclassDialog = ref<InstanceType<typeof SuperclassDialog> | null>(null)
let previewDialog = ref<InstanceType<typeof PreviewDialog> | null>(null)
let fieldSaveDialog = ref<InstanceType<typeof FieldSaveDialog> | null>(null)
let globalConfigDialog = ref<InstanceType<typeof GlobalConfigDialog> | null>(null)


enum MockType {
  FIXED = '固定',
  INCREASE = '递增',
  RANDOM = '随机',
  REGX = '正则'
}

// noinspection JSUnusedGlobalSymbols
enum RandomOption {
  EMAIL = '邮箱',
  PHONE_NUM = '手机号',
  DATE = '日期',
  ADDRESS = '地址',
  ID_CARD = '身份证',
  PASSWORD = '密码',
  CHINESE_NAME = '中文名',
  ENGLISH_NAME = '英文名',
  PLATE_NUM = '车牌',
  PRIVATE_IPV4 = '内网Ipv4',
  PUBLIC_IPV4 = '公网Ipv4',
  IPV6 = 'Ipv6',
  DOMAIN = '域名',
}

watch(table, () => {
  initFields()
  initTableStrategy()
  initTemplate()
  initSuperEntity()
}, {
  deep: true
})

const initFields = () => {
  Optional.ofNullable(table.value.id as number).ifPresentOrThrow(id => {
    Field.fetchTableField(id, {headers: {Loading: '.root'}}).then(res => {
      if (res.code === 200) {
        fields.splice(0, fields.length)
        Object.assign(fields, res.data.sort((a, b) => (a.id as number) - (b.id as number)))
      }
    })
  }, '参数缺失！')
}

const initTableStrategy = () => {
  Optional.ofNullable(table.value.id as number).ifPresentOrThrow(id =>
      TableStrategy.get(id).then(res => Object.assign(tableStrategy, res.data)), "参数缺失")
}

const initTemplate = () => {
  Optional.ofNullable(table.value.id as number).ifPresentOrThrow(id =>
      Template.get(id).then(res => Object.assign(templateList, res.data)), "参数缺失")
}

const initSuperEntity = () => {
  Optional.ofNullable(table.value.id as number).ifPresentOrThrow(id =>
      Superclass.get(id).then(res => Object.assign(superclassList, res.data)), "参数缺失")
}

const arrGroup = function <T, R>(arr: T[], supplier: (arg0: T) => { key: PropertyKey, fill?: R }) {
  interface resultType {
    [key: string]: R | T[]
  }

  const result: resultType = {}
  arr.forEach(item => {
    let s = supplier(item);
    let resultKey = s.key;
    let value = Object.getOwnPropertyDescriptor(result, resultKey)?.value;
    if (!value)
      result[resultKey as keyof resultType] = s.fill ? s.fill : [item]
    else if (Array.isArray(value))
      value.push(s.fill ? s.fill : item)
  })
  return result
}

const saveField = (field: Generator.SysGeneratorField) => {
  Field.save(field, new AxiosHeaders({Loading: '.el-button'}))
      .then(res => res.code === 200 ? ElMessage.success(res.message) : ElMessage.error(res.message))
}

const delField = (field: Generator.SysGeneratorField) => {
  Field.delete([field.id as number]).then(res => {
    if (res.code === 200) {
      ElMessage.success(res.message)
      fields.splice(fields.indexOf(field), 1)
    }
  })
}

const openDialog = <T, V extends { open: (model?: string) => void, setData: (data: any) => void }>(dialogRef: V | any, data: T, model?: string): void => {
  dialogRef?.open(model)
  dialogRef?.setData(data)
}

const save = () => {
  // console.log(tableStrategy)
  TableStrategy.save(tableStrategy, new AxiosHeaders({Loading: '.saveBtn'}))
      .then(res => res.code === 200 ? ElMessage.success(res.message) : ElMessage.error(res.message))
}

const preview = () => {
  save()
  Exec.preview({
    tables: [table.value],
    id: table.value.dbId as number
  }, new AxiosHeaders({Loading: '.previewBtn'})).then(res => {
    if (res.code === 200) {
      openDialog(previewDialog?.value, res.data.renderResults)
    }
  })
}

const openGlobalConfig = async () => {
  let db = await Db.get(table.value.dbId as number);
  globalConfigDialog?.value.open('edit','globalStrategy')
  globalConfigDialog?.value.setData(db.data)
}

const hasLength = (type: string) => {
  switch (type) {
    case "VARCHAR":
    case "CHAR":
    case "BINARY":
    case "VARBINARY":
      return true
  }
  return false
}

</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.item-margin > * {
  margin: 0 5px;
}
</style>