<template>
    <div :class="`${baseClassName}__head`">
        <div :class="`${baseClassName}__mode`">
            <template v-if="colorModes?.length === 1">
                {{ COLOR_MODES[colorModes[0]] }}
            </template>
            <template v-else>
                <a-radio-group
                        type="button"
                        size="small"
                        v-model="modeValue"
                        @change="handleModeChange">
                    <a-radio v-for="(value, key) in allColorModes" :key="key" :value="value">{{COLOR_MODES[value]}}</a-radio>
                </a-radio-group>
<!--                <TRadioGroup-->
<!--                        variant="default-filled"-->
<!--                        size="small"-->
<!--                        v-model="modeValue"-->
<!--                        @change="handleModeChange"-->
<!--                >-->
<!--                    <template v-for="(value, key) in COLOR_MODES" :key="key">-->
<!--                        <TRadioButton :value="key">{{ value }}</TRadioButton>-->
<!--                    </template>-->
<!--                </TRadioGroup>-->
            </template>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

import props from '../props';
import { COLOR_MODES } from '../const';
import { TdColorModes } from '../interfaces';
import { useBaseClassName } from '../hooks';

export default defineComponent({
    name: 'PanelHeader',
    props: {
        ...props,
        mode: {
            type: String as PropType<TdColorModes>,
            default: 'color',
        },
        togglePopup: {
            type: Function,
        },
        onModeChange: {
            type: Function,
            default: () => {
                return () => {
                };
            },
        },
    },
    setup(props) {
        const baseClassName = useBaseClassName();
        const modeValue = ref(props.mode);
        const allColorModes = computed(() => {
            return props.colorModes.concat(props.cusColorModes)
        })
        const handleModeChange = (v: string) => props.onModeChange(v);
        watch(
            () => props.mode,
            (v) => (modeValue.value = v),
        );
        return {
            baseClassName,
            modeValue,
            handleModeChange,
            COLOR_MODES,
            allColorModes
        };
    },
})
</script>
<style scoped>

</style>
