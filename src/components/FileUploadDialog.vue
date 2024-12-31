<script setup>
const { old_tag_options } = defineProps(["old_tag_options"]);
const emit = defineEmits(["close"]);

import { ref, watchEffect, defineModel } from "vue";
import {
  emptyTagsObject,
  tagsObjectToList,
  tagCategories,
  tagLabels,
} from "@/scripts/tags";

const file = defineModel("file");
const name = defineModel("name");
const tags = defineModel("tags");
const description = defineModel("description");
const editting = defineModel("editting");

function stopEditting() {
  file.value = undefined;
  name.value = "";
  tags.value = empty;
  description.value = "";
  editting.value = null;
}

import UploadTagSelection from "./UploadTagSelection.vue";

import { blob2base64 } from "@/scripts/blob2base64";

async function upload() {
  const myFile = file.value;
  console.log(myFile);
  const b64 = await blob2base64(myFile, myFile.type);

  const obj = {
    name: name.value,
    description: description.value,
    packageBase64: b64,
    tags: tagsObjectToList(tags.value),
    status: 0,
  };

  if (editting.value !== null) {
    console.log("editting... first deleting the old version");
    const url = `${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest/${editting.value}`;
    const res = await fetch(url, {
      method: "DELETE",
    });
    if (res.ok) {
      console.log("done");
    } else {
      console.log("failed");
    }
    editting.value = null;
  }

  console.log("uploading the files");
  const res = await fetch(
    `${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    },
  );
  if (res.ok) {
    console.log("done");
  } else {
    console.log("failed");
  }

  emit("close");
}

const tag_options = ref(old_tag_options);
watchEffect(() => {
  tag_options.value = old_tag_options;
});
const op = ref();
const new_tag = ref();
const new_tag_category = ref("");
function add_new_tag(val) {
  if (!tag_options.value[new_tag_category.value].includes(new_tag.value)) {
    tag_options.value[new_tag_category.value].push(new_tag.value);
  }
  op.value.hide();
}
</script>

<template>
  <Fluid class="w-[20rem]">
    <div
      class="p-4 rounded-border border border-surface flex flex-col gap-4 bg-surface"
      :style="{
        backgroundColor: editting ? '#fa02' : 'transparent',
      }"
    >
      <h1 class="text-lg font-bold text-center">ტესტის ატვირთვა</h1>

      <FileUpload
        ref="fileupload"
        mode="basic"
        name="demo[]"
        customUpload
        :maxFileSize="2000000"
        @select="file = $event.files[0]"
        chooseLabel="ფაილის არჩევა"
      />

      <FloatLabel variant="on">
        <InputText id="test-name-input" v-model="name" />
        <label for="test-name-input">ტესტის სახელი</label>
      </FloatLabel>

      <div
        class="flex flex-col gap-4 p-4 border-surface rounded border bg-white"
      >
        <template v-for="(category, index) in tagCategories" :key="index">
          <UploadTagSelection
            v-model="tags[category]"
            :placeholder="tagLabels[category]"
            :options="
              tag_options[category].map((e) => ({ label: e, value: e }))
            "
            @new-tag="
              new_tag_category = category;
              op.toggle($event);
            "
          />
        </template>
      </div>

      <FloatLabel variant="on">
        <Textarea
          id="test-description-textarea"
          v-model="description"
          autoResize
          rows="5"
          cols="30"
        />
        <label for="test-description-textarea">აღწერა</label>
      </FloatLabel>

      <div class="flex gap-4">
        <Button
          label="გაუქმება"
          severity="warn"
          @click="stopEditting()"
          v-if="editting !== null"
        />
        <Button label="ატვირთვა" @click="upload()" />
      </div>
    </div>
  </Fluid>

  <Popover ref="op">
    <div class="flex flex-col gap-4">
      <InputText v-model="new_tag" />
      <Button label="confirm" @click="add_new_tag" />
    </div>
  </Popover>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
