<script setup>
import NavBar from "./components/NavBar.vue";
</script>

<template>
    <!-- <NavBar /> -->
    <main class="h-full">
        <RouterView />
    </main>
</template>

<style scoped>
/* main {
    height: calc(100vh - 25pt);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: #6bb1eb;
    padding: 40pt;
} */
</style>
