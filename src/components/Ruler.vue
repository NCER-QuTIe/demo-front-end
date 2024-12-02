<script setup>
import { ref, reactive } from "vue";

let x = ref(0);
let y = ref(0);
let offset = { x: 0, y: 0 };
let styleObeject = reactive({
    left: "0px",
    top: "0px",
    transform: "rotate(0deg)",
});

function dragStart(event) {
    offset.x = event.clientX - x.value;
    offset.y = event.clientY - y.value;
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
}

function dragMove(event) {
    console.log(event);
    x.value = event.clientX - offset.x;
    y.value = event.clientY - offset.y;
    styleObeject.left = x.value + "px";
    styleObeject.top = y.value + "px";
    console.log(x.value, y.value);
}

function dragEnd(event) {
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
}

let ruler = ref();
let side = null;

function rotateStart(_side, event) {
    event.stopPropagation();
    side = _side;
    document.addEventListener("mousemove", rotate);
    document.addEventListener("mouseup", rotateEnd);
}

function rotate(event) {
    event.stopPropagation();
    let dx = -(event.clientY - (y.value + ruler.value.offsetHeight / 2));
    let dy = -(event.clientX - (x.value + ruler.value.offsetWidth / 2));
    let mag = Math.sqrt(dx * dx + dy * dy);
    dx /= mag;
    dy /= mag;
    let alpha = Math.atan2(dx, dy) + (side === "left" ? 0.05 : Math.PI - 0.05);
    console.log(event, x.value, y.value);
    styleObeject.transform = `rotate(${alpha}rad)`;
}

function rotateEnd(event) {
    document.removeEventListener("mousemove", rotate);
    document.removeEventListener("mouseup", rotateEnd);
    event.stopPropagation();
}
</script>

<template>
    <div class="absolute">
        <div
            class="z-50 opacity-90 absolute text-xs bg-emphasis h-24 pb-8 px-2 text-color text-center border-surface border rounded-border select-none"
            :style="styleObeject"
            @mousedown="dragStart"
            @mouseout=""
            ref="ruler"
        >
            <button
                class="absolute left-2 bottom-2 bg-primary size-8 rounded-border"
                @mousedown="rotateStart('left', $event)"
            >
                <i class="pi pi-refresh"></i>
            </button>

            <ul class="w-[821px] list-none flex justify-evenly px-[10px]">
                <li v-for="i in 201" :key="i">
                    <div
                        :class="{
                            'bg-[var(--p-text-color)]': true,
                            block: true,
                            cm: (i - 1) % 5 === 0 && (i - 1) % 2 === 0,
                            mm: (i - 1) % 5 !== 0,
                            hmm: (i - 1) % 5 === 0 && (i - 1) % 2 !== 0,
                        }"
                    />
                </li>
            </ul>
            <ul class="w-[821px] list-none flex justify-evenly px-[2px]">
                <li v-for="i in 201" :key="i">
                    <div v-if="(i - 1) % 10 === 0" class="w-4">
                        {{ Math.floor((i - 1) / 10) }}
                    </div>
                </li>
            </ul>

            <button
                class="absolute right-2 bottom-2 bg-primary size-8 rounded-border"
                @mousedown="rotateStart('right', $event)"
            >
                <i class="pi pi-refresh"></i>
            </button>
        </div>
    </div>
</template>

<style scoped>
.cm::before {
    display: block;
    content: " ";
    width: 1px;
    height: 20px;
}
.mm::before {
    display: block;
    content: " ";
    width: 1px;
    height: 10px;
}
.hmm::before {
    display: block;
    content: " ";
    width: 1px;
    height: 15px;
}
</style>
