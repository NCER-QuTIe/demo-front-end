<script setup>
import "qti3-item-player-vue3/dist/qti3Player.css";

import ProgressBar from "../components/ProgressBar.vue";
import ControlButtons from "../components/ControlButtons.vue";

import { ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import Feedback from "../components/Feedback.vue";

const route = useRoute();

let test_player = null;
let test_url = null;

async function getTestURL() {
    if (test_url === null) {
        try {
            let manifest_res = await fetch(
                `/file/${route.params.id}/imsmanifest.xml`,
            );
            let mainfest_xml = await manifest_res.text();

            test_url = mainfest_xml.match(/href="(.*?test.*?)"/)[1];
        } catch (error) {
            // Handle the error here
            console.error("Error occurred:", error);
            // You can also throw a custom error or return a default value
            throw new Error("Failed to get test URL");
            // return '/default/test/url';
        }
    }
    return `/file/${route.params.id}/${test_url}`;
}

async function loadTestXML() {
    let test_url = await getTestURL();

    let res = await fetch(test_url);
    let xml = await res.text();
    xml = xml.split("\n").slice(1).join("\n");

    const configuration = {
        guid: route.params.id,
        pnp: {
            textAppearance: {
                colorStyle: "qti3-player-color-default",
            },
            // Glossary is a universal support turned on (true) by default
            glossaryOnScreen: true,
            // Keyword translation is off ('') by default
            keywordTranslationLanguage: "",
            // Custom SBAC Illustrated Glossary is off (false) by default
            extSbacGlossaryIllustration: false,
            layoutSingleColumn: false, // unsupported
        },
    };

    test_player.loadTestFromXml(xml, configuration);
}

function handleTestPlayerReady(_qti3TestPlayer) {
    test_player = _qti3TestPlayer;

    loadTestXML();
}

function getItems(test) {
    let items = [];
    // Get the Test's Parts
    const parts = test.getTestParts();
    parts.forEach((part) => {
        // Get the Part's Sections
        part.getSections().forEach((section) => {
            // Print all of a Section's RESOLVED Item Ref's - in the proper order
            section.getSectionItemIdentifiers().forEach((itemIdentifier) => {
                // Pull the full qti-assessment-item-ref component from the sectionItemsMap
                const itemRef = section
                    .getSectionItemsMap()
                    .get(itemIdentifier);

                items.push({
                    guid:
                        part.getIdentifier() +
                        "~" +
                        section.getIdentifier() +
                        "~" +
                        itemRef.getIdentifier(),
                    partIdentifier: part.getIdentifier(),
                    sectionIdentifier: section.getIdentifier(),
                    identifier: itemRef.getIdentifier(),
                    fixed: itemRef.getFixed(),
                    required: itemRef.getRequired(),
                    href: itemRef.getHref(),
                    // Item Ref 'category' attribute or null
                    category: itemRef.getCategory(),
                    // Item Ref qti-item-session-control element or null
                    sessionControl: itemRef.getItemSessionControl(),
                    // Item Ref qti-time-limits element or null
                    timeLimits: itemRef.getTimeLimits(),
                });
            }); // end sectionItemIdentifiers.forEach
        }); // end section.forEach
    });

    return items;
}

let items = ref([]);
let current_item = ref(0);

function handleTestReady(_test) {
    let test = test_player.getTest();

    let new_items = getItems(test);
    items.value = new_items;
}

function handleEndAttemptCompleted(data) {
    console.log("end attempt completed", data);
}

/// ITEM PLAYER

let item_player = ref(null);

function handlePlayerReady(qti3ItemPlayer) {
    item_player.value = qti3ItemPlayer;
}

const states = reactive({});
function handleSuspendAttemptCompleted(data) {
    console.log("suspend completed", data);

    const old_guid = items.value[current_item.value].guid;
    const { partIdentifier, sectionIdentifier, identifier } =
        items.value[current_item.value];

    states[old_guid] = data.state;
    test_player.setTestStateItemState(
        partIdentifier,
        sectionIdentifier,
        identifier,
        data.state,
    );
    item_player.value.scoreAttempt(data.target);
}
async function loadItemXML(url) {
    let test_path = await getTestURL();
    let path = `${test_path}/../${url}`;
    let res = await fetch(path);
    let xml = await res.text();
    xml = xml.replaceAll('src="', `src=\"${path}/../`);
    xml = xml.split("\n").slice(1).join("\n");

    return xml;
}

let item_xmls = ref([]);
watch([item_player, items], async (e) => {
    if (
        item_player.value !== null &&
        items.value.length != 0 &&
        item_xmls.value.length == 0
    ) {
        for (let item of items.value) {
            let item_xml = await loadItemXML(item.href);
            item_xmls.value.push(item_xml);
        }
        item_player.value.loadItemFromXml(item_xmls.value[0], {
            guid: items.value[0].guid,
        });
    }
});

function handleItemReady(_item) {}

function navigateNextItem() {
    if (current_item.value >= items.value.length) {
        // TODO: handle this
        return;
    }

    navigateGotoItem(current_item.value + 1);
}

function navigateGotoItem(index) {
    if (index >= items.value.length || index < 0) {
        // TODO: handle this
        return;
    }
    item_player.value.suspendAttempt({ navigateItem: index });
}

/// Grading

const results = reactive([]);

function handleScoreAttemptCompleted(data) {
    results[current_item.value] = data.state.outcomeVariables[0].value;

    if (data.target.navigateItem !== undefined) {
        current_item.value = data.target.navigateItem;

        console.log("OIIIIII", current_item.value);
        const new_guid = items.value[current_item.value].guid;

        if (states[new_guid] !== undefined) {
            item_player.value.loadItemFromXml(
                item_xmls.value[current_item.value],
                {
                    guid: new_guid,
                    state: states[new_guid],
                },
            );
        } else {
            item_player.value.loadItemFromXml(
                item_xmls.value[current_item.value],
                {
                    guid: new_guid,
                },
            );
        }
    }
}

const show_feedback = ref(false);

function grade() {
    // item_player.value.suspendAttempt({ itemScoreReady: true });
    test_player.endAttempt();
    ე;
    show_feedback.value = true;
}
</script>

<template>
    <Qti3Test
        ref="qti3TestPlayer"
        @notifyQti3TestPlayerReady="handleTestPlayerReady"
        @notifyQti3TestReady="handleTestReady"
        @notifyQti3TestEndAttemptCompleted="handleEndAttemptCompleted"
    />
    <div id="controls">
        <ProgressBar
            :length="items.length"
            :progress="current_item"
            @goto="(i) => navigateGotoItem(i - 1)"
        />
        <ControlButtons
            :enablePrevious="current_item > 0"
            :enableNext="current_item < items.length - 1"
            @next="navigateNextItem()"
            @previous="navigateGotoItem(current_item - 1)"
            @finish="grade"
        />
    </div>

    <div id="player-container">
        <Qti3Player
            ref="qti3player"
            container-class="qti3-player-container"
            @notifyQti3PlayerReady="handlePlayerReady"
            @notifyQti3ItemReady="handleItemReady"
            @notifyQti3ScoreAttemptCompleted="handleScoreAttemptCompleted"
            @notifyQti3SuspendAttemptCompleted="handleSuspendAttemptCompleted"
        />
    </div>

    <Feedback
        :results="results"
        :show="show_feedback"
        @close="show_feedback = false"
    />
</template>

<style scoped>
#player-container {
    height: calc(100vh - 70pt);
    box-sizing: border-box;

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
