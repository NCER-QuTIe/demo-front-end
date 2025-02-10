<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <Panel header="კვლევა" pt:content:class="text-center" v-if="$route.query.research">
    <div class="p-8 border border-surface rounded bg-surface-50">
      <img :src="`/${$route.query.research}.svg`" />
    </div>
  </Panel>
</template>

<style lang="scss" scoped>
img {
  width: 70%;
}
</style>
