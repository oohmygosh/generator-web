<template>
  <div class="sc-form-table">
    <el-table :data="modelValue" ref="table" :key="toggleIndex" border stripe>
      <el-table-column type="index" width="50" fixed="left">
        <template #header>
          <el-button type="primary" icon="el-icon-plus" size="small" circle @click="rowAdd"></el-button>
        </template>
        <template #default="scope">
          <div class="sc-form-table-handle">
            <span>{{ scope.$index + 1 }}</span>
            <el-button type="danger" icon="el-icon-delete" size="small" plain circle
                       @click="rowDel(scope.$index)"></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="" width="58" v-if="dragSort">
        <template #default>
          <el-tag class="move" style="cursor: move;">
            <el-icon-d-caret style="width: 1em; height: 1em;"/>
          </el-tag>
        </template>
      </el-table-column>
      <slot></slot>
      <template #empty>
        {{ placeholder }}
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, ref, toRefs, watch, withDefaults, nextTick, onMounted} from 'vue'
import {ElTable} from "element-plus";
import Sortable from 'sortablejs'

let props = withDefaults(defineProps<{
  modelValue: any[]
  addTemplate: object
  click: (arg: any[]) => void
  placeholder: string
  dragSort: boolean
}>(), {
  click: undefined,
  dragSort: false,
  placeholder: '暂无数据'
});
let emits = defineEmits(['update:modelValue']);
let table = ref<InstanceType<typeof ElTable>>()
let {modelValue, addTemplate, click, dragSort} = toRefs(props);

watch(() => modelValue, (newV) => {
  Object.assign(modelValue.value, newV.value)
  emits('update:modelValue', modelValue.value)
}, {deep: true})

let toggleIndex = 0

onMounted(() => {
  if (dragSort.value)
    rowDrop()
})

const rowDrop = () => {
  let tbody = table.value?.$el.querySelector('.el-table__body-wrapper tbody');
  Sortable.create(tbody, {
    handle: ".move",
    animation: 300,
    ghostClass: "ghost",
    onEnd: (newIndex: number, oldIndex: number) => {
      const tableData = modelValue.value
      const currRow = tableData.splice(oldIndex, 1)[0]
      tableData.splice(newIndex, 0, currRow)
      toggleIndex += 1
      nextTick(() => {
        rowDrop()
      })
    }
  })
}

const rowAdd = () => {
  if (click.value)
    click.value?.(modelValue.value)
  else
    modelValue.value.push(JSON.parse(JSON.stringify(addTemplate.value)))
}

const rowDel = (index: number) => {
  modelValue.value.splice(index, 1)
}

</script>

<style scoped>
.sc-form-table {
  width: 100%;
}

.sc-form-table .sc-form-table-handle {
  text-align: center;
}

.sc-form-table .sc-form-table-handle span {
  display: inline-block;
}

.sc-form-table .sc-form-table-handle button {
  display: none;
}

.sc-form-table .hover-row .sc-form-table-handle span {
  display: none;
}

.sc-form-table .hover-row .sc-form-table-handle button {
  display: inline-block;
}
</style>
