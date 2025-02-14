<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type Feedback, getFeedbackList, deleteFeedbackWithID } from '@/scripts/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const data = ref([]);

onMounted(async () => {
  data.value = await getFeedbackList()
})

async function deleteFeedback(id: string) {
  const res = await deleteFeedbackWithID(id);

  if (!res.ok) {
    toast.add({ severity: 'error', summary: 'შეცდომა', detail: 'უკუკავშირის წაშლა ვერ მოხერხდა', life: 3000 });
  } else {
    toast.add({ severity: 'success', detail: 'უკუკავშირი წარმატებით წაიშალა', life: 3000 });
    data.value = await getFeedbackList()
  }
}

const shrunkenButtonDT = ref({ smPaddingX: '0.25rem', smPaddingY: '0.25rem', iconOnlyWidth: '2rem' });
</script>

<template>
  <div class="feedback ">
    <div class="date"> ატვირთვის თარიღი </div>
    <div class="author"> ავტორი </div>
    <div class="content"> აღწერა </div>
  </div>
  <div class="feedback " v-for="f in data" :key="f.id">
    <Button icon="pi pi-trash" severity="danger" text @click="deleteFeedback(f.id)" size="small"
      :dt="shrunkenButtonDT" />
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
