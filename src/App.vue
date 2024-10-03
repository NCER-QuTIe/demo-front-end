<script setup>
import 'qti3-item-player-vue3/dist/qti3Player.css'

let qti3Player;
let item;

async function handlePlayerReady(_qti3Player) {
    qti3Player = _qti3Player;

    let response = await fetch(
        "/wind-qti3/i66cc20026976d353700bd50789a79d0a15c/qti.xml",
        {
            mode: "no-cors"
        }
    )
    console.log(response)
    let xml = await response.text();

    console.log(xml);

    qti3Player.loadItemFromXml(xml, {
        guid: "0000",
        status: "interacting",
        sessionControl: {
            max_attempts: 0, // no limit
            show_feedback: false,
            validate_responses: false
        },
    })
}

function handleItemReady(_item) {
    item = _item;
    console.log('QTI 3 Item XML is loaded and rendered!  The latest "attempt" has officially begun.')
}
</script>

<template>
    <Qti3Player ref="qti3player" container-class="qti3-player-container" @notifyQti3PlayerReady="handlePlayerReady"
        @notifyQti3ItemReady="handleItemReady" />
</template>

<style scoped>
</style>
