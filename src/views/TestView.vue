<script setup>
import Calculator from "../components/Calculator.vue";
import Ruler from "../components/Ruler.vue";

import { ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import Feedback from "../components/Feedback.vue";

import { compileGradeReport } from "../scripts/gradeReport.ts";

const route = useRoute();

let test_player = null;
let test_url = null;

async function getTestURL() {
  if (test_url === null) {
    try {
      const url = `/file/${route.params.id}/imsmanifest.xml`;
      await navigator.serviceWorker.ready;
      let manifest_res = await fetch(url);
      let mainfest_xml = await manifest_res.text();

      console.log(url, mainfest_xml);
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

  console.log(xml);
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
        const itemRef = section.getSectionItemsMap().get(itemIdentifier);

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

// const report = ref({});
const itemStatesForReport = ref([]);

function handleEndAttemptCompleted(data) {
  console.log("end attempt completed", data);

  if (data.target.grading) {
    let item_states = [];

    for (let item of items.value) {
      let guid = item.guid;
      let state = states[guid];
      console.log(state.responseVariables.slice(2));
      item_states.push({
        attempts: state.responseVariables[0].value,
        duration: state.responseVariables[1].value,
        responses: state.responseVariables.slice(2).map((v) => ({
          identifier: v.identifier,
          response: v.value,
        })),
      });
    }
    itemStatesForReport.value = item_states;
    // report.value = compileGradeReport(item_states);
    show_feedback.value = true;
  }
}

/// ITEM PLAYER

let item_player = ref(null);

function handlePlayerReady(qti3ItemPlayer) {
  item_player.value = qti3ItemPlayer;
}

const states = {};
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
  console.log("loading item xml");
  let test_path = await getTestURL();
  let path = `${test_path}/../${url}`;
  let res = await fetch(path);
  let xml = await res.text();
  xml = xml.replaceAll('src="', `src=\"${path}/../`);
  xml = xml.replaceAll(
    "qti-inline-choice-interaction",
    `qti-inline-choice-interaction dataPrompt="არჩევა..."`,
  );
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

function handleItemReady(_item) { }

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
const max_scores = reactive([]);

function handleScoreAttemptCompleted(data) {
  results[current_item.value] = {
    score: data.state.outcomeVariables[0].value,
    max_score: data.state.outcomeVariables[0].normalMaximum,
    problem: current_item.value + 1,
  };

  if (data.target.navigateItem !== undefined) {
    current_item.value = data.target.navigateItem;

    console.log("OIIIIII", current_item.value);
    const new_guid = items.value[current_item.value].guid;

    if (states[new_guid] !== undefined) {
      item_player.value.loadItemFromXml(item_xmls.value[current_item.value], {
        guid: new_guid,
        state: states[new_guid],
      });
    } else {
      item_player.value.loadItemFromXml(item_xmls.value[current_item.value], {
        guid: new_guid,
      });
    }
  }

  if (data.target.grading) {
    test_player.endAttempt({ grading: true });
  }
}

const show_feedback = ref(false);

function grade() {
  item_player.value.suspendAttempt({ grading: true });
}

// CALCULATOR

const calculatorRef = ref();
function toggleCalculator(event) {
  calculatorRef.value.toggle(event);
}

// RULER

const rulerRef = ref(false);
function toggleRuler(event) {
  rulerRef.value = !rulerRef.value;
}

import ProgressBar from "../components/ProgressBar/Bar.vue";
</script>

<template>
  <Qti3Test ref="qti3TestPlayer" @notifyQti3TestPlayerReady="handleTestPlayerReady"
    @notifyQti3TestReady="handleTestReady" @notifyQti3TestEndAttemptCompleted="handleEndAttemptCompleted" />
  <Ruler v-if="rulerRef" />

  <div class="box-border py-4 w-[1024px] h-[766px] m-auto flex flex-col gap-4 items-center relative text-sm">
    <div class="w-full flex gap-4 items-center">
      <Button label="დაბრუნება" outlined severity="secondary" icon="pi pi-home" @click="$router.back()" />
      <ProgressBar class="flex-grow" v-model="current_item" @click="(i) => navigateGotoItem(i)"
        :list="items.map((e, i) => i + 1)" />

      <Button icon="pi pi-calculator" iconPos="right" @click="toggleCalculator" severity="secondary" />

      <Button label="სახაზავი" @click="toggleRuler" severity="secondary" />

      <Button label="შემდეგი" icon="pi pi-arrow-right" iconPos="right" @click="navigateNextItem()"
        v-if="current_item != items.length - 1" class="w-36" />
      <Button label="დასრულება" severity="warn" @click="grade()" v-if="current_item == items.length - 1" class="w-36" />
    </div>

    <Popover ref="calculatorRef">
      <Calculator />
    </Popover>

    <div class="test-view-area qti-labels-none qti-item">
      <div class="w-full h-full overflow-x-hidden" v-if="items.length == 0">
        <Skeleton width="100%" height="100%"></Skeleton>
      </div>
      <Qti3Player ref="qti3player" colorClass="bg-transparent" @notifyQti3PlayerReady="handlePlayerReady"
        @notifyQti3ItemReady="handleItemReady" @notifyQti3ScoreAttemptCompleted="handleScoreAttemptCompleted"
        @notifyQti3SuspendAttemptCompleted="handleSuspendAttemptCompleted" />
    </div>
  </div>

  <Feedback :results="results" v-model:visible="show_feedback" :itemStates="itemStatesForReport"
    @close="show_feedback = false" />
</template>


<style scoped>
.test-view-area {
  display: border-box;
  height: 100%;
  width: 1024px;
  overflow-y: scroll;
  padding: 1rem;
  padding-bottom: 0.25rem;
  border: solid 1px var(--p-surface-200);
  border-radius: 1rem;
}

.test-view-area::-webkit-scrollbar-track {
  border-radius: 10px;
}

.test-view-area::-webkit-scrollbar {
  width: 12px;
}

.test-view-area::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: var(--p-surface-200);
}
</style>
