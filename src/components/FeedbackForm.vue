<script setup>
import { ref, onMounted } from "vue";
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { putFeedback, getAuth } from '@/scripts/api.ts';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const isAuthed = ref(false);

onMounted(() => {
  isAuthed.value = getAuth() ? true : false;
})

const resolver = zodResolver(
  z.object({
    email: z.string().email({ message: "გთხოვთ შეიყვანოთ სწორი ელ. ფოსტის მისამართი" }).or(z.literal('')),
    feedback: z.string().min(10, { message: "გთხოვთ უფრო დეტალურად აღწეროთ პრობლემა" })
  })
)

const loading = ref(false);

async function onFormSubmit(a) {
  loading.value = true;

  const res = await putFeedback(
    a.states.email.value,
    a.states.feedback.value,
  )

  if (!res.ok) {
    toast.add({ severity: 'error', summary: 'შეცდომა', detail: 'უკუკავშირის ატვირთვა ვერ მოხერხდა', life: 3000 });
  } else {
    toast.add({ severity: 'success', detail: 'უკუკავშირი წარმატებით აიტვირთა', life: 3000 });
    localStorage.setItem("feedback-email", a.states.email.value);
  }

  loading.value = false;

  a.reset();
};

const initialValues = ref({
  email: localStorage.getItem("feedback-email") || '',
  feedback: ''
})

import { Form } from '@primevue/forms';
</script>

<template>
  <Fluid>
    <Panel header="უკუკავშირი" class="rounded-border border border-surface bg-surface"
      pt:content:class="flex flex-col gap-4">
      <Form :initialValues class="flex flex-col gap-4" :resolver="resolver" @submit="onFormSubmit" v-slot="$form">

        <InputText name="email" type="email" placeholder="თქვენი ელ. ფოსტა" />
        <Message v-if="$form.email?.invalid" severity="error">{{ $form.email.error?.message }}</Message>

        <Textarea name="feedback" placeholder="ჩაწერეთ პრობლემა" />
        <Message v-if="$form.feedback?.invalid" severity="error">{{ $form.feedback.error?.message }}</Message>

        <Button type="submit" severity="secondary" icon="pi pi-send" label="გაგზავნა" :loading />

        <span v-if="isAuthed" class="text-center">
          <RouterLink to="/feedback/" class="text-blue-500 underline">უკუკავშირების სია</RouterLink>
        </span>
      </Form>
    </Panel>
  </Fluid>
</template>
