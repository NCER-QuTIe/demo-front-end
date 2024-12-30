<script setup>
import FileUploadDialog from "@/components/FileUploadDialog.vue";
import ListFilters from "@/components/ListFilters.vue";
import TestList from "@/components/TestList.vue";
import { reactive, ref, watchEffect } from "vue";

let data = reactive([]);

fetch(`${import.meta.env.VITE_API_ROUTE}/api/admin/qtiTests`)
  .then((data) => data.json())
  .then((json) => {
    data.push(...json);
    console.log(data);
  });

async function deleteTest(ind) {
  let res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest/${data[ind].id}`,
    {
      method: "DELETE",
    },
  );
  if (res.ok) {
    data.splice(ind, 1);
  } else {
    console.log(res);
  }
}

let file = ref();
let name = ref("");
let tags = reactive({
  subjects: [],
  grades: [],
  cognitives: [],
  content: [],
  tags: [],
});
let description = ref("");
let editting = ref(null);
async function editTest(test) {
  const url = `${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest/${test.id}`;
  let res = await fetch(url);
  let json = await res.json();
  let b64 = json.packageBase64;
  let raw_file = await fetch(`data:text/plain;base64,${b64}`);
  let blob = await raw_file.blob();
  blob = new Blob([blob], { type: "application/zip" });
  console.log(blob);
  file.value = blob;
  console.log("fetched dataaa!!!");
  name.value = test.name;
  description.value = test.description;
  const tag_objects = test.tags.map((e) => ({
    label: e,
    value: e,
  }));
  tags.subjects = tag_objects.filter((e) => e.label.startsWith("subject-"));
  tags.grades = tag_objects.filter((e) => e.label.startsWith("grade-"));
  tags.cognitives = tag_objects.filter((e) => e.label.startsWith("cognitive-"));
  tags.content = tag_objects.filter((e) => e.label.startsWith("content-"));
  tags.tags = tag_objects.filter(
    (e) =>
      !e.label.startsWith("cognitive-") &&
      !e.label.startsWith("content-") &&
      !e.label.startsWith("grade-") &&
      !e.label.startsWith("subject-"),
  );
  editting.value = test.id;
}

async function toggleStatus(ind) {
  let res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data[ind].id,
        status: 1 - data[ind].status,
      }),
    },
  );

  if (res.ok) {
    data[ind].status = 1 - data[ind].status;
  } else {
    console.log(res);
  }
}

let show_upload = ref(true);

async function closeUpload() {
  let res = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/admin/qtiTests`);
  let json = await res.json();

  data.splice(0);
  data.push(...json);
  // show_upload.value = !show_upload.value;
}
let filter_tags = ref([]);

const tag_options = ref([]);
watchEffect(() => {
  let res = [];
  for (let tags of data.map((e) => e.tags)) {
    for (let tag of tags) {
      if (!res.includes(tag)) {
        console.log(tag);
        res.push(tag);
      }
    }
  }
  tag_options.value = res.map((e) => ({ label: e, value: e }));
});
</script>

<template>
  <div class="grid grid-cols-[1fr_2.5fr_1fr] gap-4 h-full p-4">
    <ListFilters :tag_options="tag_options" v-model:tags="filter_tags" />
    <TestList
      :data="
        data.filter((test) =>
          filter_tags.length === 0
            ? true
            : filter_tags.every((tag) => test.tags.includes(tag.value)),
        )
      "
      @deleteTest="deleteTest"
      @toggleStatus="toggleStatus"
      @editTest="editTest"
    />
    <FileUploadDialog
      v-if="show_upload"
      :old_tag_options="tag_options"
      v-model:file="file"
      v-model:name="name"
      v-model:tags="tags"
      v-model:description="description"
      v-model:editting="editting"
      @close="closeUpload()"
    />
  </div>
</template>
