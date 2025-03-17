<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const urls = {
  "PISA": "PISA.png",
  "TIMSS": "TIMSS.svg",
  "PIRLS": "PIRLS.svg",
  "computers": "computers.png"
}
</script>

<template>
  <Panel header="კვლევა" pt:content:class="text-center" v-if="$route.query.research">
    <div class="p-8 border border-surface rounded bg-surface-50">
      <img :src="`/${urls[$route.query.research]}`" />
    </div>
  </Panel>
</template>

<style lang="scss" scoped>
img {
  width: 90%;
}
</style>
