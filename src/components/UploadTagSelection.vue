<script setup>
import { defineModel, defineProps, defineEmits, ref, watchEffect } from "vue";

const props = defineProps(["options", "placeholder"]);
const emit = defineEmits(["new-tag"]);

const model = defineModel();

const options = ref(props.options);
watchEffect(() => {
  options.value = props.options;
});
</script>

<template>
  <MultiSelect
    v-model="model"
    display="chip"
    :placeholder="props.placeholder"
    :options="options"
    optionLabel="label"
    filter
    :maxSelectedLabels="10"
    class="w-full"
  >
    <template #footer>
      <div class="p-3 flex justify-between">
        <Button
          label="დამატება"
          severity="secondary"
          text
          size="small"
          icon="pi pi-plus"
          @click="$emit('new-tag', $event)"
        />
      </div>
    </template>
  </MultiSelect>
</template>
