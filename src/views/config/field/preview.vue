<template>
  <el-aside v-if="visible" :style="{width}" style="min-width: 500px" v-resize="'#set_menu_width'">
    <el-container>
      <el-main class="nopadding">
        <el-tabs tab-position="top" type="card" style="height: 50px">
          <el-tab-pane :label="item.type.desc" v-for="item in renderResult"
                       :key="item.type.code">
            <mk-monaco-editor ref="monacoEditor" :height="monacoEditorHeight"
                              :options="{language:item.type.language,value:item.content}"
                              :auto-format="true"
            ></mk-monaco-editor>
          </el-tab-pane>
        </el-tabs>
      </el-main>
      <el-tag style="cursor: move;" id="set_menu_width">
        <el-icon-d-caret style="width: 2em; height: 1em;transform:rotate(90deg);"/>
      </el-tag>
      <el-footer class="nopadding" style="padding: 0">
        <el-button type="danger" :style="{width:'100%'}" @click="visible=false">关闭</el-button>
      </el-footer>
    </el-container>
  </el-aside>
</template>

<script setup lang="ts">
import MkMonacoEditor from '@/components/mkMonacoEditor'
import { defineExpose,withDefaults,defineProps,  ref, reactive} from "vue";
import {Generator} from "@/models/generator";

let {width} = withDefaults(defineProps<{
  width?: string
}>(), {
  width: (document.documentElement.clientWidth / 3) + 'px'
});
const monacoEditorHeight = document.documentElement.clientHeight + 'px'
let visible = ref(false)
let renderResult = reactive<Array<Generator.RenderResult>>([])

const open = () => visible.value = true
const setData = (data:Array<Generator.RenderResult>) => {
  renderResult.splice(0, renderResult.length)
  Object.assign(renderResult, data)
}

defineExpose({
  open,
  setData
})
</script>

<style scoped>

</style>