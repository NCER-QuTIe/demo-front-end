<script setup>
import FileUploadDialog from "@/components/FileUploadDialog.vue";
import ListFilters from "@/components/ListFilters.vue";
import TestList from "@/components/TestList.vue";
import {
  tagsListToObject,
  emptyTagsObject,
  tagCategories,
} from "@/scripts/tags.ts";
import { reactive, ref, watchEffect, onMounted } from "vue";
import { useRoute } from "vue-router";

let data = reactive([]);

fetch(`${import.meta.env.VITE_API_ROUTE}/api/admin/qtiTests`)
  .then((data) => data.json())
  .then((json) => {
    data.push(...json);
    for (let i = 0; i < data.length; i++) {
      data[i].tags = tagsListToObject(data[i].tags);
    }
  });

async function deleteTest(id) {
  let res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest/${id}`,
    {
      method: "DELETE",
    },
  );
  if (res.ok) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data.splice(i, 1);
      }
    }
  } else {
    console.log(res);
  }
}

let file = ref();
let name = ref("");
let tags = ref(emptyTagsObject());
let description = ref("");
let editting = ref(null);

async function editTest(test) {
  const url = `${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest/${test.id}`;
  let res = await fetch(url);
  let json = await res.json();
  let raw_file = await fetch(`data:text/plain;base64,${json.packageBase64}`);
  let blob = await raw_file.blob();
  file.value = new Blob([blob], { type: "application/zip" });

  name.value = test.name;

  description.value = test.description;

  tags.value = test.tags;

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
  <div class="grid grid-cols-[1fr_2.5fr_1fr] gap-4 h-full p-4">
    <ListFilters :tag_options="tag_options" v-model="filters" />
    <TestList
      :data="
        data.filter((test) =>
          tagCategories.every(
            (category) =>
              filters[category].length == 0 ||
              filters[category].some((tag) =>
                test.tags[category].includes(tag),
              ),
          ),
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
