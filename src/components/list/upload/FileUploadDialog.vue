<script setup lang="ts">
const { old_tag_options } = defineProps(["old_tag_options"]);
const emit = defineEmits(["close"]);

import { ref, watch, watchEffect, defineModel } from "vue";
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
  putTestWithURL,
  Test,
  TestPatch,
  TestWithPackage,
} from "@/scripts/api";

const toast = useToast();

const visible = defineModel<boolean>("visible");

const url = defineModel<string>("url");
const file = defineModel<any>("file");

const editingID = defineModel<string | null>("editingID");

const data = defineModel<{
  file: any;
  name: string;
  tags: Tags;
  description: string;
  kind: "qti" | "external";
  url?: string;
}>("data");

function stopeditingID() {
  data.value.name = "";
  data.value.tags = emptyTagsObject();
  data.value.description = "";
  data.value.file = undefined;
  data.value.kind = "qti";

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
    name: data.value.name,
    description: data.value.description,
    tags: data.value.tags,
  };

  console.log(editingID.value, obj);
  const res = await patchTestWithID(editingID.value, data.value.kind, obj);

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

  if (editingID.value !== null) {
    throw new Error("invalid state. Trying to upload a test while editingID is not empty");
  }

  const test: Test = {
    name: data.value.name,
    description: data.value.description,
    tags: data.value.tags,
    status: true,
    kind: data.value.kind,
  };

  let res;
  console.log("attempting test upload...");
  if (data.value.kind === "qti") {
    const myFile = data.value.file;
    const packageBase64 = await blob2base64(myFile, myFile.type);


    const testWithPackage: TestWithPackage = {
      test,
      packageBase64,
    };
    res = await putTestWithPackage(testWithPackage);
  } else if (data.value.kind === "external") {
    res = await putTestWithURL({
      test, url: url.value
    })
  }

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

// ITEMS

const numberOfItems = ref(null);

const itemTags = ref([]);
const itemTagCategories = [
  "area",
  "process",
  "context",
  "difficulty",
];
const itemTagLabels = {
  process: "პროცესი",
  difficulty: "სირთულე",
  area: "სფერო",
  context: "კონტექსტი"
};
const itemTagOptions = ref({
  "process": [],
  "context": [],
  "difficulty": [],
  "area": [],
});

watchEffect(numberOfItems, (n) => {
  for (let i = itemTags.value.length; i < n; i++) {
    itemTags.push([]);

    for (const category of itemTagCategories) {
      data.value.tags[`#${i}-${category}`] = [];
    }
  }
  itemTags.value.splice(n);
});

const isExternal = ref(false);
watch(isExternal, (v) => {
  data.value.kind = v ? "external" : "qti";
})
</script>

<template>
  <Button severity="secondary" label="ახალი ტესტის ატვირთვა" @click="visible = true" />

  <Dialog class="w-[48em]" v-model:visible="visible" modal :header="editingID ? 'რედაქტირება' : 'ახალი ტესტის ატვირთვა'"
    @hide="stopeditingID()">
    <Fluid class="flex flex-col gap-4 bg-surface">
      <h1 class="text-lg font-bold text-center">ტესტის ატვირთვა</h1>

      <Panel header="შიგთავსი" v-if="!editingID" pt:content:class="flex flex-col gap-4">
        <div class="flex gap-4 items-center justify-center">
          <span>QTI</span>
          <ToggleSwitch v-model="isExternal" :dt="{ checked: { backgorund: 'var(--p-surface-100)' } }" />
          <span>ბმული</span>
        </div>

        <FloatLabel v-if="data.kind == 'external'" variant="on">
          <InputText id="test-name-input" v-model="url" />
          <label for="test-name-input">მისამართი</label>
        </FloatLabel>

        <FileUpload v-if="data.kind == 'qti'" ref="fileupload" mode="basic" customUpload :maxFileSize="2000000"
          @select="data.file = $event.files[0]" chooseLabel="ფაილის არჩევა" />
      </Panel>

      <FloatLabel variant="on">
        <InputText id="test-name-input" v-model="data.name" />
        <label for="test-name-input">ტესტის სახელი</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Textarea id="test-description-textarea" v-model="data.description" autoResize rows="5" cols="60" />
        <label for="test-description-textarea">აღწერა</label>
      </FloatLabel>

      <Panel header="თაგები" pt:content:class="flex flex-col gap-4">
        <template v-for="(category, index) in tagCategories" :key="index">
          <UploadTagSelection v-model="data.tags[category]" :placeholder="tagLabels[category]"
            :options="tag_options[category]" :colors="tagColors[category]" @new-tag="
              new_tag_category = category;
            op.toggle($event);
            " :extendible="true" />
        </template>
      </Panel>

      <Panel header="დავალებები" pt:content:class="flex flex-col gap-4">
        <FloatLabel variant="on">
          <InputNumber id="test-items-amount" v-model="numberOfItems" />
          <label for="test-items-amount">დავალებების რაოდენობა</label>
        </FloatLabel>

        <template v-if="numberOfItems > 0">
          <hr class="w-full h-px bg-gray-200 border-0" />

          <Panel v-for="i in numberOfItems" :key="i" :header="`დავალება ${i}`" pt:content:class="flex flex-col gap-4">
            <template v-for="(category, index) in itemTagCategories" :key="index">
              <UploadTagSelection v-model="data.tags[`#${i}-${category}`]" :placeholder="itemTagLabels[category]"
                :options="itemTagOptions[category]" :extendible="true" />
            </template>
          </Panel>
        </template>
      </Panel>


      <div class="flex gap-4">
        <Button label="გაუქმება" severity="warn" @click="stopeditingID()" v-if="editingID !== null" />

        <Button v-if="editingID" label="შენახვა" @click="edit" />
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
