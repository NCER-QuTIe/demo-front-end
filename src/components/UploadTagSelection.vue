<script setup>
import { defineModel, defineProps, defineEmits, ref, watchEffect } from "vue";

const { options, placeholder, colors } = defineProps(["options", "placeholder", "colors"]);
const emit = defineEmits(["new-tag"]);

const model = defineModel();
</script>

<template>
  <Fluid>
    <MultiSelect v-model="model" display="chip" :placeholder="placeholder" :options="options" filter
      :maxSelectedLabels="10">
      <template #footer>
        <div class="p-3 flex justify-between">
          <Button label="დამატება" severity="secondary" text size="small" icon="pi pi-plus"
            @click="$emit('new-tag', $event)" />
        </div>
      </template>
      <template #option="slotProps">
        <div class="flex items-center">
          <div class="color-marker" :style="{ backgroundColor: tagColors[slotProps.option] }"></div>
          <div>{{ slotProps.option }}</div>
        </div>
      </template>
    </MultiSelect>
  </Fluid>
</template>

<style scoped>
.color-marker {
  width: 1rem;
  height: 1rem;
  content: " ";
  display: block;
}
</style>
