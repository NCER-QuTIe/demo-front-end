<script setup>
import Link from "@/components/home/Link.vue";
</script>

<template>
  <header class="p-4 flex justify-between w-full">
    <img src="/NCER-Logo-02.png" class="max-h-[4rem]" />
    <!-- <RouterLink to="/login" class="text-blue-600 underline"> ადმინისტრატორის გვერდი </RouterLink> -->
  </header>
  <div class="flex w-full items-center gap-8 pt-12 justify-start flex-col">
    <h1 class="text-3xl">
      აირჩიე კვლევა
    </h1>
    <div class="grid lg:grid-cols-[1fr_1fr_1fr_1fr] md:grid-cols-[1fr_1fr] gap-4">
      <div class="w-[16rem]">
        <Link url="/list?research=PISA" img-src="PISA.jpeg" name="PISA" />

        <div class="mt-4">
          <i>მოსწავლეთა შეფასების საერთაშორისო პროგრამა.</i>
        </div>

        <div class="mt-2">
          <p>
            PISA-ს კვლევის ნაწილში ნახავთ <strong>15 წლის</strong>
            მოსწავლეებისთვის განკუთვნილ დავალებებს შემდეგ
            სფეროებში:
          </p>
          <ul class="pl-8 list-disc">
            <li>კითხვა</li>
            <li>მათემატიკა</li>
            <li>ბუნებისმეტყველება</li>
          </ul>
        </div>
      </div>

      <div class="w-[16rem]">
        <Link url="/list?research=TIMSS" img-src="TIMSS.svg" name="TIMSS" />

        <div class="mt-4">
          <i>მათემატიკისა და საბუნებისმეტყველო საგნების სწავლისა და სწავლების საერთაშორისო კვლევა.</i>
        </div>

        <div class="mt-2">
          <p>
            TIMSS-ის კვლევის ნაწილში ნახავთ <strong>მე-4 და მე-8 კლასის</strong> მოსწავლეებისთვის განკუთვნილ დავალებებს
            შემდეგ სფეროებში:
          </p>
          <ul class="pl-8 list-disc">
            <li>მათემატიკა</li>
            <li>ბუნებისმეტყველება</li>
          </ul>
        </div>
      </div>

      <div class="w-[16rem]">
        <Link url="/list?research=computers" img-src="computers.png" name="computers" />

        <div class="mt-4">
          <i>პროგრამირება და კომპიუტერული წიგნიერება.</i>
        </div>
      </div>

      <div class="w-[16rem] opacity-[0.4]">
        <Link url="/list?research=PIRLS" img-src="PIRLS.svg" disabled name="PIRLS" />

        <div class="mt-4">
          <i>წიგნიერების საერთაშორისო კვლევა.</i>
        </div>

        <div class="mt-2">
          <p>
            PIRLS-ის კვლევის ნაწილში ნახავთ <strong>მე-4 კლასის</strong> მოსწავლეებისთვის განკუთვნილ დავალებებს შემდეგ
            სფეროში:
          </p>
          <ul class="pl-8 list-disc">
            <li>კითხვა</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- <RouterLink to="/list" class="text-blue-600 underline"> ყველა ერთად </RouterLink> -->
  </div>
</template>

<style lang="scss" scoped>
i {
  font-size: 0.9rem;
}

ul {
  margin-top: 0.5rem;

  li {
    margin-top: 0.25rem;
  }
}
</style>
