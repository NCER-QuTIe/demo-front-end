<script setup>
import "qti3-item-player-vue3/dist/qti3Player.css";

let qti3Player = null;
let item;

let items = [
    "/wind-qti3/i66cc20026976d353700bd50789a79d0a15c/qti.xml",
    "/4-qti3/i66cc20a40c29a353700f3415bcaeb697a3a/qti.xml",
    "/ლონდონის_თვალი_-_2_1725965625-qti3/i66cc1fe0d77b63537008681fb048efbbf44/qti.xml",
];

async function loadData() {
    for (let i = 0; i < items.length; i++) {
        let response = await fetch(items[i], { mode: "no-cors" });
        let xml = await response.text();
        items[i] = xml;
    }
    getReadyer();
}

loadData();

let ready = 2;
function getReadyer() {
    ready -= 1;
    if (ready == 0) {
        switchToItem(0);
    }
}

async function handlePlayerReady(_qti3Player) {
    qti3Player = _qti3Player;
    getReadyer();
}

function handleItemReady(_item) {
    item = _item;
    console.log(
        'QTI 3 Item XML is loaded and rendered!  The latest "attempt" has officially begun.',
    );
}

import { ref } from "vue";

let current_item = ref(-1);

function switchToItem(index) {
    if (index >= items.length) {
        index = 0;
    }
    if (index < 0) {
        index = items.length - 1;
    }
    if (index != current_item.value) {
        current_item.value = index;

        qti3Player.loadItemFromXml(items[current_item.value], {
            guid: "" + current_item.value,
            status: "interacting",
            sessionControl: {
                max_attempts: 0, // no limit
                show_feedback: false,
                validate_responses: false,
            },
        });
    }
}
</script>

<template>
    <div id="player-container">
        <Qti3Player
            ref="qti3player"
            container-class="qti3-player-container"
            @notifyQti3PlayerReady="handlePlayerReady"
            @notifyQti3ItemReady="handleItemReady"
        />
    </div>

    <div id="buttons">
        <button @click="switchToItem(current_item - 1)">{{ "<" }}</button>
        {{ current_item + 1 }}
        <button @click="switchToItem(current_item + 1)">{{ ">" }}</button>
    </div>
</template>

<style scoped>
#player-container {
    max-height: calc(100vh - 3em);
    margin-bottom: 0.5em;
    overflow: scroll;
    border: 1px solid black;
    border-radius: 4px;
}

#buttons {
    display: flex;
    width: 100%;
    gap: 1em;
    align-items: baseline;
    justify-content: center;
}
</style>
