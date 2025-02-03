<script setup>
import { ref, onMounted } from "vue";
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { putFeedback, getAuth } from '@/scripts/api.ts';

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

const onFormSubmit = (a) => {
  console.log(a)

  putFeedback(
    a.states.email.value,
    a.states.feedback.value,
  )
};

const initialValues = ref({
  email: '',
  feedback: ''
})

import { Form } from '@primevue/forms';
</script>

<template>
  <Fluid>
    <Form class="p-4 rounded-border border border-surface flex flex-col gap-4 bg-surface" :initialValues
      :resolver="resolver" @submit="onFormSubmit" v-slot="$form">
      <h1 class="text-lg font-bold text-center">უკუკავშირი</h1>

      <InputText name="email" type="email" placeholder="ელ. ფოსტა" />
      <Message v-if="$form.email?.invalid" severity="error">{{ $form.email.error?.message }}</Message>

      <Textarea name="feedback" placeholder="არაფერი არ მუშაობს..." />
      <Message v-if="$form.feedback?.invalid" severity="error">{{ $form.feedback.error?.message }}</Message>

      <Button type="submit" severity="secondary" label="გაგზავნა" />

      <span v-if="isAuthed" class="text-center">
        <RouterLink to="/feedback/" class="text-blue-500 underline">უკუკავშირების სია</RouterLink>
      </span>
    </Form>
  </Fluid>
</template>
