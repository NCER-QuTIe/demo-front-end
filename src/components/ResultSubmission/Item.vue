<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';

const { name, time, id } = defineProps<{
  name: string,
  time: string,
  id: string
}>();

const emit = defineEmits(["delete"]);

const dt = ref({ smPaddingX: '0.25rem', smPaddingY: '0.25rem', iconOnlyWidth: '2rem' });
</script>

<template>
  <div class="flex items-baseline justify-between">
    <div class="bg-surface-50 rounded p-1 pl-2 flex-grow rounded-md">
      <TestTitle :name="name" :id="id.substring(0, 8)" :slide="false" />
    </div>
    <Button :dt="dt" icon="pi pi-trash" severity="danger" text size="small" @click="$emit('delete')" />
  </div>
</template>
