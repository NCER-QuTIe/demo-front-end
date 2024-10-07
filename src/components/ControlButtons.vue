<script setup>
defineProps(["enablePrevious", "enableNext"]);
</script>

<template>
    <div id="control-buttons">
        <button @click="$emit('previous')" :disabled="!enablePrevious">
            <img src="/left.svg" />
        </button>
        <button @click="$emit('next')" :disabled="!enableNext">
            <img src="/right.svg" />
        </button>
    </div>
</template>

<style scoped>
#control-buttons {
    display: flex;
    gap: 10pt;
}

#control-buttons > button {
    border: none;
    background-color: #aec584;
    width: 30pt;
    height: 30pt;
}

#control-buttons > button:disabled {
    opacity: 0.5;
}

#control-buttons > button:not([disabled]):hover {
    background-color: #7f9a4f;
}

#control-buttons > button > img {
    width: 100%;
    height: 100%;
}
</style>
