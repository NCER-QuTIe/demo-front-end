<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type Feedback, getFeedbackList } from '@/scripts/api';

const data = ref([]);

onMounted(async () => {
  data.value = await getFeedbackList()
})
</script>

<template>
  <div class="feedback ">
    <div class="date"> ატვირთვის თარიღი </div>
    <div class="author"> ავტორი </div>
    <div class="content"> აღწერა </div>
  </div>
  <div class="feedback " v-for="f in data" :key="f.id">
    <div class="date"> {{ f.uploaded }} </div>
    <div class="author"> {{ f.email }} </div>
    <div class="content"> {{ f.message }} </div>
  </div>
</template>

<style scoped lang="scss">
.feedback {
  display: flex;
  margin-bottom: 1rem;
  font-family: monospace;

  .date {
    width: 16rem;
    border-right: 1px solid var(--p-surface-100);
  }

  .author {
    width: 12rem;
    border-right: 1px solid var(--p-surface-100);
  }

  div {
    padding: 0 4px;
  }
}
</style>
