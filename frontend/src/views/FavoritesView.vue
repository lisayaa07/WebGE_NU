<script setup>
import Layout from '@/layout/Layout.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'

library.add(farHeart, fasHeart)

// Base API URL (ตั้งใน .env: VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const router = useRouter()

// อ่านข้อมูลจาก localStorage ตามรูปแบบที่คุณเก็บไว้แล้ว
const studentId = ref(localStorage.getItem('student_ID') || '')
const isLoggedIn = computed(() => localStorage.getItem('auth') === '1' && !!studentId.value)

// state สำหรับเพจรายการโปรด
const groupedFavs = ref([])  // [{ group_ID, group_Name, subjects: [{subject_ID, subject_Name}] }]
const loading = ref(false)
const errorMsg = ref('')

// helper: headers (ใส่ Authorization ถ้ามี token)
function authHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('token')
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

// โหลดรายการโปรด (จัดกลุ่ม)
async function fetchFavoritesGrouped() {
  if (!isLoggedIn.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    const url = `${API_URL}/favorites/grouped?student_id=${encodeURIComponent(studentId.value)}`
    const res = await fetch(url, {
      method: 'GET',
      headers: authHeaders()
    })
    if (!res.ok) {
      let msg = res.statusText
      try { const j = await res.json(); msg = j?.message || msg } catch (e) {}
      throw new Error(msg)
    }
    const data = await res.json()
    groupedFavs.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('❌ โหลด favorites grouped ล้มเหลว', e)
    errorMsg.value = e.message || 'โหลดรายการโปรดไม่สำเร็จ'
  } finally {
    loading.value = false
  }
}

// (ตัวเลือก) กดหัวใจลบออกจากรายการโปรด แล้วอัปเดต UI ทันที (optimistic update)
async function removeFavorite(subjectId) {
  if (!isLoggedIn.value) {
    alert('กรุณาเข้าสู่ระบบก่อนจึงจะใช้งานรายการโปรดได้')
    return
  }
  const sid = String(subjectId).trim()

  // เก็บ snapshot เพื่อ rollback หากล้มเหลว
  const snapshot = JSON.parse(JSON.stringify(groupedFavs.value))

  try {
    // optimistic update: ลบจาก state ทันที
    for (const g of groupedFavs.value) {
      g.subjects = g.subjects.filter(s => String(s.subject_ID) !== sid)
    }
    groupedFavs.value = groupedFavs.value.filter(g => g.subjects.length > 0)

    // call API ลบจริง
    const url = `${API_URL}/favorites?student_id=${encodeURIComponent(studentId.value)}&subject_id=${encodeURIComponent(sid)}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: authHeaders()
    })
    if (!res.ok) {
      let msg = res.statusText
      try { const j = await res.json(); msg = j?.message || msg } catch(e){}
      throw new Error(msg)
    }
  } catch (e) {
    console.error('❌ remove favorite error', e)
    // rollback
    groupedFavs.value = snapshot
    alert('ลบรายการโปรดไม่สำเร็จ กรุณาลองใหม่')
  }
}

// ไปหน้ารีวิวรายวิชา (ถ้าต้องการ)
function goToReviews(subject) {
  if (!subject?.subject_ID) return
  router.push({
    name: 'reviewsubjects',
    params: { id: subject.subject_ID },
    query: { name: subject.subject_Name || '' },
  })
}

onMounted(async () => {
  if (!isLoggedIn.value) return
  await fetchFavoritesGrouped()
})
</script>

<template>
  <Layout>
    <div class="p-6">
      <h1 class="text-2xl font-semibold mb-4">รายการโปรดของฉัน</h1>

      <!-- ยังไม่ได้ล็อกอิน -->
      <div v-if="!isLoggedIn" class="text-gray-600">
        กรุณาเข้าสู่ระบบเพื่อดูรายการโปรด
      </div>

      <!-- กำลังโหลด -->
      <div v-else-if="loading" class="text-gray-600">
        กำลังโหลดรายการโปรด...
      </div>

      <!-- เออเรอร์ -->
      <div v-else-if="errorMsg" class="text-red-600">
        {{ errorMsg }}
      </div>

      <!-- รายการโปรดแบบจัดกลุ่ม -->
      <div v-else>
        <div v-if="groupedFavs.length === 0" class="text-gray-600">
          ยังไม่มีวิชาที่ถูกใจ
        </div>

        <div v-for="group in groupedFavs" :key="group.group_ID" class="mb-6">
          <h2 class="text-xl font-medium mb-3">{{ group.group_Name || ('หมวด ' + group.group_ID) }}</h2>

          <div class="space-y-2">
            <div
              v-for="subject in group.subjects"
              :key="subject.subject_ID"
              class="flex items-center justify-between bg-pink rounded-lg px-4 py-2 shadow-sm"
            >
              <button
                type="button"
                class="text-left"
                @click="goToReviews(subject)"
                title="ดูรีวิววิชานี้"
              >
                {{ subject.subject_ID }} {{ subject.subject_Name }}
              </button>

              <!-- ปุ่มหัวใจแบบทึบสีเต็มดวง สำหรับ 'ลบออกจากโปรด' -->
              <button
                type="button"
                class="btn btn-ghost btn-circle"
                @click="removeFavorite(subject.subject_ID)"
                title="เอาออกจากรายการโปรด"
              >
                <FontAwesomeIcon :icon="['fas','heart']" size="xl" class="text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
