<script setup lang="ts">
import { ref, computed } from "vue";

type StackEl = {
  val: number;
  op: "+" | "-" | "*" | "÷" | "^";
};

let buffer = ref("0");
let stack: StackEl[] = [];
let justOped = ref(false);
let expression = ref("");
// Store last operation for repeating with equals
let lastOperation = ref<{value: number, op: "+" | "-" | "*" | "÷" | "^"} | null>(null);

// Format number for display with commas and proper decimal places
const formattedBuffer = computed(() => {
  const num = parseFloat(buffer.value);
  if (isNaN(num)) return "0";
  
  // Format with up to 8 decimal places, removing trailing zeros
  return num.toLocaleString('en-US', { 
    maximumFractionDigits: 8,
    minimumFractionDigits: 0
  });
});

// Create a human-readable expression to show what's happening
const currentExpression = computed(() => {
  if (stack.length === 0) return "";
  
  let expr = "";
  for (const item of stack) {
    expr += item.val.toString() + " " + item.op + " ";
  }
  
  return expr;
});

function doOp() {
  buffer.value = "";
  justOped.value = true;
  // Update the expression display
  expression.value = currentExpression.value;
}

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
  'x<sup class="calculator-sup">2</sup>': {
    onclick() {
      let x = Number(buffer.value);
      // Update expression to show what's happening
      expression.value = `(${x})² = `;
      setValue((x * x).toString());
    },
  },
  'y<sup class="calculator-sup">x</sup>': {
    onclick() {
      stack.push({
        val: Number(buffer.value),
        op: "^",
      });
      doOp();
    },
  },
  CE: {
    onclick() {
      buffer.value = "0";
    },
  },
  C: {
    onclick() {
      stack = [];
      buffer.value = "0";
      expression.value = "";
      justOped.value = false;
      lastOperation.value = null;
    },
  },
  "√x": {
    onclick() {
      let x = Number(buffer.value);
      // Show the square root operation in the expression
      expression.value = `√(${x}) = `;
      setValue(Math.sqrt(x).toString());
    },
  },
  "1/x": {
    onclick() {
      let x = Number(buffer.value);
      // Show the inverse operation in the expression
      expression.value = `1/(${x}) = `;
      setValue((1 / x).toString());
    },
  },
  π: {
    onclick() {
      // Only show "π =" when it's not part of another calculation
      if (stack.length === 0 && expression.value === "") {
        expression.value = "π = ";
      }
      setValue(Math.PI.toString());
    },
  },
  "÷": {
    onclick() {
      stack.push({
        val: Number(buffer.value),
        op: "÷",
      });
      doOp();
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
      doOp();
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
      doOp();
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
      doOp();
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
      const currentVal = Number(buffer.value);
      
      // Check if this is a repeated equals press
      if (stack.length === 0 && lastOperation.value !== null) {
        // Apply the last operation again
        let res = 0;
        const { value, op } = lastOperation.value;
        
        switch (op) {
          case "+":
            res = currentVal + value;
            break;
          case "-":
            res = currentVal - value;
            break;
          case "*":
            res = currentVal * value;
            break;
          case "÷":
            res = currentVal / value;
            break;
          case "^":
            res = Math.pow(currentVal, value);
            break;
        }
        
        // Update expression to show the repeat operation
        expression.value = `${currentVal} ${op} ${value} = `;
        setValue(res.toString());
      } else if (stack.length > 0) {
        // Complete the expression with the current value
        expression.value = currentExpression.value + currentVal;
        
        // Process the stack (regular equals operation)
        let lastStackItem = null;
        
        while (stack.length > 0) {
          let { val, op } = stack[stack.length - 1];
          lastStackItem = { value: val, op }; // Store for repeat operations
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
        
        // Add "=" to the expression to show completion
        if (expression.value) {
          expression.value += " = ";
        }
        
        // Store the last operation for repeat equals
        if (lastStackItem) {
          // For repeats, we need the second operand, not the first
          lastOperation.value = { 
            value: currentVal,  // The second operand becomes the repeating value
            op: lastStackItem.op 
          };
        }
      }
      
      justOped.value = false;
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
    ...keys[k],
    key: k,
    onclick() {
      justOped.value = false;
      keys[k].onclick();
    },
  };
};

let board = [
  [
    key('x<sup class="calculator-sup">2</sup>'),
    key('y<sup class="calculator-sup">x</sup>'),
    key("CE"),
    key("C"),
  ],
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
          <div class="calculator-display">
            <!-- Expression display -->
            <div class="expression-display text-sm text-left text-gray-500 h-5 overflow-hidden">
              {{ expression }}
            </div>
            <!-- Main display -->
            <div class="rounded-border border border-surface text-right p-1 h-9 overflow-hidden">
              {{ !justOped ? formattedBuffer : " " }}
            </div>
          </div>
        </td>
      </tr>
      <tr v-for="(row, i) in board" :key="i">
        <td v-for="elt in row" :colspan="elt.colspan" :key="elt.key">
          <Button @click="elt.onclick" v-html="elt.key" :severity="elt.severity || 'secondary'" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
.calculator-sup {
  left: -7px;
  margin-right: -7px;
}
</style>

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

.calculator-display {
  margin-bottom: 0.5rem;
}

.expression-display {
  padding: 0 0.5rem;
  margin-bottom: 0.2rem;
  font-style: italic;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
