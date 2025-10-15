<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router';
import profile from '/Photo/profile.png'

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

// ดึงข้อมูลผู้ใช้จาก localStorage
const user = ref({
  email: '',
  student_ID: '',
  student_level: '',
  faculty_ID: '',
  name: ''
})

const faculties = ref([])

onMounted(async () => {
  user.value.email = localStorage.getItem('userEmail') || ''
  user.value.student_ID = localStorage.getItem('student_ID') || ''
  user.value.student_level = localStorage.getItem('studentLevel') || ''
  user.value.faculty_ID = (localStorage.getItem('facultyId') || localStorage.getItem('faculty_ID') || '').toString()
  user.value.name = localStorage.getItem('studentName') || ''

  console.log('[Layout] LS:', {
    email: localStorage.getItem('userEmail'),
    student_ID: localStorage.getItem('student_ID'),
    studentLevel: localStorage.getItem('studentLevel'),
    facultyId: localStorage.getItem('facultyId'),
    studentName: localStorage.getItem('studentName'),
  })

  // โหลดรายชื่อคณะ (ID → Name)
  try {
    const res = await fetch('http://localhost:3000/faculty')
    faculties.value = await res.json()
  } catch (e) {
    console.error('โหลดคณะไม่สำเร็จ:', e)
    faculties.value = []
  }
})

const currentFacultyId = computed(() =>
  (user.value.faculty_ID || '').toString().trim()
)

const facultyName = computed(() => {
  const fid = currentFacultyId.value
  if (!fid) return '—'
  // เทียบแบบแปลงเป็น string เสมอ กันกรณี number/string ไม่ตรงกัน
  const found = faculties.value.find(f => String(f.faculty_ID).trim() === fid)
  return found?.faculty_Name || fid || '—'
})



function openProfile() {
  const dlg = document.getElementById('profileModal')
  if (dlg && typeof dlg.showModal === 'function') dlg.showModal()
}

function logout() {

  localStorage.removeItem('auth')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('student_ID')
  localStorage.removeItem('studentLevel')
  localStorage.removeItem('facultyName')
  localStorage.removeItem('studentName')
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen">
    <!-- ✅ Navbar -->
    <nav
      class="bg-[#FFFFFF] shadow-lg h-20 flex items-center justify-between px-4 lg:rounded-2xl lg:fixed lg:top-5 lg:left-10 lg:right-10 lg:z-50">
      <div class="flex items-center gap-2">
        <button class="btn btn-square btn-ghost lg:hidden" @click="sidebarOpen = !sidebarOpen">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <a class="hidden md:inline btn btn-ghost text-3xl font-semibold">NU GE</a>
      </div>
      <div class="flex items-center gap-3">
        <div class="btn btn-ghost btn-circle">
          <router-link :to="{ name: 'favorites' }" class="inline-flex items-center p-2 rounded-md hover:bg-base-200"
            aria-label="ไปหน้ารายการโปรด" title="รายการโปรด">
            <FontAwesomeIcon icon="heart-circle-check" size="2xl" class="text-red-500 cursor-pointer" />
          </router-link>
        </div>
        <div class="avatar">
          <div class="w-12 rounded-full">
            <img :src="profile" alt="profile" />
          </div>
        </div>
        <span class="hidden md:inline text-xl font-semibold">{{ user.name || '—' }}</span>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <FontAwesomeIcon icon="chevron-down" size="xl" />
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
            <li><button @click="openProfile">Profile</button></li>
            <li><button @click="logout">Logout</button></li>
          </ul>
        </div>
        <dialog id="profileModal" class="modal">
        </dialog>
      </div>
    </nav>

    <!-- ✅ Sidebar  -->
    <aside
      :class="['fixed top-28 bottom-4 left-10 z-40 bg-[#192F4E] text-white w-56 p-4 shadow-sm rounded-2xl lg:rounded-r-none', sidebarOpen ? 'block' : 'hidden', 'lg:block']">
      <nav class="space-y-2">
        <router-link to="/" class="flex items-center px-4 py-2 rounded-lg gap-2">
          <FontAwesomeIcon icon="house-chimney" size="xl" />
          แนะนำวิชาที่เหมาะกับคุณ
        </router-link>
        <router-link to="/allsubjects" class="flex items-center px-4 py-2 rounded-lg gap-2">
          <FontAwesomeIcon icon="clipboard-list" size="xl" />
          รายวิชาทั้งหมด
        </router-link>
        <router-link to="/popularsubjects" class="flex items-center px-4 py-2 rounded-lg gap-2">
          <FontAwesomeIcon icon="people-robbery" size="xl" />
          วิชายอดนิยม
        </router-link>
        <router-link to="/review" class="flex items-center px-4 py-2 rounded-lg gap-2">
          <FontAwesomeIcon icon="comment-dots" size="xl" />
          เขียนรีวิว
        </router-link>
      </nav>
    </aside>

    <main class="pt-28 h-screen pr-4 pb-4 mr-6 ml-10 lg:pl-56">
      <div class="bg-white w-full h-full shadow-lg p-6 overflow-y-auto rounded-2xl lg:rounded-l-none">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  background-color: #6A5ACD;
  color: white;
  font-weight: bold;
}

a:not(.router-link-exact-active):hover {
  background-color: #374151;
}
</style>