<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSavedTestResponseList, deleteTestResponse } from "@/scripts/responseCollector.ts";
import Item from "./Item.vue";

const list = ref([]);
const fullName = ref("ერეკლე ბაგრატიონი");
const teacherEmail = ref("emzar.papava@gmail.com");

onMounted(() => {
  list.value = getSavedTestResponseList();
  console.log(list.value);
})

function deleteItem(id: string) {
  deleteTestResponse(id);
  list.value = getSavedTestResponseList();
  console.log("deleted", id)
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
          <InputText id="fullname" v-model="fullName" pt:root:class="text-center" variant="filled" />
          <label for="fullname">სახელი, გვარი</label>
        </IftaLabel>

        <FloatLabel variant="on">
          <label for="teacher-email">მასწავლებლის ელ. ფოსტა</label>
          <InputText id="teacher-email" type="email" v-model="teacherEmail" />
        </FloatLabel>

        <Button label="გაგზავნა" iconPos="right" icon="pi pi-send" />
      </Panel>
    </Fluid>
  </template>
</template>
