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
    class="p-8 w-full bg-surface-100 hover:bg-surface-200 rounded aspect-[4/3] flex flex-col justify-center"
    style="{opacity: disabled ? 0.3 : 1.0}">
    <img :src="imgSrc" :alt="name" />
  </RouterLink>
</template>
