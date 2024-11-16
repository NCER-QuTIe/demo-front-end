<script setup>
import { ref, defineProps, watchEffect } from "vue";

const props = defineProps(["data"]);

const tag_options = ref([]);

const filter_tags = defineModel();

watchEffect(() => {
    tag_options.value = props.data
        .map((e) => e.tags)
        .flat()
        .map((e) => ({ label: e, value: e }));
});

console.log(tag_options);
</script>

<template>
    <Fluid class="w-[20rem] justify-self-end">
        <div
            class="p-4 rounded-border border border-surface flex flex-col gap-4"
        >
            <FloatLabel variant="on">
                <MultiSelect
                    v-model="filter_tags"
                    id="test-tags"
                    :options="tag_options"
                    optionLabel="label"
                    filter
                    class="w-full"
                />
                <label for="test-tags">თაგები</label>
            </FloatLabel>
        </div>
    </Fluid>
</template>

<style scoped>
input[type="file"] {
    display: none;
}
</style>
