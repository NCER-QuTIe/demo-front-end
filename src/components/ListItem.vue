<script setup>
defineProps(["name", "id", "tags", "description", "enableEdit", "visible"]);
defineEmits(["toggleVisibility", "delete"]);
</script>

<template>
    <li>
        <span class="name">
            <RouterLink :to="'/test/' + id">
                {{ name }}
            </RouterLink>
        </span>

        <span class="tags">
            <ul class="tags-list">
                <li v-for="tag in tags" class="tag">
                    {{ tag }}
                </li>
            </ul>
        </span>

        <textarea rows="1" disabled>{{ description }}</textarea>

        <span class="actions">
            <button @click="$emit('toggleVisibility')" v-if="enableEdit">
                <img src="/visible.svg" v-if="visible" />
                <img src="/not-visible.svg" v-else />
            </button>
            <button @click="$emit('delete')" v-if="enableEdit">
                <img src="/delete.svg" />
            </button>
        </span>
    </li>
</template>

<style scoped>
li {
    display: inline-grid;
    align-items: baseline;
    grid-template-columns: 150pt 250pt 200pt 60pt;
    column-gap: 10pt;
    padding: 4pt;
    font-size: 12pt;
    /* background-color: #5289c5; */
    /* color: white; */
}

.name {
    padding: 0 4pt;
    font-family: monospace;
}

.tag {
    padding: 2pt 6pt;
    background-color: #aec584;
    color: #6e893f;
    font-weight: 1000;
    border-radius: 20pt;
    cursor: pointer;
    user-select: none;
}

.tag:hover {
    background-color: #7f9a4f;
}

.tags {
    width: 100%;
    overflow: scroll;
}

.tags-list {
    width: max-content;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 4pt;
    display: inline-flex;
}

.tags-list > li {
    display: inline;
}

textarea {
    resize: vertical;
}

.actions {
    display: flex;
    gap: 4pt;
}

button {
    background-color: #aec584;
    border: none;
    width: 30pt;
    height: 30pt;
}

button:not([disabled]):hover {
    background-color: #7f9a4f;
}
</style>
