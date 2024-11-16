<script setup>
defineProps({
    show: Boolean,
});
const emit = defineEmits(["close"]);

const subject_topics = {
    მათემატიკა: "ტრიგონომეტრია ალგებრა კალკულუსი".split(" "),
    ქართული: "გრამატიკა ლიტერატურა".split(" "),
    ფიზიკა: "მექანიკა ოპტიკა".split(" "),
    ქიმია: "საწამლავები".split(" "),
};
const tag_options = [
    ...Object.keys(subject_topics),
    ...Object.values(subject_topics).flat(),
].map((e) => {
    return {
        label: e,
        value: e,
    };
});
console.log({ tag_options });
const subjects = Object.keys(subject_topics);

import { ref, useTemplateRef } from "vue";

let file = useTemplateRef("file");
let testName = ref("");
let tags = ref([]);
let description = ref("");

const blob2base64 = (blob, mimeType) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrlPrefix = `data:${mimeType};base64,`;
            const base64WithDataUrlPrefix = reader.result;
            const base64 = base64WithDataUrlPrefix.replace(dataUrlPrefix, "");
            resolve(base64);
        };
        reader.onerror = reject;
        console.log(blob);
        reader.readAsDataURL(blob);
    });
};

async function upload() {
    console.log(tags.value);
    const myFile = file.value.files[0];
    const b64 = await blob2base64(myFile, myFile.type);
    await fetch(`${import.meta.env.VITE_API_ROUTE}/api/admin/qtitest`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: testName.value,
            description: description.value,
            packageBase64: b64,
            tags: tags.value.map((e) => e.value),
            status: 0,
        }),
    });
    emit("close");
}

const fileName = ref("");
function updateFileName(event) {
    const fileInput = event.target;
    fileName.value = fileInput.files[0].name;
}
</script>

<template>
    <Fluid class="w-[20rem]">
        <div
            class="p-4 rounded-border border border-surface flex flex-col gap-4 bg-surface"
        >
            <div class="flex gap-4 items-baseline">
                <label
                    for="file-upload"
                    class="file-upload-label bg-primary p-2 rounded-border cursor-pointer text-primary-contrast"
                    >Choose File</label
                >
                <input
                    type="file"
                    name="file"
                    id="file-upload"
                    ref="file"
                    @change="updateFileName"
                />
                <span
                    class="rounded-border p-2 border border-surface bg-surface-950 flex-grow"
                    v-if="fileName"
                    >{{ fileName }}</span
                >
            </div>
            <FloatLabel variant="on">
                <InputText id="test-name-input" v-model="testName" />
                <label for="test-name-input">ტესტის სახელი</label>
            </FloatLabel>

            <FloatLabel variant="on">
                <MultiSelect
                    v-model="tags"
                    id="test-tags"
                    display="chip"
                    :options="tag_options"
                    optionLabel="label"
                    filter
                    :maxSelectedLabels="10"
                    class="w-full"
                />
                <label for="test-tags">თაგები</label>
            </FloatLabel>

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
</template>

<style scoped>
input[type="file"] {
    display: none;
}
</style>
