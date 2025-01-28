<script setup>
import { defineEmits, defineProps, defineModel, watch, ref } from "vue";

const { list } = defineProps(["list"]);
const current = defineModel();
const visited = ref([0]);
defineEmits(["click"]);

watch(current, (val) => {
  if (!visited.value.includes(val)) {
    visited.value.push(val);
  }
});
</script>

<template>
  <div class="progress-bar">
    <template v-for="(item, index) in list" :key="index">
      <button
        :class="{
          visited: visited.includes(index),
          active: current == index,
        }"
        @click="$emit('click', index)" >
        {{ item }}
      </button>
      <span :class="{ 
        separator: true,
        visited: visited.includes(index) && visited.includes(index + 1)
      }" v-if="index < list.length - 1"></span>
    </template>
  </div>
</template>

<style scoped>
.progress-bar {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
}

.progress-bar button {
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;
  border: solid 1px var(--p-surface-200);
  color: var(--p-surface-200);
  box-sizing: border-box;
}

.progress-bar span {
  content: "";
  width: 1rem;
  height: 1px;
  background-color: var(--p-surface-200);
}

button.visited:not(.active) {
  color: var(--p-primary-color);
  border-color: var(--p-primary-color);
}

button.active {
  color: var(--p-surface-50);
  border-color: var(--p-surface-400);
  background-color: var(--p-surface-400);
}

span.visited {
  background-color: var(--p-primary-color);
}

.separator {
  color: var(--p-surface-200)
}
</style>

