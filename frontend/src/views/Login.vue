<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import pro from '/Photo/pro.png' // ← เปลี่ยนชื่อไฟล์ตามที่คุณวางจริง

const router = useRouter()
const id = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const onSubmit = async (e) => {
  e.preventDefault()
  errorMsg.value = ''
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id.value.trim(), password: password.value })
    })
    const data = await res.json()
    if (!res.ok || !data.ok) throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ')

    // ...หลังเช็ค ok แล้ว
    localStorage.setItem('auth', '1');
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('fullName', data.user.name ?? '');
    localStorage.setItem('studentLevel', String(data.user.student_level ?? ''));
    localStorage.setItem('facultyId', String(data.user.faculty_ID ?? ''));

    router.push({ name: 'home' })
  } catch (err) {
    errorMsg.value = err.message || 'เกิดข้อผิดพลาด'
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
        <div
          class="absolute inset-0 bg-gradient-to-br from-[#FAD98C] via-[#F7C86A] to-[#F2B45E]"
          aria-hidden="true"
        />
        <div class="relative h-full flex flex-col items-center justify-center text-center">
          <img :src="pro" alt="students" class="w-11/12 max-w-[520px] rounded-2xl shadow-md" />
        </div>
      </div>

      <!-- ขวา: ฟอร์ม -->
      <div class="bg-[#FBEFD4] flex items-center">
        <form @submit="onSubmit" class="w-full px-8 lg:px-12 py-10">
          <h2 class="text-3xl font-extrabold text-[#2E2A1F] mb-8">Login</h2>

          <label class="block mb-4">
            <span class="text-sm text-[#6B614B]">student id</span>
            <input
              v-model="id"
              class="input input-bordered w-full bg-white mt-2"
              placeholder="student id"
              autocomplete="username"
              required
            />
          </label>

          <label class="block mb-4">
            <span class="text-sm text-[#6B614B]">password</span>
            <input
              v-model="password"
              type="password"
              class="input input-bordered w-full bg-white mt-2"
              placeholder="password"
              autocomplete="current-password"
              required
            />
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
