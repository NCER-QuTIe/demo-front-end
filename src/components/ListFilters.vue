<script setup>
import { ref, defineProps, watchEffect } from "vue";

const props = defineProps(["tag_options"]);

const filter_subject = defineModel("subject");
const filter_grade = defineModel("grade");
const filter_cognitive = defineModel("cognitive");
const filter_content = defineModel("content");
const filter_tags = defineModel("tags");
</script>

<template>
  <Fluid class="w-[20rem] justify-self-end">
    <Panel
      header="ძებნა"
      class="rounded-border border border-surface"
      pt:content:class="flex flex-col gap-4"
    >
      <MultiSelect
        v-model="filter_grade"
        id="test-tags"
        :options="
          tag_options
            .filter((e) => e.label.startsWith('grade-'))
            .map((e) => ({ ...e, label: e.label.slice(6) }))
        "
        :maxSelectedLabels="1"
        selectedItemsLabel="არჩეულია {} თაგი"
        optionLabel="label"
        placeholder="კლასი"
        filter
        display="chip"
        class="w-full"
      />
      <MultiSelect
        v-model="filter_subject"
        id="test-tags"
        :options="
          tag_options
            .filter((e) => e.label.startsWith('subject-'))
            .map((e) => ({ ...e, label: e.label.slice(8) }))
        "
        :maxSelectedLabels="1"
        selectedItemsLabel="არჩეულია {} თაგი"
        optionLabel="label"
        placeholder="საგანი"
        filter
        display="chip"
        class="w-full"
      />

      <MultiSelect
        v-model="filter_cognitive"
        id="test-tags"
        :options="
          tag_options
            .filter((e) => e.label.startsWith('cognitive-'))
            .map((e) => ({ ...e, label: e.label.slice(10) }))
        "
        :maxSelectedLabels="1"
        selectedItemsLabel="არჩეულია {} თაგი"
        optionLabel="label"
        placeholder="კოგნიტური სფერო"
        filter
        display="chip"
        class="w-full"
      />
      <MultiSelect
        v-model="filter_content"
        id="test-tags"
        :options="
          tag_options
            .filter((e) => e.label.startsWith('content-'))
            .map((e) => ({ ...e, label: e.label.slice(8) }))
        "
        :maxSelectedLabels="1"
        selectedItemsLabel="არჩეულია {} თაგი"
        optionLabel="label"
        placeholder="შინაარსობრივი სფერო"
        filter
        display="chip"
        class="w-full"
      />

      <MultiSelect
        v-model="filter_tags"
        id="test-tags"
        :options="
          tag_options.filter(
            (e) =>
              !e.label.startsWith('cognitive-') &&
              !e.label.startsWith('content-') &&
              !e.label.startsWith('grade-') &&
              !e.label.startsWith('subject-'),
          )
        "
        :maxSelectedLabels="1"
        selectedItemsLabel="არჩეულია {} თაგი"
        optionLabel="label"
        placeholder="თაგები"
        filter
        display="chip"
        class="w-full"
      />
    </Panel>
  </Fluid>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
