<script setup>
defineProps({
    show: Boolean,
    results: Array,
});
const emit = defineEmits(["close"]);
</script>

<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask" @click="$emit('close')">
            <div class="modal-container" @click.stop>
                <div class="modal-body">
                    <div>
                        <h1 class="feedback-title">შედეგები</h1>
                        <table class="feedback-table">
                            <thead>
                                <tr>
                                    <th
                                        v-for="(val, i) in results"
                                        :key="i"
                                        :class="{ 'highlight-cell': val !== 0 }"
                                    >
                                        {{ i + 1 }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td
                                        v-for="val in results"
                                        :key="val"
                                        :class="{ 'highlight-cell': val !== 0 }"
                                    >
                                        {{ val }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h3 class="feedback-total">
                            ჯამური: {{ results.reduce((a, b) => a + b, 0) }} /
                            {{ results.length }}
                        </h3>
                    </div>
                    <div>
                        <input
                            type="button"
                            value="დახურვა"
                            @click="$emit('close')"
                            class="feedback-close-button"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    transition: opacity 0.3s ease;
}
.modal-container {
    /* width: 300px; */
    margin: auto;
    padding: 10pt 30pt;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}
.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}
.modal-body {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
}
.modal-body > {
    width: 100%;
}
.modal-default-button {
    float: right;
}
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.modal-enter-from {
    opacity: 0;
}
.modal-leave-to {
    opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.modal-body {
    background-color: #fff;
    /* padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); */
    /* width: 400px; */
}

.feedback-title {
    font-size: 24px;
    margin-bottom: 20px;
}

.feedback-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.feedback-table th,
.feedback-table td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ccc;
}

.highlight-cell {
    background-color: #cdeccd; /* Add your desired highlight color here */
}

.feedback-total {
    font-size: 18px;
    margin-bottom: 20px;
}

.feedback-close-button {
    background-color: #4caf50;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.feedback-close-button:hover {
    background-color: #45a049;
}
</style>
