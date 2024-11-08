<script setup>
defineProps(["xml"]);
import "qti3-item-player-vue3/dist/qti3Player.css";

import { ref } from "vue";

let qti3Player = null;
let item;

function getReadyer() {
    current_item.value = 0;

    qti3Player.loadItemFromXml(xml, {
        guid: "" + current_item.value,
        status: "interacting",
        sessionControl: {
            max_attempts: 0, // no limit
            show_feedback: false,
            validate_responses: false,
        },
    });
}

async function handlePlayerReady(_qti3Player) {
    qti3Player = _qti3Player;
    getReadyer();
}

function handleItemReady(_item) {
    item = _item;
    console.log(
        'QTI 3 Item XML is loaded and rendered!  The latest "attempt" has officially begun.',
        item,
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
        qti3Player.suspendAttempt({ nextItemIndex: index });
    }
}

function grade() {
    qti3Player.endAttempt("done");
    graded[current_item.value] = true;
}

function handleEndAttemptCompleted(data) {
    qti3Player.scoreAttempt("itemScoreReady");
}

function handleScoreAttemptCompleted(data) {
    console.log(data.state);
    alert(
        "score = " +
            data.state.outcomeVariables[0].value +
            " / " +
            data.state.outcomeVariables[0].normalMaximum,
    );
}

function handleSuspendAttemptCompleted(data) {
    item_states[current_item.value] = data.state;
    console.log(data);
    if (data.target.nextItemIndex != undefined) {
        current_item.value = data.target.nextItemIndex;

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
    <div id="controls">
        <ProgressBar
            :length="items.length"
            :progress="current_item"
            @goto="(i) => switchToItem(i - 1)"
        />
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
            @notifyQti3ScoreAttemptCompleted="handleScoreAttemptCompleted"
            @notifyQti3EndAttemptCompleted="handleEndAttemptCompleted"
            @notifyQti3SuspendAttemptCompleted="handleSuspendAttemptCompleted"
        />
        <button @click="grade()">შეფასება</button>
    </div>
</template>

<style scoped>
#player-container {
    height: calc(100vh - 70pt);
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
