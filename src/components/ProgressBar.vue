<script setup>
defineProps(["length", "progress"]);
</script>

<template>
    <div id="progress-bar">
        <div
            v-for="i in length"
            :style="{
                backgroundColor:
                    i - 1 < progress
                        ? '#6e893f'
                        : i - 1 == progress
                          ? 'white'
                          : 'transparent',
            }"
            key="i"
        >
            {{ i }}
        </div>
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
#progress-bar > div {
    width: 30pt;
    height: 30pt;
    border: 2pt solid #7f9a4f;
    color: #7f9a4f;
    box-sizing: border-box;
    text-align: center;
    font-size: 20pt;
    padding: 2pt;
    font-family: monospace;
}
</style>
