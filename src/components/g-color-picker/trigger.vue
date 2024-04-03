<template>
    <a-input
            :clearable="clearable"
            :size="size"
            :disabled="disabled"
            v-model="value"
            style="width: max-content"
            @change="handleChange"
            v-bind="inputProps">
        <template #prefix>
            <div :class="[`${baseClassName}__trigger--default__color`, `${baseClassName}--bg-alpha`]">
            <span
                    :class="[
                'color-inner',
                {
                  [sizeClassNames[size]]: size !== 'medium',
                },
              ]"
                    :style="{ background: value }"
            ></span>
            </div>
        </template>
    </a-input>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { Color } from './utils';
import { TdColorPickerProps } from './type';
import { useBaseClassName } from './hooks';
import { useCommonClassName } from './hooks/useConfig';

export default defineComponent({
    name: 'DefaultTrigger',
    inheritAttrs: false,
    props: {
        color: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        inputProps: {
            type: Object as PropType<TdColorPickerProps['inputProps']>,
            default: () => {
                return {
                    autoWidth: true,
                };
            },
        },
        onTriggerChange: {
            type: Function,
            default: () => {
                return () => {
                };
            },
        },
        size: {
            type: String as PropType<TdColorPickerProps['size']>,
            default: 'mini',
        },
    },
    setup(props) {
        const baseClassName = useBaseClassName();
        const value = ref(props.color);
        const {SIZE: sizeClassNames} = useCommonClassName();
        watch(
            () => [props.color],
            () => (value.value = props.color),
        );

        const handleChange = (input: string) => {
            if (input === props.color) {
                return;
            }
            if (input && !Color.isValid(input)) {
                value.value = props.color;
            } else {
                value.value = input;
            }
            console.log('value.value=',value.value)
            props.onTriggerChange(value.value);
        };

        return {
            baseClassName,
            value,
            handleChange,
            sizeClassNames,
        };
    },
})
</script>
<style scoped>

</style>
