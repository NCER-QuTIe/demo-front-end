<script setup lang="ts">
import { tagCategories } from "@/scripts/tags";
import { type Test } from "@/scripts/api";

const { data } = defineProps<{
  data: Test[]
}>();

const emit = defineEmits(["deleteTest", "updateStatus", "edit"]);

import { ref } from "vue";


const first = ref(0);
const rows = ref(12);

const openTab = ref(-1);

const edit = (event, data) => {
  emit("editTest", data.id);
};

////

import TestCard from '@/components/TestList/TestCard.vue';
</script>

<template>
  <ConfirmPopup>
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="rounded p-4">
        <span>{{ message.message }}</span>
        <div class="flex items-center gap-2 mt-4">
          <Button label="დადასტურება" @click="acceptCallback" severity="danger" size="small"></Button>
          <Button label="გაუქმება" outlined @click="rejectCallback" severity="secondary" size="small" text></Button>
        </div>
      </div>
    </template>
  </ConfirmPopup>
  <div class="overflow-scroll min-w-[45rem]">
    <div class="flex flex-col gap-4 w-full max-w-[180em] mx-auto justify-between">
      <template v-for="(d, ind) in data.slice(first, first + rows)" :key="d.name + ind">
        <TestCard :name="d.name" :description="d.description" :tags="d.tags" :id="d.id" @edit="$emit('edit', d.id)"
          :visibility="d.status" @delete="$emit('deleteTest', d.id)"
          @updateStatus="$emit('updateStatus', d.id, !d.status)" />
      </template>
    </div>

    <Paginator v-if="data.length > 12" v-model:first="first" v-model:rows="rows" :totalRecords="data.length"
      :rowsPerPageOptions="[12, 24, 36]">
    </Paginator>
  </div>
</template>
