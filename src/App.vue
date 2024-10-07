<script setup>
import "qti3-item-player-vue3/dist/qti3Player.css";

import ProgressBar from "./components/ProgressBar.vue";
import ControlButtons from "./components/ControlButtons.vue";

import { ref, watchEffect } from "vue";

let qti3Player = null;
let item;

let items = [
    "/wind-qti3/i66cc20026976d353700bd50789a79d0a15c/qti.xml",
    "/4-qti3/i66cc20a40c29a353700f3415bcaeb697a3a/qti.xml",
    "/ლონდონის_თვალი_-_2_1725965625-qti3/i66cc1fe0d77b63537008681fb048efbbf44/qti.xml",
];

watchEffect(async () => {
    for (let i = 0; i < items.length; i++) {
        let response = await fetch(items[i], { mode: "no-cors" });
        let xml = await response.text();
        items[i] = xml;
    }
    getReadyer();
});

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

let current_item = ref(-1);

function switchToItem(index) {
    if (index >= items.length) {
        alert("ტესტი დასრულდა");
        return;
    }
    if (index < 0) {
        return;
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
    <main>
        <div id="controls">
            <ProgressBar :length="items.length" :progress="current_item" />
            <ControlButtons
                :enablePrevious="current_item > 0"
                :enableNext="current_item < items.length - 1"
                @next="switchToItem(current_item + 1)"
                @previous="switchToItem(current_item - 1)"
            />
        </div>

        <div id="player-container">
            <Qti3Player
                ref="qti3player"
                container-class="qti3-player-container"
                @notifyQti3PlayerReady="handlePlayerReady"
                @notifyQti3ItemReady="handleItemReady"
            />
        </div>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 50%;
    background-color: #6bb1eb;
}

#player-container {
    height: calc(100vh - 50pt);
    box-sizing: border-box;

    /* margin-bottom: 0.5em; */
    overflow: scroll;
    margin: 10pt;
    padding: 10pt;
    background-color: white;
}

#controls {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10pt;
    background-color: #5289c5;
}
</style>
