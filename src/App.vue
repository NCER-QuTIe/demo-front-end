<script setup>
import 'qti3-item-player-vue3/dist/qti3Player.css'

let qti3Player = null;
let item;

let items = [
    "/wind-qti3/i66cc20026976d353700bd50789a79d0a15c/qti.xml",
    "/4-qti3/i66cc20a40c29a353700f3415bcaeb697a3a/qti.xml",
];

async function loadData() {
    for (let i = 0; i < items.length; i++) {
        let response = await fetch(items[i], { mode: "no-cors" });
        let xml = await response.text();
        items[i] = xml;
    }
    data_is_fetched = true;
}

loadData();

async function handlePlayerReady(_qti3Player) {
    qti3Player = _qti3Player;
}

function handleItemReady(_item) {
    item = _item;
    console.log('QTI 3 Item XML is loaded and rendered!  The latest "attempt" has officially begun.')
}

let current_item = 0;

function switchToItem(index) {

    if (index != current_item) {
        current_item = index;

        qti3Player.loadItemFromXml(items[current_item], {
            guid: "" + current_item,
            status: "interacting",
            sessionControl: {
                max_attempts: 0, // no limit
                show_feedback: false,
                validate_responses: false
            },
        });
    }
}
</script>

<template>
    <Qti3Player ref="qti3player" container-class="qti3-player-container" @notifyQti3PlayerReady="handlePlayerReady"
        @notifyQti3ItemReady="handleItemReady" />

    <button @click="switchToItem(0)">1</button>
    <button @click="switchToItem(1)">2</button>
</template>

<style scoped>
</style>
