<script setup>
import FileUploadDialog from "@/components/list/upload/FileUploadDialog.vue";
import FeedbackForm from "@/components/FeedbackForm.vue";
import ListFilters from "@/components/ListFilters.vue";
import TestList from "@/components/TestList/TestList.vue";
import ResultSubmission from "@/components/ResultSubmission/ResultSubmissionForm.vue";
import ResearchIndicator from "@/components/list/ResearchCard.vue";
import {
  tagsListToObject,
  emptyTagsObject,
  tagCategories,
} from "@/scripts/tags.ts";
import { getAuth, getTestWithPackageWithID, patchTestVisibilityStatusWithID } from '@/scripts/api.ts';
import { reactive, ref, watchEffect, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from 'primevue/usetoast';
import { b64toBlob } from "@/scripts/blob2base64";

let showUpload = ref(false);
let isAuthed = ref(false);
onMounted(() => {
  isAuthed.value = getAuth() ? true : false;
})

const toast = useToast();

import { getTestList, deleteTestWithID } from '@/scripts/api.ts';

const data = ref([]);
async function loadTests() {
  data.value = await getTestList();
}

onMounted(loadTests);

async function deleteTest(id, kind) {
  console.log("AEEEE");
  let res = await deleteTestWithID(id, kind);

  if (!res.ok) {
    toast.add({ severity: 'error', summary: 'შეცდომა', detail: 'ტესტის წაშლა ვერ მოხერხდა', life: 3000 });
  } else {
    toast.add({ severity: 'success', detail: 'ტესტი წარმატებით წაიშალა', life: 3000 });
  }

  await loadTests();
}

let editingID = ref(null);
const fileUploadData = ref({
  name: "",
  tags: emptyTagsObject(),
  description: "",
  kind: 'qti',
  itemInfo: {}
})

async function editTest(id) {
  let test = data.value.find((e) => e.id === id);
  console.log(test)

  fileUploadData.value.name = test.name;
  fileUploadData.value.description = test.description;
  fileUploadData.value.tags = test.tags;
  fileUploadData.value.kind = test.kind;
  fileUploadData.value.itemInfo = test.itemInfo;

  editingID.value = test.id;
  showUpload.value = true;
}

async function updateStatus(id, kind, new_status) {
  let res = await patchTestVisibilityStatusWithID(id, kind, new_status);

  if (res) {
    loadTests();
  } else {
    toast.add({ severity: 'error', summary: 'შეცდომა', detail: 'ტესტის ხილვადობის შეცვლა ვერ მოხერხდა', life: 3000 });
  }
}

const filters = ref(emptyTagsObject());
const searchTerm = ref("");

const route = useRoute();
onMounted(() => {
  let new_tags = emptyTagsObject();
  for (const category of tagCategories) {
    if (route.query[category]) {
      new_tags[category].push(route.query[category]);
    }
  }
  filters.value = new_tags;
})

const tag_options = ref(emptyTagsObject());

watch(data, () => {
  let res = emptyTagsObject();
  for (let category of tagCategories) {
    for (let testTags of data.value.map((e) => e.tags || e.test.tags)) {
      for (let tag of testTags[category]) {
        if (!res[category].includes(tag)) {
          res[category].push(tag);
        }
      }
    }
  }
  tag_options.value = res;
});


// RENDER STATE

const renderState = ref(true);

const filteredData = ref([]);

watchEffect((newData) => {
  console.log(filters.value)
  filteredData.value = data.value.filter((test) => {
    return tagCategories.every(
      (category) => {
        const someTagMatches = filters.value[category].some((tag) => test.tags[category].includes(tag));
        const matchesTags = filters.value[category].length == 0 || someTagMatches;
        const matchesTerm = test.name.startsWith(searchTerm.value);
        console.log(matchesTerm)

        return matchesTags && matchesTerm;
      }
    );
  })

  console.log(filteredData.value)
});
</script>

<!-- v-model:file="file" v-model:name="name" v-model:tags="tags" v-model:description="description" -->

<template>
  <div class="grid grid-cols-[20rem_1fr_20rem] gap-4 h-full p-4">
    <Fluid class="w-[20rem] overflow-x-hidden overflow-y-auto justify-self-end ">
      <div class="flex flex-col gap-4">
        <ResearchIndicator />

        <ListFilters :tag_options="tag_options" v-model:filters="filters" v-model:search-term="searchTerm" />

        <GeneralInstructions />

        <FileUploadDialog v-if="isAuthed" v-model:visible="showUpload" :old_tag_options="tag_options"
          v-model:data="fileUploadData" v-model:editingID="editingID" @close="loadTests()" />
      </div>
    </Fluid>

    <TestList :data="filteredData" @deleteTest="deleteTest" @updateStatus="updateStatus" @editTest="editTest" />

    <Fluid class="w-[20rem] justify-self-end flex flex-col gap-4">
      <ResultSubmission v-model="renderState" />

      <FeedbackForm />
    </Fluid>
  </div>
</template>
