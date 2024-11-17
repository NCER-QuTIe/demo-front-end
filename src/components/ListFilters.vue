<script setup>
import { ref, defineProps, watchEffect } from "vue";

const props = defineProps(["tag_options"]);

const filter_tags = defineModel();
</script>

<template>
    <Fluid class="w-[20rem] justify-self-end">
        <Fieldset
            legend="ფილტრი"
            toggleable
            collapsed
            class="p-4 rounded-border border border-surface flex flex-col gap-4"
        >
            <MultiSelect
                v-model="filter_tags"
                id="test-tags"
                :options="tag_options"
                optionLabel="label"
                placeholder="თაგები"
                filter
                display="chip"
                class="w-full"
            />
        </Fieldset>
    </Fluid>
</template>

<style scoped>
input[type="file"] {
    display: none;
}
</style>
