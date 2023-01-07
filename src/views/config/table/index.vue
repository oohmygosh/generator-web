<template>
  <el-container>
    <el-header>
      <h1>{{ dbName }}</h1>
    </el-header>
    <el-main class="nopadding">
      <el-tree ref="tableTreeRef" class="menu" :data="tables" node-key="id" :highlight-current="true" show-checkbox
               @node-click="tableClick"
               check-on-click-node>
        <template #default="{data}">
							<span class="custom-tree-node" style="position: relative">
                <span class="label">{{ data.name }}</span>
								<span class="code">{{ data.comment }}</span>
                <span class="do" style="position: absolute;right: 10%">
									<el-button-group>
										<el-button icon="el-icon-edit" size="small"
                               @click.stop="createOrEditTable(data,'edit')"/>
                    <el-popconfirm title="你确定删除吗？" @confirm="tableDel(data)">
												<template #reference><el-button icon="el-icon-delete" size="small"/></template>
                    </el-popconfirm>
									</el-button-group>
                </span>
              </span>
        </template>
      </el-tree>
    </el-main>
    <el-button type="success" style="border-radius: 0" @click="createOrEditTable(undefined)">新建表</el-button>
    <el-footer>
      <el-button @click="checkedAll">{{ isAllChecked() ? "反选" : "全选" }}</el-button>
      <el-button @click="generatorZip" class="generatorBtn" type="primary">
        {{
          tableTreeRef?.getCheckedNodes().length !== tables.length && tableTreeRef?.getCheckedNodes().length !== 0 ? `生成 ${tableTreeRef?.getCheckedNodes().length}` : '生成全部'
        }}
      </el-button>
      <el-button @click="$router.go(-1)">返回</el-button>
    </el-footer>
    <tableDialog ref="tableDialogRef" :dbId="dbId" @success="initTables"></tableDialog>
  </el-container>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, onMounted, reactive, ref, nextTick, toRefs} from 'vue'
import {ElMessage, ElTree} from "element-plus";
import {Generator} from "@/models/generator";
import {Table, Exec} from "@/api/generator";
import Node from "element-plus/es/components/tree/src/model/node";
import tableDialog from './save.vue'
import {Optional} from "@/utils/optional";

let emits = defineEmits(['tableClick']);
const props = defineProps<{
  dbId: number,
  dbName: string,
}>()
const {dbId} = toRefs(props)
let tableTreeRef = ref<InstanceType<typeof ElTree>>()
let tables = reactive<Array<Generator.SysGeneratorTable> | Node[]>([])
const isAllChecked = () => {return tableTreeRef.value?.getCheckedNodes().length === tables.length}
const tableDialogRef = ref<InstanceType<typeof tableDialog>>()

const checkedAll = () => {
  isAllChecked() ?
      tableTreeRef.value?.setCheckedNodes([]) :
      tableTreeRef.value?.setCheckedNodes(tables as Node[])
}

onMounted(async () => {
  await initTables()
  await nextTick(() => {
    emits('tableClick', tables[0])
  })
})

const initTables = async () => {
  await Table.get(dbId.value, {headers: {Loading: '.menu'}}).then(res => {
    if (res.code === 200) {
      tables.splice(0, tables.length)
      Object.assign(tables, res.data)
    }
  })
}

const generatorZip = () => {
  Exec.generatorZip({id: dbId.value, tables: tableTreeRef.value?.getCheckedNodes() as Generator.SysGeneratorTable[]}, {
    headers: {Loading: '.generatorBtn'}
  }).catch(() => {
    ElMessage.error("生成失败！！！")
  })
}

const tableClick = (table: Generator.SysGeneratorTable) => {
  emits('tableClick', table)
}

const createOrEditTable = (table:Generator.SysGeneratorTable | undefined,mode = 'add') => {
  tableDialogRef.value?.open(mode)
  Optional.ofNullable(table).ifPresent(() => tableDialogRef.value?.setData(table))
}

const tableDel = (table: Generator.SysGeneratorTable) => {
  Table.delete([table.id as number], {headers: {Loading: false}}).then(res => {
    if (res.code === 200) {
      ElMessage.success(res.message);
      tables.splice((tables as Array<Generator.SysGeneratorTable>).indexOf(table), 1)
    } else
      ElMessage.error(res.message)
  })
}
</script>

<style scoped>
.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 24px;
  height: 100%;
}

.custom-tree-node .code {
  font-size: 12px;
  color: #999;
}

.custom-tree-node .do {
  display: none;
}

.custom-tree-node:hover .do {
  display: inline-flex;
}
</style>
