<script setup>
import { emptyTagsObject, tagCategories, tagLabels } from "@/scripts/tags";
import { ref, defineProps, watchEffect } from "vue";

const props = defineProps(["tag_options"]);

const filters = defineModel();
</script>

<template>
  <Fluid>
    <Panel header="ძებნა" class="rounded-border border border-surface" pt:content:class="flex flex-col gap-4">
      <template v-for="category in tagCategories">
        <UploadTagSelection v-model="filters[category]" :placeholder="tagLabels[category]" :options="tag_options[category]
          " />
      </template>
    </Panel>
  </Fluid>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
