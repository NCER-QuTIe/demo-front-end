<script setup>
import ListItem from "../components/ListItem.vue";
import FileUploadDialog from "@/components/FileUploadDialog.vue";
import { reactive, watchEffect, ref } from "vue";

let data = reactive([]);

fetch("/api/admin/qtiTests")
    .then((data) => data.json())
    .then((json) => {
        data.push(...json);
    });

async function deleteTest(ind) {
    let res = await fetch(
        `https://eko.dimitri.ge/api/admin/qtitest/${data[ind].id}`,
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
    let res = await fetch("https://eko.dimitri.ge/api/admin/qtitest/status", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: data[ind].id,
            status: 1 - data[ind].status,
        }),
    });

    if (res.ok) {
        data[ind].status = 1 - data[ind].status;
    } else {
        console.log(res);
    }
}

let show_upload = ref(false);

async function closeUpload() {
    let res = await fetch("https://eko.dimitri.ge/api/admin/qtiTests");
    let json = await res.json();

    data.splice(0);
    data.push(...json);
    show_upload.value = !show_upload.value;
}
</script>

<template>
    <FileUploadDialog :show="show_upload" @close="closeUpload()" />
    <ul>
        <li id="list-titles">
            <span> Name </span>

            <span class="tags"> Tags </span>

            <span class="description">Description</span>

            <span>
                <template v-if="true"> Actions </template>
            </span>
        </li>
        <ListItem
            v-for="i in data.length"
            :id="data[i - 1].id"
            :name="data[i - 1].name"
            :description="data[i - 1].description"
            :tags="data[i - 1].tags"
            :enable-edit="true"
            :visible="!data[i - 1].status"
            @toggleVisibility="toggleStatus(i - 1)"
            @delete="deleteTest(i - 1)"
        />
    </ul>
    <button id="new-test" @click="show_upload = true">
        <img src="/add.svg" />
    </button>
</template>

<style scoped>
ul {
    list-style: none;
    padding: 0pt;
    margin: 0pt;
    width: min-content;
    /* margin-left: auto;
    margin-right: auto; */
    /* margin-top: 100pt;
    margin-bottom: 100pt; */
    background-color: white;
    padding: 16pt;
    /* color: white; */
    display: flex;
    flex-direction: column;
    gap: 4pt;
}

#list-titles {
    display: grid;
    padding: 4pt;
    font-weight: 1000;
    font-size: 14pt;
    grid-template-columns: 150pt 250pt 200pt 60pt;
    column-gap: 10pt;
    text-align: center;
    font-family: monospace;
}

#new-test {
    position: absolute;
    right: 30pt;
    bottom: 30pt;
}
</style>
