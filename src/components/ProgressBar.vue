<script setup>
let props = defineProps(["length", "progress"]);
defineEmits(["goto"]);
import { ref, watchEffect } from "vue";

let visited = ref(0);

watchEffect((p) => {
    console.log("\n", props.progress, "\n");
    visited.value = Math.max(visited.value, props.progress + 1);
});
</script>

<template>
    <div id="progress-bar">
        <button
            v-for="i in length"
            :class="{
                active: i - 1 == progress,
            }"
            :disabled="i - 1 >= visited"
            @click="$emit('goto', i)"
            key="i"
        >
            {{ i }}
        </button>
    </div>
</template>

<style scoped>
#progress-bar {
    display: flex;
    gap: 1px;
    padding: 1px;
    background-color: #aec584;
    box-sizing: border-box;
}

#progress-bar > button {
    width: 30pt;
    height: 30pt;
    border: 2pt solid #7f9a4f;
    color: #7f9a4f;
    box-sizing: border-box;
    text-align: center;
    font-size: 20pt;
    padding: 2pt;
    font-family: monospace;
    background-color: transparent;
}

#progress-bar > button:not([disabled]) {
    background-color: #6e893f;
}

#progress-bar > button.active {
    background-color: white;
}

#progress-bar > button:not([disabled]):hover {
    border-color: white;
}
</style>
