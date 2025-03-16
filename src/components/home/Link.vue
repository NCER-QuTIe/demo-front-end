<script setup lang="ts">
const { url, imgSrc = "", disabled } = defineProps<{
  url: string;
  imgSrc: string;
  name: string;
  disabled: boolean;
}>();
</script>

<template>
  <RouterLink :to="url"
    class="p-8 w-full bg-surface-100 hover:bg-surface-200 rounded aspect-square flex flex-col justify-center"
    v-if="!disabled">
    <img :src="imgSrc" :alt="name" />
  </RouterLink>
  <div v-else class="p-8 w-full bg-surface-100 rounded aspect-square flex flex-col justify-center">
    <img :src="imgSrc" :alt="name" />
  </div>
</template>
