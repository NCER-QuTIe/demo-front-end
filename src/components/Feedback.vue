<script setup>
const props = defineProps({
    results: Array,
    report: String,
});
const emit = defineEmits(["close"]);

const visible = defineModel({ required: true });

function download() {
    const link = document.createElement("a");
    const file = new Blob([props.report], { type: "text/plain" });
    link.href = URL.createObjectURL(file);
    link.download = "ნაშრომი.csv";
    link.click();
    URL.revokeObjectURL(link.href);
}
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        maximizable
        header="შედეგები"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
        <div class="min-w-[50rem] flex flex-col gap-4">
            <DataTable :value="results" size="small" showGridlines stripedRows>
                <Column field="problem" sortable header="ამოცანა"></Column>
                <Column field="score" sortable header="მიღებული ქულა"></Column>
                <Column
                    field="max_score"
                    sortable
                    header="მაქსიმალური ქულა"
                ></Column>
            </DataTable>

            <!-- <h3 class="m-0">
                ჯამური: {{ results.reduce((a, b) => a + b.score, 0) }} /
                {{ results.reduce((a, b) => a + b.max_score, 0) }}
            </h3> -->

            <div class="flex gap-4 justify-end">
                <Button
                    label="დახურვა"
                    severity="secondary"
                    outlined
                    @click="$emit('close')"
                    class=""
                />
                <Button @click="download" label="ნაშრომის გადმოწერა" />
            </div>
        </div>
    </Dialog>
</template>
