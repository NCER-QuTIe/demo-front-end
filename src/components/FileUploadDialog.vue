<script setup>
const { old_tag_options } = defineProps(["old_tag_options"]);
const emit = defineEmits(["close"]);

import { ref, watchEffect, reactive, defineModel } from "vue";

const file = defineModel("file");
const name = defineModel("name");
const tags = defineModel("tags");
const description = defineModel("description");
const editting = defineModel("editting");

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
    tags: [
      ...tags.value.subjects.map((e) => e.value),
      ...tags.value.grades.map((e) => e.value),
      ...tags.value.cognitives.map((e) => e.value),
      ...tags.value.content.map((e) => e.value),
      ...tags.value.tags.map((e) => e.value),
    ],
    status: 0,
  };

  if (editting.value != null) {
    let res = await fetch(
      `${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest/${editting.value}`,
      {
        method: "DELETE",
      },
    );
    editting.value = null;
  }

  await fetch(`${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  emit("close");
}

const tag_options = ref(old_tag_options);
watchEffect(() => {
  tag_options.value = old_tag_options;
});
const op = ref();
const new_tag = ref();
const new_tag_prefix = ref("");
function add_new_tag(val) {
  let x = {
    label: new_tag_prefix.value + new_tag.value,
    value: new_tag_prefix.value + new_tag.value,
  };
  if (!tag_options.value.includes(x)) {
    tag_options.value.push(x);
  }
  op.value.hide();
}

// ====

const editing = ref(false);
</script>

<template>
  <Fluid class="w-[20rem]">
    <div
      class="p-4 rounded-border border border-surface flex flex-col gap-4 bg-surface"
    >
      <h1 class="text-lg font-bold text-center">ტესტის ატვირთვა</h1>
      <FileUpload
        ref="fileupload"
        mode="basic"
        name="demo[]"
        customUpload
        :maxFileSize="1000000"
        @select="file = $event.files[0]"
        chooseLabel="ფაილის არჩევა"
      />

      <FloatLabel variant="on">
        <InputText id="test-name-input" v-model="name" />
        <label for="test-name-input">ტესტის სახელი</label>
      </FloatLabel>

      <div class="flex flex-col gap-4 p-4 border-surface rounded border">
        <UploadTagSelection
          v-model="tags.cognitives"
          placeholder="კოგნიტური სფერო"
          :options="
            tag_options
              .filter((e) => e.label.startsWith('cognitive-'))
              .map((e) => ({ ...e, label: e.label.slice(10) }))
          "
          @new-tag="
            new_tag_prefix = 'cognitive-';
            op.toggle($event);
          "
        />

        <UploadTagSelection
          v-model="tags.subjects"
          placeholder="საგანი"
          :options="
            tag_options
              .filter((e) => e.label.startsWith('subject-'))
              .map((e) => ({ ...e, label: e.label.slice(8) }))
          "
          @new-tag="
            new_tag_prefix = 'subject-';
            op.toggle($event);
          "
        />

        <UploadTagSelection
          v-model="tags.grade"
          placeholder="კლასი"
          :options="
            tag_options
              .filter((e) => e.label.startsWith('grade-'))
              .map((e) => ({ ...e, label: e.label.slice(6) }))
          "
          @new-tag="
            new_tag_prefix = 'grade-';
            op.toggle($event);
          "
        />

        <UploadTagSelection
          v-model="tags.content"
          placeholder="შინაარსობრივი სფერო"
          :options="
            tag_options
              .filter((e) => e.label.startsWith('content-'))
              .map((e) => ({ ...e, label: e.label.slice(8) }))
          "
          @new-tag="
            new_tag_prefix = 'content-';
            op.toggle($event);
          "
        />

        <UploadTagSelection
          v-model="tags.tags"
          placeholder="თაგი"
          :options="
            tag_options.filter(
              (e) =>
                !e.label.startsWith('cognitive-') &&
                !e.label.startsWith('content-') &&
                !e.label.startsWith('grade-') &&
                !e.label.startsWith('subject-'),
            )
          "
          @new-tag="
            new_tag_prefix = 'tag-';
            op.toggle($event);
          "
        />
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

      <Button label="ატვირთვა" @click="upload()" />
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
