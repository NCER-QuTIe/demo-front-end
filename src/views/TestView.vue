<script setup>
import "qti3-item-player-vue3/dist/qti3Player.css";

import ItemView from "./ItemView.vue";
import ProgressBar from "../components/ProgressBar.vue";
import ControlButtons from "../components/ControlButtons.vue";

import { ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

let test_player = null;

async function getTestURL() {
    let manifest_res = await fetch(`/file/${route.params.id}/imsmanifest.xml`);
    let mainfest_xml = await manifest_res.text();

    let test_url = mainfest_xml.match(/href="(.*?test.*?)"/)[1];
    return `/file/${route.params.id}/${test_url}`;
}

async function loadTestXML() {
    let test_url = await getTestURL();

    let res = await fetch(test_url);
    let xml = await res.text();

    console.log(xml);

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
    let res = {};
    let items = [];
    // Get the Test's Parts
    const parts = test.getTestParts();
    parts.forEach((part) => {
        let part_data = {
            title:
                part.getTitle().length == 0
                    ? "<No Test Part Title>"
                    : part.getTitle(),
            // Part navigation mode
            navigationMode: part.getNavigationMode(),
            // Part submission mode
            submissionMode: part.getSubmissionMode(),
            // Part qti-item-session-control element or null
            sessionControl: part.getItemSessionControl(),
            // Part qti-time-limits element or null
            timeLimits: part.getTimeLimits(),
            // Array of Part qti-rubric-blocks
            rubricBlocks: part.getRubricBlocks(),
            sections: [],
        };

        // Get the Part's Sections
        const sections = part.getSections();
        sections.forEach((section) => {
            let section_data = {
                title:
                    section.getTitle().length == 0
                        ? "<No Section Title>"
                        : section.getTitle(),
                fixed: section.getFixed(),
                visible: section.getVisible(),
                required: section.getRequired(),
                keepTogether: section.getKeepTogether(),
                // Array of RESOLVED (i.e., ordered and selected) item identifiers
                sectionItemIdentifiers: section.getSectionItemIdentifiers(),
                // Map (item identifier is map key) of qti-assessment-item-ref's
                sectionItemsMap: section.getSectionItemsMap(),
                // Section qti-item-session-control element or null
                sessionControl: section.getItemSessionControl(),
                // Section qti-selection element or null
                selection: section.getSelection(),
                // Section qti-ordering element or null
                ordering: section.getOrdering(),
                // Section qti-time-limits element or null
                timeLimits: section.getTimeLimits(),
                // Array of section qti-rubric-blocks
                rubricBlocks: section.getRubricBlocks(),
                items: [],
            };
            // Print qti-assessment-section properties

            // Print all of a Section's RESOLVED Item Ref's - in the proper order
            const sectionItemIdentifiers = section.getSectionItemIdentifiers();
            sectionItemIdentifiers.forEach((itemIdentifier) => {
                // Pull the full qti-assessment-item-ref component from the sectionItemsMap
                const itemRef = section
                    .getSectionItemsMap()
                    .get(itemIdentifier);
                section_data.items.push({
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

                items.push({
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
            part_data.sections.push(section_data);
        }); // end section.forEach
        res[part.getIdentifier()] = part_data;
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

/// ITEM PLAYER

let item_player = ref(null);

function handlePlayerReady(qti3ItemPlayer) {
    item_player.value = qti3ItemPlayer;
}

const states = reactive({});
function handleSuspendAttemptCompleted(data) {
    console.log("suspend completed", data);

    const old_guid =
        items.value[current_item.value].partIdentifier +
        items.value[current_item.value].sectionIdentifier +
        items.value[current_item.value].identifier;

    states[old_guid] = data.state;
    test_player.setTestStateItemState(old_guid, data.state);
    if (data.target.navigateItem !== undefined) {
        current_item.value = data.target.navigateItem;

        console.log("OIIIIII", current_item.value);
        const new_guid =
            items.value[current_item.value].partIdentifier +
            items.value[current_item.value].sectionIdentifier +
            items.value[current_item.value].identifier;

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
async function loadItemXML(url) {
    let test_path = await getTestURL();
    let path = `${test_path}/../${url}`;
    let res = await fetch(path);
    let xml = await res.text();
    xml = xml.replaceAll('src="', `src=\"${path}/../`);

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
            guid:
                items.value[0].partIdentifier +
                items.value[0].sectionIdentifier +
                items.value[0].identifier,
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

function grade() {
    item_player.value.scoreAttempt({ justGrading: true });
}

function handleScoreAttemptCompleted(data) {
    // // 'data' contains the item state in a 'state' property, including response variable values,
    // // outcome variable values, template variable values, and context variable values.
    // // 'data' also has a 'target' property that echos the value (if any) of the target string
    // // parameter passed into the originaging scoreAttempt call.
    // // ... do something ...
    // console.log("SCORE ATTEMPT OUTCOMES", data.state);
    // const itemState = data.state;
    // const target = data.target;
    // // Echo all Outcome variables in the Item State
    // itemState.outcomeVariables.forEach((outcomeVariable) => {
    //     console.log(
    //         `[Outcome][${outcomeVariable.identifier}][Value=${outcomeVariable.value}]`,
    //     );
    // });

    console.log("\n\n\n\n", data.state);
    alert(
        `your grade is: ${data.state.outcomeVariables[0].value} / ${data.state.outcomeVariables[1].value} `,
    );
}
</script>

<template>
    <Qti3Test
        ref="qti3TestPlayer"
        @notifyQti3TestPlayerReady="handleTestPlayerReady"
        @notifyQti3TestReady="handleTestReady"
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
        <button @click="grade()">შეფასება</button>
    </div>
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
