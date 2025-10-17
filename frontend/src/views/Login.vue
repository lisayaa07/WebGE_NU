<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi } from '@/composables/auth' // หรือ path ที่ถูกต้อง

const router = useRouter()
const identifier = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submitLogin() {
  error.value = ''
  loading.value = true
  try {
    await loginApi(identifier.value, password.value)
    // หลัง login สำเร็จ ให้ไปหน้าหลัก (ไม่แก้ template)
    router.push('/')
  } catch (e) {
    error.value = e?.message || 'ไม่สามารถเข้าสู่ระบบได้'
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F6E8C8]">
    <!-- กล่องใหญ่แบ่งซ้าย/ขวา -->
    <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#FBE7B2] rounded-[28px] shadow-xl overflow-hidden">
      <!-- ซ้าย: รูป + Welcome -->
      <div class="relative p-6 lg:p-10 bg-[#F7C86A]">
        <div class="absolute inset-0 bg-gradient-to-br from-[#FAD98C] via-[#F7C86A] to-[#F2B45E]" aria-hidden="true" />
        <div class="relative h-full flex flex-col items-center justify-center text-center">
          <img :src="pro" alt="students" class="w-11/12 max-w-[520px] rounded-2xl shadow-md" />
        </div>
      </div>

      <!-- ขวา: ฟอร์ม -->
      <div class="bg-[#FBEFD4] flex items-center">
        <form @submit="onLogin" class="w-full px-8 lg:px-12 py-10">
          <h2 class="text-3xl font-extrabold text-[#2E2A1F] mb-8">Login</h2>

          <label class="block mb-4">
            <span class="text-sm text-[#6B614B]">email</span>
            <input v-model="email" class="input input-bordered w-full bg-white mt-2" placeholder="email(ลงท้ายด้วย @nu.ac.th)"
              pattern="^[^@\s]+@nu\.ac\.th$" required />
          </label>

          <label class="block mb-4">
            <span class="text-sm text-[#6B614B]">password</span>
            <input v-model="password" type="password" class="input input-bordered w-full bg-white mt-2"
              placeholder="password" autocomplete="current-password" required />
          </label>

          <p v-if="errorMsg" class="text-error text-sm mb-3">{{ errorMsg }}</p>

          <button class="btn w-full bg-[#F6C052] hover:bg-[#F3B43E] border-none" type="submit" :disabled="loading">
            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'Login' }}
          </button>

          <div class="text-sm text-[#6B614B] mt-6">
            don’t have an account?
            <router-link :to="{ name: 'signup' }" class="link link-warning">Sign up</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>