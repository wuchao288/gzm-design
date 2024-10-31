<template >
    <Panel :hiddenAdd="true" title="填充" style="margin-top:4px">
       <a-row :gutter="8"> 
           <a-col :span="8" >
              <span style="font-size: 12px;">颜色</span>
           </a-col> 
           <a-col :span="16"  class="color-picker-wrap">
            
            <div class="color-picker-item">
                <a-color-picker :style="'margin: 2px'"  :popup-translate="[-182, 0]"  showPreset defaultValue="#165DFF" showText  size="mini" />
            </div>
            <div class="color-picker-item">
                <a-color-picker :style="'margin: 2px'" :popup-translate="[-182, 0]"  showPreset  defaultValue="#165DFF" showText  size="mini" />
            </div>
        </a-col>

       </a-row>
     
    </Panel>
</template >
<script lang="ts" setup>
   import { Text, defineKey } from 'leafer-ui'

   import { ref,onActivated,watch,computed,onMounted } from 'vue';

   import Panel from './panel.vue' 


</script>
<style lang="less" scoped>
    :deep(.color-picker-wrap){
        
        //  display: flex;

        .color-picker-item{
            margin: 4px;
        }
    }
</style>