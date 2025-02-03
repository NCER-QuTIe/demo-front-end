<script setup>
import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';
import { useRouter } from "vue-router";
import { login } from "@/scripts/api";

const toast = useToast();
const router = useRouter();

const initialValues = ref({
  username: '',
  password: ''
});

const resolver = zodResolver(
  z.object({
    email: z.string().min(1, 'გთხოვთ შეიყვანოთ მომხმარებლის ელ. ფოსტა.'),
    password: z.string().min(1, 'გთხოვთ შეიყვანოთ მომხმარებლის პაროლი.')
  })
);

async function onFormSubmit(e) {
  if (e.valid) {
    let res = await login(e.states.username.value, e.states.password.value);

    if (res) {
      toast.add({ severity: 'success', summary: 'ავთენტიკაცია წარმატებულია', life: 3000 });
      router.push("/list/");
    } else {
      toast.add({ severity: 'error', summary: 'ავთენტიკაცია წარუმატებელია', life: 3000 });
    }
  }
}
</script>

<template>
  <div class="m-auto w-min h-full card flex flex-col justify-center">
    <Toast />

    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-60">
      <div class="flex flex-col gap-1">
        <InputText name="username" type="passowrd" placeholder="მომხმარებლის სახელი" fluid />
        <Message v-if="$form.username?.invalid" severity="error">{{ $form.username.error.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <Password name="password" placeholder="პაროლი" :feedback="false" toggleMask fluid />
        <Message v-if="$form.password?.invalid" severity="error">{{ $form.password.error.message }}</Message>
      </div>
      <Button type="submit" severity="secondary" label="შესვლა" />
    </Form>
  </div>
</template>
