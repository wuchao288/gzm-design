<template>
    <a-card>
      <a-space align="baseline">
          <a-card title="基于arco的颜色选择器（后续可提供扩展插槽）">
              <a-space align="start">
                  <div>
                      <a-divider orientation="left">面板使用</a-divider>
                      <g-color-picker-panel v-model="color" :enable-alpha="true"></g-color-picker-panel>
                  </div>
                  <div>
                      <a-divider orientation="left">基础使用</a-divider>
                      <!--  recentColors 在非面板组件时暂时不可用 -->
                      <g-color-picker v-model="color" :enable-alpha="true" :recentColors="null"></g-color-picker>
                  </div>
                  <div>
                      <a-divider orientation="left">tab插槽</a-divider>
                      <!--  recentColors 在非面板组件时暂时不可用 -->
                      <g-color-picker v-model="color" :enable-alpha="true" :recentColors="null" :cus-color-modes="['image','image2']">
                          <template #image-panel>
                              111111111
                          </template>
                          <template #image2-panel>
                              22222222
                          </template>
                      </g-color-picker>
                  </div>
              </a-space>
          </a-card>
      </a-space>
    </a-card>
</template>

<script setup lang="ts">
const color = ref('#0052d9');
const color2 = ref('#0052d9');
const recCols = ref(['red']);
// import GColorPicker from '@/components/design-color-picker/g-color-picker.vue';
// import GColorPickerPanel from '@/components/design-color-picker/g-color-picker-panel.vue';
import {GColorPicker,GColorPickerPanel} from '@/components/g-color-picker';
</script>
