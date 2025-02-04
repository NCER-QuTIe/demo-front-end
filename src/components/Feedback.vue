<script setup lang="ts">
import { defineProps, defineEmits, defineModel } from 'vue';
import { compileGradeReport } from '@/scripts/gradeReport.ts';

const { results, itemStates } = defineProps({
  results: Array,
  itemStates: Array,
});
const emit = defineEmits(["close"]);

const visible = defineModel('visible', { required: true });

async function download() {
  console.log(results);
  await compileGradeReport(itemStates, results);
}
</script>

<template>
  <Dialog v-model:visible="visible" modal maximizable header="შედეგები"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="min-w-[50rem] flex flex-col gap-4">
      <DataTable :value="results" size="small" showGridlines stripedRows>
        <Column field="problem" sortable header="ამოცანა"></Column>
        <Column field="score" sortable header="მიღებული ქულა"></Column>
        <Column field="max_score" sortable header="მაქსიმალური ქულა"></Column>
      </DataTable>

      <div class="flex gap-4 justify-end">
        <Button label="დახურვა" severity="secondary" outlined @click="$emit('close')" />
        <Button @click="download" label="ნაშრომის გადმოწერა" />
      </div>
    </div>
  </Dialog>
</template>
