<script setup>
import { defineEmits, defineProps, defineModel, watch, ref } from "vue";

const { list, info } = defineProps(["list", "info"]);
const current = defineModel();
const visited = ref([0]);
defineEmits(["click"]);

watch(current, (val) => {
  if (!visited.value.includes(val)) {
    visited.value.push(val);
  }
});

const shrunkenButtonDT = ref({ smPaddingX: '0.25rem', smPaddingY: '0.25rem', iconOnlyWidth: '2rem' });

const op = ref();

function showInfo(event) {
  op.value.toggle(event);
}
</script>

<template>
  <div class="progress-bar">
    <template v-for="(item, index) in list" :key="index">
      <button :class="{
        visited: visited.includes(index),
        active: current == index,
      }" @click="$emit('click', index)">
        {{ item }}
        <template v-if="current == index">
          <button @click.stop="showInfo">
            ინფ.
          </button>
        </template>
      </button>

      <span :class="{
        separator: true,
        visited: visited.includes(index) && visited.includes(index + 1)
      }" v-if="index < list.length - 1"></span>
    </template>
  </div>

  <Popover ref="op">
    <DataTable :value="info[current + 1]" />
  </Popover>
</template>

<style scoped>
.progress-bar {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
}

.progress-bar>button {
  width: 2rem;
  height: 2rem;
  padding: 0 0.6rem;
  border-radius: 1rem;
  border: solid 1px var(--p-surface-200);
  color: var(--p-surface-200);
  box-sizing: border-box;
}

.progress-bar>button>button {
  /* width: 2rem; */
  height: 1.5rem;
  padding: 0 0.5rem;
  /* border: 1px solid var(--p-surface-200); */
  background-color: var(--p-surface-200);
  color: var(--p-surface-400);
  border-radius: 1rem;
  font-size: 1rem;
  margin-left: 0.25rem;
}

.progress-bar>button>button:hover {
  background-color: var(--p-surface-100);
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
  width: fit-content;
  padding-right: 0.25rem;
}

span.visited {
  background-color: var(--p-primary-color);
}

.separator {
  color: var(--p-surface-200)
}
</style>
