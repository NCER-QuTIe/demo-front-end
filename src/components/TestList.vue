<script setup>
defineProps({
    data: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(["deleteTest", "toggleStatus"]);

import { ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();
const isVisible = ref(false);
const openPopup = (event, ind) => {
    confirm.require({
        target: event.currentTarget,
        message: "დარწმუნებული ხარ?",
        onShow: () => {
            isVisible.value = true;
        },
        onHide: () => {
            isVisible.value = false;
        },
        accept: () => {
            emit("deleteTest", ind);
        },
    });
};

const first = ref(0);
const rows = ref(10);
</script>

<template>
    <div
        class="flex flex-col gap-4 border p-4 border-surface justify-between rounded-border"
    >
        <Accordion class="mx-auto max-w-[60em] w-full h-min">
            <AccordionPanel
                v-for="(d, ind) in data.slice(first, first + rows)"
                :key="d.name + ind"
                :value="d"
                class="border-none"
            >
                <AccordionHeader>
                    <div class="flex justify-between flex-grow gap-2 pr-2">
                        {{ d.name }}

                        <span class="tags flex gap-2">
                            <Tag
                                v-for="(tag, i) in d.tags"
                                class="tag"
                                rounded
                                :value="tag"
                                severity="secondary"
                            />
                        </span>
                    </div>
                </AccordionHeader>

                <AccordionContent pt:content:class="flex flex-col gap-4">
                    <Panel header="აღწერა">
                        {{ d.description }}
                    </Panel>

                    <span class="actions flex gap-4 justify-between">
                        <ConfirmPopup>
                            <template
                                #container="{
                                    message,
                                    acceptCallback,
                                    rejectCallback,
                                }"
                            >
                                <div class="rounded p-4">
                                    <span>{{ message.message }}</span>
                                    <div class="flex items-center gap-2 mt-4">
                                        <Button
                                            label="დადასტურება"
                                            @click="acceptCallback"
                                            severity="danger"
                                            size="small"
                                        ></Button>
                                        <Button
                                            label="გაუქმება"
                                            outlined
                                            @click="rejectCallback"
                                            severity="secondary"
                                            size="small"
                                            text
                                        ></Button>
                                    </div>
                                </div> </template
                        ></ConfirmPopup>

                        <Button
                            @click="openPopup($event, ind)"
                            icon="pi pi-trash"
                            label="წაშლა"
                            severity="danger"
                            aria-label="Visible"
                        />

                        <span class="flex gap-4 align-baseline">
                            <Button
                                @click="$emit('toggleStatus', ind)"
                                :icon="
                                    'pi ' +
                                    (!d.status ? 'pi-eye' : 'pi-eye-slash')
                                "
                                aria-label="Visible"
                                :label="!d.status ? 'დამალვა' : 'გამოჩენა'"
                            />
                            <Button
                                @click="$router.push('/test/' + d.id)"
                                aria-label="Begin"
                                icon="pi pi-play"
                                label="დაწყება"
                            />
                        </span>
                    </span>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
        <Paginator
            v-model:first="first"
            v-model:rows="rows"
            :totalRecords="data.length"
            :rowsPerPageOptions="[10, 20, 30]"
        ></Paginator>
    </div>
</template>
