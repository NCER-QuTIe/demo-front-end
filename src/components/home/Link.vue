<script setup>
const { url, imgSrc = "" } = defineProps(["url", "name", "imgSrc", "disabled"]);
</script>

<template>
  <RouterLink :to="url" class="w-[12rem] border border-surface h-[12rem] flex flex-col justify-center"
    style="{opacity: disabled ? 0.3 : 1.0}">
    <img :src="imgSrc" :alt="name" />
  </RouterLink>
</template>

