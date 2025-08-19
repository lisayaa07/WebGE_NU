<script setup>
import { RouterLink } from 'vue-router';

import Layout from '@/layout/Layout.vue'; //navbar sidebar

</script>

<template>
  <Layout>
    <div class="text-center mt-10">
      <h6>แบบทดสอบนี้จะช่วยแนะนำว่าวิชาไหนเหมาะกับคุณเพียงตอบไม่กี่คำถามง่ายๆ</h6>
      <RouterLink :to="'/matchcase'" class="btn btn-error">เริ่ม</RouterLink>
    </div>
  </Layout>
</template>