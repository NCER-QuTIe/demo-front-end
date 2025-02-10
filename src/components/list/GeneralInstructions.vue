<script setup lang="js">
function doThing() {
  window.open('/zogadi-instruqcia.pdf', '_blank')
}
</script>

<template>
  <Button @click="doThing" label="ზოგადი ინსტრუქცია" />
</template>
