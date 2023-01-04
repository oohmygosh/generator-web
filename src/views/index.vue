<template>
  <el-main>
    <el-row :gutter="15">
      <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="24" v-for="item in data" :key="item.id">
        <el-card class="resource-item" shadow="hover">
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
  <saveDialog ref="saveD" :db="data"></saveDialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, nextTick, defineAsyncComponent} from "vue";
import {Generator} from "@/models/generator";
import {ElMessage} from "element-plus";
import {Db,Exec} from '@/api/generator'

let data = reactive<Array<Generator.SysGeneratorDb>>([]);
let saveDialog = defineAsyncComponent(() => import('./datasource/save.vue'));
let saveD = ref<InstanceType<typeof saveDialog> | null>(null);
// 初始化
onMounted(() => {
  Db.page.get().then(res => {
    if (res.code === 200) {
      Object.assign(data, res.data.records)
    } else {
      ElMessage.error(res.message)
    }
  })
})

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
  })
}

// 配置参数
function config(db: Generator.SysGeneratorDb) {
  console.log(db)
}

// 删除数据源
function del(db: Generator.SysGeneratorDb) {
  console.log(db)
}
</script>
<style scoped>
.resource {
  height: 305px;
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