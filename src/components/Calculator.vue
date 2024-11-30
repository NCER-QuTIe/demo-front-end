<script setup lang="ts">
import { ref } from "vue";

type StackEl = {
    val: number;
    op: "+" | "-" | "*" | "÷" | "^";
};

let buffer = ref("0");
let stack: StackEl[] = [];

const setValue = (s: string) => {
    buffer.value = Number(s).toString();
};

let keys: {
    [key: string]: {
        onclick: () => void;
        colspan?: number;
        severity?: "primary";
    };
} = {
    "x<sup>2</sup>": {
        onclick() {
            let x = Number(buffer.value);
            setValue((x * x).toString());
        },
    },
    "y<sup>x</sup>": {
        onclick() {
            stack.push({
                val: Number(buffer.value),
                op: "^",
            });
            setValue("0");
        },
    },
    C: {
        onclick() {
            stack = [];
            setValue("0");
        },
        colspan: 2,
    },
    "√x": {
        onclick() {
            let x = Number(buffer.value);
            setValue(Math.sqrt(x).toString());
        },
    },
    "1/x": {
        onclick() {
            let x = Number(buffer.value);
            setValue((1 / x).toString());
        },
    },
    π: {
        onclick() {
            setValue(Math.PI.toString());
        },
    },
    "÷": {
        onclick() {
            stack.push({
                val: Number(buffer.value),
                op: "÷",
            });
            setValue("0");
        },
    },
    "7": {
        onclick() {
            setValue(buffer.value + "7");
        },
    },
    "8": {
        onclick() {
            setValue(buffer.value + "8");
        },
    },
    "9": {
        onclick() {
            setValue(buffer.value + "9");
        },
    },
    "*": {
        onclick() {
            stack.push({
                val: Number(buffer.value),
                op: "*",
            });
            setValue("0");
        },
    },
    "4": {
        onclick() {
            setValue(buffer.value + "4");
        },
    },
    "5": {
        onclick() {
            setValue(buffer.value + "5");
        },
    },
    "6": {
        onclick() {
            setValue(buffer.value + "6");
        },
    },
    "-": {
        onclick() {
            stack.push({
                val: Number(buffer.value),
                op: "-",
            });
            setValue("0");
        },
    },
    "1": {
        onclick() {
            setValue(buffer.value + "1");
        },
    },
    "2": {
        onclick() {
            setValue(buffer.value + "2");
        },
    },
    "3": {
        onclick() {
            setValue(buffer.value + "3");
        },
    },
    "+": {
        onclick() {
            stack.push({
                val: Number(buffer.value),
                op: "+",
            });
            setValue("0");
        },
    },
    "0": {
        onclick() {
            if (Number(buffer.value) !== 0) buffer.value += "0";
        },
    },
    ".": {
        onclick() {
            if (!buffer.value.includes(".")) buffer.value += ".";
        },
    },
    "+/-": {
        onclick() {
            if (buffer.value.startsWith("-")) {
                setValue(buffer.value.slice(1));
            } else {
                setValue("-" + buffer.value);
            }
        },
    },
    "=": {
        severity: "primary",
        onclick() {
            while (stack.length > 0) {
                let { val, op } = stack[stack.length - 1];
                stack.pop();

                let x = Number(buffer.value);
                let res = 0;
                switch (op) {
                    case "+":
                        res = val + x;
                        break;
                    case "-":
                        res = val - x;
                        break;
                    case "*":
                        res = val * x;
                        break;
                    case "÷":
                        res = val / x;
                        break;
                    case "^":
                        res = Math.pow(val, x);
                        break;
                }

                setValue(res.toString());
            }
        },
    },
};

let key = (
    k: string,
): {
    key: string;
    onclick: () => void;
    colspan?: number;
    severity?: "primary";
} => {
    return {
        key: k,
        ...keys[k],
    };
};

let board = [
    [key("x<sup>2</sup>"), key("y<sup>x</sup>"), key("C")],
    [key("√x"), key("1/x"), key("π"), key("÷")],
    [key("7"), key("8"), key("9"), key("*")],
    [key("4"), key("5"), key("6"), key("-")],
    [key("1"), key("2"), key("3"), key("+")],
    [key("0"), key("."), key("+/-"), key("=")],
];
</script>

<template>
    <table>
        <tbody>
            <tr>
                <td colspan="4">
                    <div
                        class="rounded-border border border-surface text-right p-1"
                    >
                        {{ buffer }}
                    </div>
                </td>
            </tr>
            <tr v-for="(row, i) in board" :key="i">
                <td v-for="elt in row" :colspan="elt.colspan" :key="elt.key">
                    <Button
                        @click="elt.onclick"
                        v-html="elt.key"
                        :severity="elt.severity || 'secondary'"
                    />
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
table {
    border: none;
}

td {
    border: none;
    padding: 0.2rem;
}

button {
    width: 100%;
    text-align: center;
    height: 2em;
    min-width: 3em;
}
</style>
