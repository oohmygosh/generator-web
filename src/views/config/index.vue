<template>
  <el-container>
    <el-aside>
      <table-side :dbId="dbId" :dbName="dbName" @tableClick="tableClick"></table-side>
    </el-aside>
    <el-container>
      <field-side :table="currentTable"></field-side>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import TableSide from './table/index.vue'
import FieldSide from './field/index.vue'
import {useRoute} from "vue-router"
import {Generator} from "@/models/generator";
import {reactive} from "vue";

let route = useRoute();
let dbId = (route.query.id as any) as number;
let dbName = route.query.dbName as string
let currentTable = reactive<Generator.SysGeneratorTable>({})

const tableClick = (table: Generator.SysGeneratorTable) => Object.assign(currentTable, table)
</script>

<style scoped>

</style>