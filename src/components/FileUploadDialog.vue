<script setup lang="ts">
const { old_tag_options } = defineProps(["old_tag_options"]);
const emit = defineEmits(["close"]);

import { ref, watchEffect, defineModel } from "vue";
import { useToast } from "primevue/usetoast";
import {
  emptyTagsObject,
  tagsObjectToList,
  tagCategories,
  tagLabels,
  tagColors,
  type Tags,
} from "@/scripts/tags";
import {
  deleteTestWithID,
  patchTestWithID,
  putTestWithPackage,
  Test,
  TestPatch,
  TestWithPackage,
} from "@/scripts/api";

const toast = useToast();

const file = defineModel<any>("file");
const name = defineModel<string>("name");
const tags = defineModel<Tags>("tags");
const description = defineModel<string>("description");
const editingID = defineModel<string | null>("editingID");
const visible = defineModel<boolean>("visible");

function stopeditingID() {
  file.value = undefined;
  name.value = "";
  tags.value = emptyTagsObject();
  description.value = "";
  editingID.value = null;

  visible.value = false;
}

import UploadTagSelection from "./UploadTagSelection.vue";

import { blob2base64 } from "@/scripts/blob2base64";

async function edit() {
  if (!editingID.value) {
    throw new Error("invalid state, trying to edit a test while editingID is empty");
  }

  const obj: TestPatch = {
    name: name.value,
    description: description.value,
    tags: tags.value,
  };

  const res = await patchTestWithID(editingID.value, obj);

  if (res.ok) {
    visible.value = false;
    emit("close");
  } else {
    console.log("failed.");
    toast.add({
      severity: "error",
      summary: "შეცდომა",
      detail: "ტესტის ატვირთვა ვერ მოხერხდა",
      life: 3000,
    });
  }
}

async function upload() {
  const myFile = file.value;
  console.log(myFile);
  const packageBase64 = await blob2base64(myFile, myFile.type);

  if (editingID.value !== null) {
    throw new Error("invalid state. Trying to upload a test while editingID is not empty");
  }

  console.log("attempting test upload...");

  const test: Test = {
    name: name.value,
    description: description.value,
    status: true,
    tags: tags.value,
  };
  const testWithPackage: TestWithPackage = {
    test,
    packageBase64,
  };
  console.log(testWithPackage);
  const res = await putTestWithPackage(testWithPackage);

  if (res.ok) {
    console.log("done.");
  } else {
    console.log("failed.");
    toast.add({
      severity: "error",
      summary: "შეცდომა",
      detail: "ტესტის ატვირთვა ვერ მოხერხდა",
      life: 3000,
    });
    return false;
  }

  emit("close");
  return true;
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
  <Dialog class="w-[48em]" v-model:visible="visible" modal maximizable
    :header="editingID ? 'რედაქტირება' : 'ახალი ტესტის ატვირთვა'" @hide="stopeditingID()">
    <Fluid class="flex flex-col gap-4 bg-surface">
      <h1 class="text-lg font-bold text-center">ტესტის ატვირთვა</h1>

      <FileUpload v-if="!editingID" ref="fileupload" mode="basic" name="demo[]" customUpload :maxFileSize="2000000"
        @select="file = $event.files[0]" chooseLabel="ფაილის არჩევა" />

      <FloatLabel variant="on">
        <InputText id="test-name-input" v-model="name" />
        <label for="test-name-input">ტესტის სახელი</label>
      </FloatLabel>

      <div class="flex flex-col gap-4 p-4 border-surface rounded border bg-white">
        <template v-for="(category, index) in tagCategories" :key="index">
          <UploadTagSelection v-model="tags[category]" :placeholder="tagLabels[category]"
            :options="tag_options[category]" :colors="tagColors[category]" @new-tag="
              new_tag_category = category;
            op.toggle($event);
            " :extendible="true" />
        </template>
      </div>

      <FloatLabel variant="on">
        <Textarea id="test-description-textarea" v-model="description" autoResize rows="5" cols="60" />
        <label for="test-description-textarea">აღწერა</label>
      </FloatLabel>

      <div class="flex gap-4">
        <Button label="გაუქმება" severity="warn" @click="stopeditingID()" v-if="editingID !== null" />

        <Button v-if="editingID" label="შენახვა" @click="edit()" />
        <Button v-else label="ატვირთვა" @click="upload()" />
      </div>
    </Fluid>
  </Dialog>

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
