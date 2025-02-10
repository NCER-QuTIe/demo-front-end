<script setup lang="ts">
import { defineModel } from 'vue';
import { saveTestResponse } from '@/scripts/responseCollector.ts';
import { TestResponse } from "@/scripts/types.d.ts";

const visible = defineModel({ required: true });
</script>

<template>
  <Dialog v-model:visible="visible" modal header="ინსტრუქცია">
    <slot>
      <!-- TODO:  -->
      Some content
    </slot>
  </Dialog>
</template>
