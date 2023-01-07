<template>
  <div ref="monacoRef" :style="{height,width}" class="mk-monaco-editor" @mouseleave="focusOut()"/>
</template>

<script setup lang="ts">
import {defineProps, onMounted, defineEmits, ref, toRefs, watch, withDefaults} from 'vue'
import * as monaco from 'monaco-editor'
import {editor} from "monaco-editor";
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import {WatchStopHandle} from "@vue/runtime-core";

let monacoEditor: IStandaloneCodeEditor
let monacoRef = ref<HTMLElement>()
let props = withDefaults(defineProps<{
  options: IStandaloneEditorConstructionOptions
  height?: string
  width?: string
  autoFormat?: boolean
  modelValue?: string
}>(), {
  height: '300px',
  width: '100%',
  autoFormat: false
});
let {options, width, autoFormat} = toRefs(props);
let emits = defineEmits(['update:modelValue']);

const defaultOptions = {
  theme: 'vs-dark', // 编辑器主题：vs, hc-black, or vs-dark
  autoIndent: true, // 自动缩进
  selectOnLineNumbers: true,//显示行号
  roundedSelection: false,
  readOnly: false,        // 只读
  cursorStyle: 'line',        //光标样式
  automaticLayout: true, //自动布局
  glyphMargin: true,  //字形边缘
  useTabStops: false,
  scrollbar: { // 滚动条设置
    verticalScrollbarSize: 20, // 竖滚动条
    horizontalScrollbarSize: 20, // 横滚动条
  },
  minimap: {enabled: false},
  fontSize: 14,       //字体大小
}

onMounted(() => {
  initMonacoEditor()
})

let optionsWatch: WatchStopHandle | undefined

function focusOut() {
  if (optionsWatch) return
  optionsWatch = watch(() => options, newV => {
    monacoEditor.setValue(newV.value.value ? newV.value.value : '')
    if (autoFormat.value) {
      monacoEditor.trigger('', 'editor.action.formatDocument', '')
    }
  }, {deep: true, flush: 'post'});
}


const initMonacoEditor = () => {
  monacoEditor = monaco.editor.create(monacoRef.value as HTMLElement, Object.assign(options.value, defaultOptions))
  focusOut()
  monacoEditor.onDidChangeModelContent(() => {
    optionsWatch?.()
    emits('update:modelValue', monacoEditor.getValue())
    optionsWatch = undefined
  })
  if (autoFormat.value) {
    setTimeout(() => {
      monacoEditor.getAction('editor.action.formatDocument').run()
          .then(() => {
            monacoEditor.updateOptions({readOnly: false})
            monacoEditor.trigger('', 'editor.action.formatDocument', '')
          })
    }, 100)
  }
}

</script>

<style scoped>

</style>