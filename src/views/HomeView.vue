<script setup>
import Link from "@/components/home/Link.vue";
</script>

<template>
  <div class="h-full flex flex-col">
    <header class="p-4 flex justify-between w-full">
      <img src="/NCER-Logo-02.png" class="max-h-[4rem]" />
    </header>
    <div class="flex w-full flex-grow items-center gap-8 justify-start pt-[20%] flex-col">
      <h1 class="text-3xl">
        აირჩიე კვლევა
      </h1>
      <div class="flex gap-4">
        <Link url="/list?research=PISA" img-src="PISA.svg" name="PISA" />
        <Link url="/list?research=TIMSS" img-src="PISA.svg" disabled name="TIMSS" />
        <Link url="/list?research=PIRLS" img-src="PISA.svg" disabled name="PIRLS" />
      </div>
      <RouterLink to="/list" class="text-blue-600 underline"> ყველა ერთად </RouterLink>
    </div>
  </div>
</template>
