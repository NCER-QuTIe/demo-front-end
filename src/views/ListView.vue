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

let show_upload = ref(false);

async function closeUpload() {
  let res = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/admin/qtiTests`);
  let json = await res.json();

  data.splice(0);
  data.push(...json);
  show_upload.value = !show_upload.value;
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
  <div class="grid grid-cols-[1fr_2fr_1fr] gap-4 h-full p-4">
    <ListFilters :tag_options="tag_options" v-model="filter_tags" />
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
    />
    <FileUploadDialog
      :show="show_upload"
      :old_tag_options="tag_options"
      @close="closeUpload()"
    />
  </div>
</template>
