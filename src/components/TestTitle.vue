<script setup lang="ts">
import { defineProps } from "vue";

const { name, id, slide = true } = defineProps<{
  name: string;
  id: string;
  slide: boolean;
}>();
</script>

<template>
  <span class="test-title" :class="{ slide }">
    <span class="test-title-id">#{{ id }}</span>
    <span class="test-title-name">{{ name }}</span>
  </span>
</template>

<style scoped lang="scss">
.test-title.slide {
  position: relative;

  .test-title-id {
    display: inline-block;
    font-family: monospace;
    font-size: 1rem;
    color: gray;

    opacity: 0.05;

    transition: 0.2s;
    min-width: 6em;
  }

  .test-title-name {
    display: inline-block;
    transition: 0.2s;

    transform: translateX(-6em);
  }

  &:hover {
    .test-title-id {
      opacity: 1;
    }

    .test-title-name {
      transform: none;
    }
  }
}

.test-title:not(.slide) {
  position: relative;

  .test-title-id {
    position: absolute;
    left: 0;
    font-family: monospace;
    font-size: 1rem;
    color: gray;

    opacity: 0.05;

    transition: 0.2s;
    margin-right: 1ch;
  }

  .test-title-name {
    transition: 0.2s;
  }

  &:hover {
    .test-title-id {
      opacity: 1;
    }

    .test-title-name {
      opacity: 0.05;
    }
  }
}
</style>
