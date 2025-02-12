<script setup lang="ts">
import { ref } from "vue";

const op = ref()

function handleClick(event) {
  op.value.toggle(event);
}
</script>

<template>
  <Button icon="pi pi-table" @click="handleClick" severity="secondary" v-tooltip.bottom="'მენდელეევის ცხრილი'" />
  <Popover ref="op">
    <Image src="/mendeleev.jpg" width="900" />
  </Popover>
</template>
