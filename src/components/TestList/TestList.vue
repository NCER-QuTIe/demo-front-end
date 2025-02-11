<script setup lang="ts">
import { tagCategories } from "@/scripts/tags";
import { type Test } from "@/scripts/api";

import TestCard from '@/components/TestList/TestCard.vue';
import LinkTestCard from '@/components/TestList/LinkTestCard.vue';

const { data } = defineProps<{
  data: Test[]
}>();

const emit = defineEmits(["deleteTest", "updateStatus", "editTest"]);

import { ref } from "vue";


const first = ref(0);
const rows = ref(12);

const openTab = ref(-1);

function editTest(data) {
  emit("editTest", data.id, data.kind);
}

function deleteTest(data) {
  emit("deleteTest", data.id, data.kind);
}

function updateStatus(data) {
  console.log(data.status)
  emit('updateStatus', data.id, data.kind, !data.status);
}
</script>

<template>
  <div class="overflow-y-auto overflow-x-hidden min-w-[38rem]">
    <div class="flex flex-col gap-4 w-full max-w-[180em] mx-auto justify-between">
      <template v-for="(d, ind) in data.slice(first, first + rows)" :key="d.name + ind">
        <LinkTestCard v-if="d.kind === 'external'" :index="ind" :name="d.name" :description="d.description"
          :tags="d.tags" :id="d.id" @edit="editTest(d)" :visibility="d.status" @delete="deleteTest(d)"
          @updateStatus="updateStatus(d)" />

        <TestCard v-if="d.kind === 'qti'" :index="ind" :name="d.name" :description="d.description" :tags="d.tags"
          :id="d.id" @edit="editTest(d)" :visibility="d.status" @delete="deleteTest(d)"
          @updateStatus="updateStatus(d)" />
      </template>
    </div>

    <Paginator v-if="data.length > 12" v-model:first="first" v-model:rows="rows" :totalRecords="data.length"
      :rowsPerPageOptions="[12, 24, 36]">
    </Paginator>

    <ConfirmPopup>
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="rounded p-4">
          <span>{{ message.message }}</span>
          <div class="flex items-center gap-2 mt-4">
            <Button label="გაუქმება" outlined @click="rejectCallback" severity="secondary" size="small" text></Button>
            <Button label="დადასტურება" @click="acceptCallback" severity="danger" size="small"></Button>
          </div>
        </div>
      </template>
    </ConfirmPopup>
  </div>
</template>
