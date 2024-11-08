<template>
    <nav>
        <RouterLink to="/"> home</RouterLink>
        <RouterLink to="/test/any"> test</RouterLink>
        <RouterLink to="/list/"> list</RouterLink>
    </nav>
</template>

<style scoped>
nav {
    width: 100%;
    padding: 4pt;
    display: flex;
    justify-content: end;
    gap: 4pt;
    height: 25pt;
}
</style>
