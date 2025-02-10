<script setup lang="ts">
import { ref, defineModel, onMounted, watch } from "vue";
import { getSavedTestResponseList, deleteTestResponse } from "@/scripts/responseCollector.ts";
import Item from "./Item.vue";

const list = ref([]);
const fullName = ref();
const teacherEmail = ref();

const shouldRender = defineModel();

onMounted(() => {
  list.value = getSavedTestResponseList();
  shouldRender.value = list.length > 0;
  console.log(`setting render state to ${shouldRender.value}`)
})

watch(list, (newList) => {
  shouldRender.value = newList.length > 0;
  console.log(`setting render state to ${shouldRender.value}`)
});

function deleteItem(id: string) {
  deleteTestResponse(id);
  list.value = getSavedTestResponseList();
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

        <!-- <FloatLabel variant="on"> -->
        <IftaLabel>
          <label for="teacher-email">მასწავლებლის ელ. ფოსტა</label>
          <InputText id="teacher-email" type="email" v-model="teacherEmail" variant="filled" />
        </IftaLabel>
        <!-- </FloatLabel> -->

        <Button label="გაგზავნა" iconPos="right" icon="pi pi-send" />
      </Panel>
    </Fluid>
  </template>
</template>
