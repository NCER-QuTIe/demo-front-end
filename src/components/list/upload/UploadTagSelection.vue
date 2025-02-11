<script setup lang="ts">
import { defineModel, defineProps, defineEmits } from "vue";

const { options, placeholder, colors = {}, extendible = false } = defineProps<{
  options: string[];
  placeholder: string[];
  colors: { [key: string]: string };
  extendible: boolean;
}>();

const emit = defineEmits(["new-tag"]);

const model = defineModel();
</script>

<template>
  <MultiSelect v-model="model" display="chip" :placeholder="placeholder" :options="options" filter
    :maxSelectedLabels="10">
    <template #footer v-if="extendible">
      <div class="p-3 flex justify-between">
        <Button label="დამატება" severity="secondary" text size="small" icon="pi pi-plus"
          @click="$emit('new-tag', $event)" />
      </div>
    </template>
    <template #option="slotProps">
      <div class="flex items-center gap-1">
        <div class="color-marker" :style="{ backgroundColor: colors[slotProps.option] }"></div>
        <div>{{ slotProps.option }}</div>
      </div>
    </template>
  </MultiSelect>
</template>

<style scoped>
.color-marker {
  width: 1rem;
  height: 1rem;
  content: " ";
  display: block;
  border-radius: 1rem;
}
</style>
