<script setup>
import { emptyTagsObject, tagCategories, tagLabels, tagColors } from "@/scripts/tags";
import { ref, defineProps, watchEffect } from "vue";

const props = defineProps(["tag_options"]);

const filters = defineModel("filters");
const searchTerm = defineModel("searchTerm");
</script>

<template>
  <Fluid>
    <Panel header="ძებნა" class="rounded-border border border-surface" pt:content:class="flex flex-col gap-4">
      <template v-for="category in tagCategories">
        <UploadTagSelection v-model="filters[category]" :colors="tagColors[category]" :placeholder="tagLabels[category]"
          :options="tag_options[category]
            " />
      </template>

      <FloatLabel variant="on">
        <label for="seach-keyowrd">დასახელება</label>
        <InputText id="seach-keyowrd" type="text" v-model="searchTerm" />
      </FloatLabel>
    </Panel>
  </Fluid>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
