<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from 'vue';

import { type Tags, tagCategories, tagLabels, tagColors } from '@/scripts/tags';
import TestTitle from "@/components/TestTitle.vue";

import { getAuth } from '@/scripts/api';
const isAuthed = ref<boolean>(false);
onMounted(() => {
  const auth = getAuth();
  isAuthed.value = !!auth;
})

const { name, description, tags, id } = defineProps<{
  index: number;
  name: string;
  description: string;
  tags: Tags;
  id: string;
  visibility: boolean;
}>();

const emit = defineEmits(["delete", "updateStatus", "edit"]);

const isExpanded = ref(false);

function handleClick(event) {
  console.log(isExpanded.value)
  isExpanded.value = !isExpanded.value;
}

import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();

const isVisible = ref(false);

const openPopup = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: "დარწმუნებული ხარ?",
    onShow: () => {
      isVisible.value = true;
    },
    onHide: () => {
      isVisible.value = false;
    },
    accept: () => {
      console.log("soiii")
      emit("delete");
    },
  });
};

const shrunkenButtonDT = ref({ smPaddingX: '0.25rem', smPaddingY: '0.25rem', iconOnlyWidth: '2rem' });
</script>

<template>
  <div
    class="test-card bg-surface-50 hover:bg-surface-100 hover:cursor-pointer rounded select-none overflow-hidden flex align-center stretch"
    :class="{ active: isExpanded }">
    <div class="w-full">
      <div class="flex justify-between items-center flex-grow gap-2">
        <span class="flex items-center flex-grow" @click="handleClick">
          <span class="color-indicator" :style="{ backgroundColor: tagColors.subject[tags.subject[0]] }" />
          <Button v-if="isAuthed" @click.stop.prevent="$emit('updateStatus')"
            :icon="['pi', visibility ? 'pi-eye' : 'pi-eye-slash'].join(' ')"
            :severity="visibility ? 'secondary' : 'warn'" :dt="shrunkenButtonDT" text size="small" />
          <span class="w-4" v-else></span>
          <TestTitle :name="name" :id="'P' + id.substring(id.length - 6)" />
        </span>

        <span class="controls flex p-1">
          <Button v-if="isAuthed" @click="openPopup" icon="pi pi-trash" severity="danger" :dt="shrunkenButtonDT" text
            size="small" />
          <Button v-if="isAuthed" @click.stop.prevent="$emit('edit')" icon="pi pi-pencil" severity="secondary"
            :dt="shrunkenButtonDT" text size="small" />
          <Button @click.stop.prevent="$router.push('/test/' + id)" icon="pi pi-play" label="დაწყება"
            class="start-button" :dt="shrunkenButtonDT" size="small" />
        </span>
      </div>

      <hr v-if="isExpanded" class="w-full h-px bg-gray-200 border-0" />

      <div v-if="isExpanded" class="p-4" @click="handleClick">
        <div class="tags">
          <div class="category-list">
            <!-- TAGS GO HERE -->
            <span class="category" v-for="category in tagCategories.filter((c) => tags[c].length > 0)" :key="category"
              :style="{
                backgroundColor: 'color-mix(in lab, ' + tagColors[category][tags[category][0]] + ' 50%, white 10%)',
              }
                ">
              <div class="category-title">
                {{ tagLabels[category] }}
              </div>

              <div class="tag-list">
                <span v-for="tag in tags[category]" :key="tag">
                  {{ tag }}
                </span>
              </div>
            </span>
          </div>
        </div>

        <p class="description" v-if="description">
          <strong>აღწერა:</strong> {{ description }}
        </p>
      </div>
    </div>

  </div>

</template>

<style scoped lang="scss">
.color-indicator {
  content: " ";
  display: block;
  width: 1.1rem;
  height: 2.5rem;
}

.test-card {
  .controls {
    button {
      opacity: 0;
    }
  }

  &:hover,
  &.active {
    button {
      opacity: 1;
    }
  }

  .tags {
    overflow-x: scroll;
    overflow-y: hidden;

    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    & {
      -ms-overflow-style: none;
      /* IE and Edge */
      scrollbar-width: none;
      /* Firefox */
    }

    div.category-list {
      display: flex;
      gap: 1rem;
    }

    span.category {
      border-radius: 1rem;
      padding: 0.5rem 0.7rem;

      border: 1px solid var(--p-surface-200);
    }

    div.category-title {
      font-weight: bold;
    }

    div.tag-list {
      display: flex;
      gap: 0.5rem;
    }
  }

  .description {
    margin-top: 1rem;
  }
}
</style>
