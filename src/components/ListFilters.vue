<script setup>
import { emptyTagsObject, tagCategories, tagLabels } from "@/scripts/tags";
import { ref, defineProps, watchEffect } from "vue";

const props = defineProps(["tag_options"]);

const filters = defineModel();
</script>

<template>
  <Fluid class="w-[20rem] justify-self-end">
    <Panel
      header="ძებნა"
      class="rounded-border border border-surface"
      pt:content:class="flex flex-col gap-4"
    >
      <template v-for="category in tagCategories">
        <MultiSelect
          v-model="filters[category]"
          id="test-tags"
          :options="tag_options[category].map((e) => ({ label: e, value: e }))"
          :maxSelectedLabels="1"
          selectedItemsLabel="არჩეულია {} თაგი"
          option-label="label"
          option-value="value"
          :placeholder="tagLabels[category]"
          filter
          display="chip"
          class="w-full"
        />
      </template>
    </Panel>
  </Fluid>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
