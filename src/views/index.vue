<template>
  <el-container>
    <el-main>
      <el-row :gutter="15">
        <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="24" v-for="item in data" :key="item.id">
          <el-card class="resource resource-item" shadow="hover">
            <h1 style="font-size: 35px">{{ item.dbName }}</h1>
            <ul>
              <li>
                <h4>数据库类型</h4>
                <p>{{ item.dbType }}</p>
              </li>
              <li>
                <h4>数据库描述</h4>
                <p>{{ item.comment }}</p>
              </li>
            </ul>
            <div class="bottom">
              <div class="handler" style="margin: 0 auto">
                <el-popconfirm title="确定立即生成吗？" @confirm="doGenerator(item)">
                  <template #reference>
                    <el-button type="primary" icon="el-icon-download" circle></el-button>
                  </template>
                </el-popconfirm>
                <el-button type="primary" icon="el-icon-edit" circle plain @click="edit(item)"></el-button>
                <el-button type="primary" icon="el-icon-tools" circle plain @click="config(item)"></el-button>
                <el-popconfirm title="该操作无法撤回，你确定？" @confirm="del(item)">
                  <template #reference>
                    <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="24">
          <el-card class="resource resource-add" shadow="never" @click="edit()">
            <el-icon>
              <el-icon-plus/>
            </el-icon>
            <p>添加数据源</p>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-footer style="display: flex;justify-content: center">
      <a href="https://github.com/oohmygosh/generator">
        <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true"
             class="octicon octicon-mark-github v-align-middle">
          <path fill-rule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
      </a>
    </el-footer>
  </el-container>
  <saveDialog ref="saveD" :db="data" @success="getDbs()"></saveDialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, nextTick, defineAsyncComponent} from "vue";
import {Generator} from "@/models/generator";
import {ElMessage} from "element-plus";
import {Db, Exec} from '@/api/generator'
import router from "@/router";

let data: Array<Generator.SysGeneratorDb> = reactive([])
let saveDialog = defineAsyncComponent(() => import('./datasource/save.vue'));
let saveD = ref<InstanceType<typeof saveDialog> | null>(null);
// 初始化
onMounted(() => {
  getDbs()
})

// 获取数据源
const getDbs = () => {
  nextTick(() => {
    Db.page.get(undefined, {headers: {Loading: 'body'}}).then(res => {
      if (res.code === 200) {
        data.splice(0, data.length)
        Object.assign(data, res.data.records)
      } else {
        ElMessage.error(res.message)
      }
    })
  })
}

// 添加数据源
const edit = (db?: Generator.SysGeneratorDb) => {
  nextTick(() => {
    saveD.value?.open(db ? 'edit' : 'add')
    if (db)
      saveD.value?.setData(db)
  })
}

// 生成代码
function doGenerator(db: Generator.SysGeneratorDb) {
  Exec.generatorZip({id: db.id as number, tables: undefined}, {
    headers: {Loading: '.resource-item'}
  }).catch(() => {
    ElMessage.error("生成失败！！！")
  })
}

// 配置参数
function config(db: Generator.SysGeneratorDb) {
  router.push({path: "/generator/config", query: {id: db.id, dbName: db.dbName}})
}

// 删除数据源
function del(db: Generator.SysGeneratorDb) {
  Db.delete([db.id as number]).then(res => {
    if (res.code === 200) {
      ElMessage.success(res.message)
      getDbs()
    } else
      ElMessage.error(res.message)
  })
}
</script>
<style scoped>
.resource {
  height: 223px;
}

.resource-item h2 {
  font-size: 15px;
  color: #3c4a54;
  padding-bottom: 15px;
}

.resource-item li {
  list-style-type: none;
  margin-bottom: 10px;
}

.resource-item li h4 {
  font-size: 12px;
  font-weight: normal;
  color: #999;
}

.resource-item li p {
  margin-top: 5px;
}

.resource-item .bottom {
  border-top: 1px solid #EBEEF5;
  text-align: right;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resource-add {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  color: #999;
}

.resource-add:hover {
  color: #409EFF;
}

.resource-add i {
  font-size: 30px;
}

.resource-add p {
  font-size: 12px;
  margin-top: 20px;
}

.dark .resource-item .bottom {
  border-color: var(--el-border-color-light);
}
</style>