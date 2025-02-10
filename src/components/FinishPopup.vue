<script setup lang="ts">
import { defineProps, defineEmits, defineModel } from 'vue';
import { saveTestResponse } from '@/scripts/responseCollector.ts';
import { TestResponse } from "@/scripts/types.d.ts";

const { testResponse } = defineProps<{
  testResponse: TestResponse,
}>();

const emit = defineEmits(["close"]);

const visible = defineModel('visible', { required: true });

async function download() {
  saveTestResponse(testResponse);
  emit("close");
}
</script>

<template>
  <Dialog v-model:visible="visible" modal header="დასასრული">
    <div class="flex gap-4 justify-end">
      <Button label="ნაშრომის წაშლა" severity="danger" outlined @click="$emit('close')" />
      <Button @click="download" label="ნაშრომის შენახვა" />
    </div>
  </Dialog>
</template>
