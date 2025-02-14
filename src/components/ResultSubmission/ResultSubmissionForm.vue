<script setup lang="ts">
import { ref, defineModel, onMounted, watch } from "vue";
import { getSavedTestResponseBundle, getSavedTestResponseList, deleteTestResponse } from "@/scripts/responseCollector.ts";
import { putTestResponse } from "@/scripts/api.ts";
import { useToast } from 'primevue/usetoast';
import Item from "./Item.vue";

const list = ref([]);
const fullName = ref();
const teacherEmail = ref();

const shouldRender = defineModel();

onMounted(() => {
  list.value = getSavedTestResponseList();
  shouldRender.value = list.length > 0;
  console.log(`setting render state to ${shouldRender.value}`)

  fullName.value = localStorage.getItem("student-full-name");
  teacherEmail.value = localStorage.getItem("student-teacher-email");
})

watch(fullName, (v) => localStorage.setItem("student-full-name", v))
watch(teacherEmail, (v) => localStorage.setItem("student-teacher-email", v))

watch(list, (newList) => {
  shouldRender.value = newList.length > 0;
  console.log(`setting render state to ${shouldRender.value}`)
});

function deleteItem(id: string) {
  deleteTestResponse(id);
  list.value = getSavedTestResponseList();
}

const toast = useToast();

async function submit() {
  const obj = getSavedTestResponseBundle(fullName.value);

  const res = await putTestResponse(teacherEmail.value, obj);

  if (!res.ok) {
    toast.add({ severity: 'error', summary: 'შეცდომა', detail: 'შედეგების ატვირთვა ვერ მოხერხდა', life: 3000 });
  } else {
    toast.add({ severity: 'success', detail: 'ტესტები წარმატებით აიტვირთა', life: 3000 });
  }
}
</script>

<template>
  <template v-if="list.length">
    <Fluid>
      <Panel header="შედეგები" pt:content:class="flex flex-col gap-4">
        <ol class="list-disc pl-5 flex flex-col gap-2">
          <li v-for="(item, index) in list" :key="index">
            <Item :name="item.testName" :id="item.testID" :time="item.time" @delete="deleteItem(item.testID)" />
          </li>
        </ol>

        <IftaLabel>
          <label for="fullname">სახელი, გვარი</label>
          <InputText id="fullname" v-model="fullName" variant="filled" />
        </IftaLabel>

        <IftaLabel>
          <label for="teacher-email">მასწავლებლის ელ. ფოსტა</label>
          <InputText id="teacher-email" type="email" v-model="teacherEmail" variant="filled" />
        </IftaLabel>

        <Button label="გაგზავნა" iconPos="right" icon="pi pi-send" @click="submit" />
      </Panel>
    </Fluid>
  </template>
</template>
