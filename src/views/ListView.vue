<script setup>
import FileUploadDialog from "@/components/FileUploadDialog.vue";
import FeedbackForm from "@/components/FeedbackForm.vue";
import ListFilters from "@/components/ListFilters.vue";
import TestList from "@/components/TestList.vue";
import {
  tagsListToObject,
  emptyTagsObject,
  tagCategories,
} from "@/scripts/tags.ts";
import { getAuth, getTestWithPackageWithID, patchTestVisibilityStatusWithID } from '@/scripts/api.ts';
import { reactive, ref, watchEffect, onMounted } from "vue";
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

const data = reactive([]);
async function loadTests() {
  data.splice(0);

  let rawData = await getTestList();
  data.push(...rawData);
}

onMounted(loadTests);

async function deleteTest(id) {
  console.log("AEEEE");
  let res = await deleteTestWithID(id);

  await loadTests();

  if (!res.ok) {
    toast.add({ severity: 'error', summary: 'შეცდომა', detail: 'ტესტის წაშლა ვერ მოხერხდა', life: 3000 });
    console.log(res);
  } else {
    toast.add({ severity: 'success', detail: 'ტესტი წარმატებით წაიშალა', life: 3000 });
  }
}

let file = ref();
let name = ref("");
let tags = ref(emptyTagsObject());
let description = ref("");
let editingId = ref(null);

async function editTest(id) {
  const { test, packageBase64 } = await getTestWithPackageWithID(id);

  file.value = b64toBlob(packageBase64, "application/zip");
  name.value = test.name;
  description.value = test.description;
  tags.value = test.tags;

  editingId.value = test.id;
  showUpload.value = true;
}

async function updateStatus(id, new_status) {
  let res = await patchTestVisibilityStatusWithID(id, new_status);

  if (res) {
    loadTests();
  } else {
    toast.add({ severity: 'error', summary: 'შეცდომა', detail: 'ტესტის ხილვადობის შეცვლა ვერ მოხერხდა', life: 3000 });
  }
}


const filters = ref(emptyTagsObject());

const route = useRoute();
onMounted(() => {
  if (route.query.research) {
    let new_tags = emptyTagsObject();
    new_tags.tag.push(route.query.research);
    filters.value = new_tags;
  }
})

const tag_options = ref(emptyTagsObject());
watchEffect(() => {
  let res = emptyTagsObject();
  for (let category of tagCategories) {
    for (let testTags of data.map((e) => e.tags)) {
      for (let tag of testTags[category]) {
        if (!res[category].includes(tag)) {
          res[category].push(tag);
        }
      }
    }
  }
  tag_options.value = res;
});
</script>

<template>
  <div class="grid grid-cols-[20rem_1fr] gap-4 h-full p-4">
    <Fluid class="w-[20rem] justify-self-end flex flex-col gap-4">
      <ListFilters :tag_options="tag_options" v-model="filters" />
      <FeedbackForm />
      <Button v-if="isAuthed" severity="secondary" label="ახალი ტესტის ატვირთვა"
        @click="if (isAuthed) showUpload = true;" />
    </Fluid>

    <TestList :data="data.filter((test) =>
      tagCategories.every(
        (category) =>
          filters[category].length == 0 ||
          filters[category].some((tag) =>
            test.tags[category].includes(tag),
          ),
      ),
    )
      " @deleteTest="deleteTest" @updateStatus="updateStatus" @edit="editTest" />
  </div>
  <FileUploadDialog v-model:visible="showUpload" :old_tag_options="tag_options" v-model:file="file" v-model:name="name"
    v-model:tags="tags" v-model:description="description" v-model:editingID="editingId" @close="loadTests()" />
</template>
