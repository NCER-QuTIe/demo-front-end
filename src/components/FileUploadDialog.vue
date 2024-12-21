<script setup>
const props = defineProps(["old_tag_options", "show"]);
const emit = defineEmits(["close"]);

import { ref, watchEffect } from "vue";

let file = ref();
let name = ref("");
let tags = ref([]);
let description = ref("");

import { blob2base64 } from "@/scripts/blob2base64";

async function upload() {
  const myFile = file.value;
  const b64 = await blob2base64(myFile, myFile.type);

  const obj = {
    name: name.value,
    description: description.value,
    packageBase64: b64,
    tags: tags.value.map((e) => e.value),
    status: 0,
  };

  await fetch(`${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  emit("close");
}

const tag_options = ref(props.old_tag_options);
watchEffect(() => {
  tag_options.value = props.old_tag_options;
});
const op = ref();
const new_tag = ref();
function add_new_tag(val) {
  let x = { label: new_tag.value, value: new_tag.value };
  if (!tag_options.value.includes(x)) {
    tag_options.value.push(x);
  }
  op.value.hide();
}
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

      <MultiSelect
        v-model="tags"
        display="chip"
        placeholder="თაგები"
        :options="tag_options"
        optionLabel="label"
        filter
        :maxSelectedLabels="10"
        class="w-full"
      >
        <template #footer>
          <div class="p-3 flex justify-between">
            <Button
              label="Add New"
              severity="secondary"
              text
              size="small"
              icon="pi pi-plus"
              @click="op.toggle"
            />
          </div>
        </template>
      </MultiSelect>

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
