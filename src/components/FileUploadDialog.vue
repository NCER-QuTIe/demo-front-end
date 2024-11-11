<script setup>
defineProps({
    show: Boolean,
});
const emit = defineEmits(["close"]);

const subject_topics = {
    Mathematics: "trig algebra calculus".split(" "),
    Georgian: "grammar semantics".split(" "),
    Physics: "mechanics optics magnetism".split(" "),
    Chemistry: "potions".split(" "),
};
const subjects = Object.keys(subject_topics);

import { ref, useTemplateRef } from "vue";

let subj = ref("");
let file = useTemplateRef("file");
let testName = ref("");
let grade = ref("");
let topic = ref("");
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
            tags: [grade.value, subj.value, topic.value],
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
    <Transition name="modal">
        <div v-if="show" class="modal-mask" @click="$emit('close')">
            <div class="modal-container" @click.stop>
                <form class="modal-body" @submit.prevent>
                    <div>
                        <label for="file-upload" class="file-upload-label"
                            >Choose File</label
                        >
                        <input
                            type="file"
                            name="file"
                            id="file-upload"
                            ref="file"
                            @change="updateFileName"
                        />
                        <span class="file-name" v-if="fileName">{{
                            fileName
                        }}</span>
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="ტესტის სახელი"
                            v-model="testName"
                        />
                    </div>
                    <div class="input-container">
                        <select v-model="grade">
                            <option v-for="i in 12">{{ i }}</option>
                        </select>
                        <select v-model="subj">
                            <option v-for="subject in subjects">
                                {{ subject }}
                            </option>
                        </select>
                        <select v-model="topic">
                            <option v-for="topic in subject_topics[subj]">
                                {{ topic }}
                            </option>
                        </select>
                    </div>

                    <textarea v-model="description" />

                    <div>
                        <input
                            type="submit"
                            value="ატვირთვა"
                            @click="upload()"
                        />
                        <input
                            type="button"
                            value="გაუქმება"
                            @click="$emit('close')"
                        />
                    </div>
                </form>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    transition: opacity 0.3s ease;
}
.modal-container {
    /* width: 300px; */
    margin: auto;
    padding: 10pt;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}
.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}
.modal-body {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
}
.modal-body > {
    width: 100%;
}
.modal-default-button {
    float: right;
}
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.modal-enter-from {
    opacity: 0;
}
.modal-leave-to {
    opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-body {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    width: 400px;
}

.modal-body div {
    margin-bottom: 10px;
}

input[type="file"] {
    display: none;
}

.file-upload-label {
    display: inline-block;
    padding: 8px 12px;
    background-color: #4caf50;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px; /* Add margin-right to create a gap */
}

.file-name {
    /* Existing styles */
    margin-left: 10px; /* Add margin-left to create a gap */
}
.file-upload-label:hover {
    background-color: #4caf50;
}

.file-upload-button {
    display: inline-block;
    padding: 8px 12px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.file-upload-button:hover {
    background-color: #4caf50;
}

input[type="text"],
select,
textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

textarea {
    height: 100px;
}

.input-container {
    display: flex;
    gap: 10px;
}

input[type="submit"],
input[type="button"] {
    background-color: #4caf50;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
}

input[type="submit"]:hover,
input[type="button"]:hover {
    background-color: #4caf50;
}
</style>
