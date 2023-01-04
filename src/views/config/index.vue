<template>
  <el-container>
    <el-aside>
      <tableSide :dbId="dbId" :dbName="dbName" @tableClick="currentTable"></tableSide>
    </el-aside>
    <el-container>2</el-container>
    <el-aside>3</el-aside>
  </el-container>
</template>

<script setup lang="ts">
import tableSide from './table/index.vue'
import {useRoute} from "vue-router"

let route = useRoute();
let dbId = route.query.id;
let dbName = route.query.dbName

const currentTable = (id: number | undefined) => {
  if (typeof id === 'number')
    console.log(id)
}
</script>

<style scoped>

</style>