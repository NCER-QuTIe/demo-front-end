<script setup lang="ts">
import { ref, defineModel, watchEffect } from 'vue';
import { ItemInfo } from '@/scripts/types.d.ts';
import { itemInfoCategories, itemInfoLabels } from '@/scripts/itemInfo.ts';

const itemInfo = defineModel<ItemInfo>("value");
const options = defineModel("options");
const numberOfItems = ref(0);

watchEffect(() => {
  for (let i = 0; i < numberOfItems.value; i++) {
    if (itemInfo.value[i]) {
      continue;
    }

    itemInfo.value[i] = {};

    for (const category of itemInfoCategories) {
      itemInfo.value[i][category] = "";
    }
  }
});
</script>

<template>
  <Panel header="დავალებები" pt:content:class="flex flex-col gap-4">
    <FloatLabel variant="on">
      <InputNumber id="test-items-amount" v-model="numberOfItems" />
      <label for="test-items-amount">დავალებების რაოდენობა</label>
    </FloatLabel>

    <template v-if="numberOfItems > 0">
      <hr class="w-full h-px bg-gray-200 border-0" />

      <Panel v-for="i in numberOfItems" :key="i" :header="`დავალება ${i}`" pt:content:class="flex flex-col gap-4">
        <template v-for="category in itemInfoCategories" :key="category">
          <UploadTagSelection v-model="itemInfo[i - 1][category]" :placeholder="itemInfoLabels[category]"
            :options="options[category]" :extendible="true" />
        </template>
      </Panel>
    </template>
  </Panel>
</template>
