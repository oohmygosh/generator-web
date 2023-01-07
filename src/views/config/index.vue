<template>
  <el-container>
    <el-aside>
      <tableSide :dbId="dbId" :dbName="dbName" @tableClick="tableClick"></tableSide>
    </el-aside>
    <el-container>
      <fieldSide :table="currentTable"></fieldSide>
    </el-container>
    <el-aside>3</el-aside>
  </el-container>
</template>

<script setup lang="ts">
import tableSide from './table/index.vue'
import fieldSide from './field/index.vue'
import {useRoute} from "vue-router"
import {Generator} from "@/models/generator";
import {reactive} from "vue";

let route = useRoute();
let dbId = route.query.id;
let dbName = route.query.dbName
let currentTable = reactive<Generator.SysGeneratorTable>({})

const tableClick = (table: Generator.SysGeneratorTable) => Object.assign(currentTable, table)
</script>

<style scoped>

</style>