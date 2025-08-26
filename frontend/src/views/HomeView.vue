<script setup>
import { RouterLink } from 'vue-router';

import Layout from '@/layout/Layout.vue';

</script>

<template>
  <Layout>
    <div class="text-center m-30">
      <p class="text-3xl">แบบทดสอบนี้จะช่วยแนะนำว่าวิชาไหนเหมาะกับคุณ<br></br>เพียงตอบไม่กี่คำถามง่ายๆ</p>
      <RouterLink :to="'/matchcase'" class="btn btn-error mt-7 w-30 text-lg">เริ่ม</RouterLink>
    </div>
  </Layout>
</template>