<script setup>
import { tagCategories } from "@/scripts/tags";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["deleteTest", "toggleStatus", "editTest"]);

import { ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();
const isVisible = ref(false);
const openPopup = (event, id) => {
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
      emit("deleteTest", id);
    },
  });
};

const edit = (event, data) => {
  emit("editTest", data);
};

const first = ref(0);
const rows = ref(10);

const openTab = ref(-1);
</script>

<template>
  <div
    class="flex flex-col gap-4 border w-full p-4 max-w-[180em] mx-auto border-surface justify-between rounded-border"
  >
    <Accordion
      class="mx-auto w-full h-min"
      @tab-close="() => (openTab = -1)"
      @tab-open="({ index }) => (openTab = index)"
    >
      <AccordionPanel
        v-for="(d, ind) in data.slice(first, first + rows)"
        :key="d.name + ind"
        :value="ind"
        class="border-none"
      >
        <AccordionHeader>
          <div class="test-listing flex justify-between items-baseline flex-grow gap-2 pr-4">
            <span>
              {{ d.name }}
            </span>
            <Button
              :outlined="openTab != ind"
              @click="$router.push('/test/' + d.id)"
              aria-label="Begin"
              icon="pi pi-play"
              label="დაწყება"
              class="start-button"
            />
          </div>
        </AccordionHeader>

        <AccordionContent pt:content:class="flex flex-col gap-4">
          <span class="tags flex gap-2">
            <template v-for="category in tagCategories">
              <template v-for="(tag, i) in d.tags[category]">
                <Tag class="tag" rounded :value="tag" severity="secondary" />
              </template>
            </template>
          </span>

          <Panel header="აღწერა">
            {{ d.description }}
          </Panel>

          <span class="actions flex gap-4 justify-between">
            <ConfirmPopup>
              <template
                #container="{ message, acceptCallback, rejectCallback }"
              >
                <div class="rounded p-4">
                  <span>{{ message.message }}</span>
                  <div class="flex items-center gap-2 mt-4">
                    <Button
                      label="დადასტურება"
                      @click="acceptCallback"
                      severity="danger"
                      size="small"
                    ></Button>
                    <Button
                      label="გაუქმება"
                      outlined
                      @click="rejectCallback"
                      severity="secondary"
                      size="small"
                      text
                    ></Button>
                  </div>
                </div>
              </template>
            </ConfirmPopup>

            <span class="flex gap-4 align-baseline">
              <Button
                @click="openPopup($event, d.id)"
                icon="pi pi-trash"
                label="წაშლა"
                severity="danger"
                aria-label="Visible"
              />
              <Button
                @click="edit($event, d)"
                icon="pi pi-pencil"
                label="რედაქტირება"
                severity="warn"
                aria-label="Visible"
              />
            </span>
          </span>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <Paginator
      v-model:first="first"
      v-model:rows="rows"
      :totalRecords="data.length"
      :rowsPerPageOptions="[10, 20, 30]"
    ></Paginator>
  </div>
</template>

<style scoped>
.start-button {
  opacity: 0;
}

.p-accordionpanel[data-p-active="true"] .start-button,
.p-accordionpanel:hover .start-button {
  opacity: 1;
}
</style>
