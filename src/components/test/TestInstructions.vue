<script setup lang="js">
function doThing() {
  window.open('/rogor-vupasuxot.pdf', '_blank')
}
</script>

<template>
  <Button icon="pi pi-question-circle" text iconPos="right" @click="doThing" severity="secondary"
    v-tooltip.bottom="'როგორ ვუპასუხოთ'" />
</template>
