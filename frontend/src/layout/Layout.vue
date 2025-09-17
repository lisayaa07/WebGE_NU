<script setup>
import { ref , onMounted, computed } from 'vue'
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

onMounted(async() => {
  user.value.email         = localStorage.getItem('userEmail')    || ''
  user.value.student_ID    = localStorage.getItem('student_ID')   || ''
  user.value.student_level = localStorage.getItem('studentLevel') || ''
  user.value.faculty_ID    = (localStorage.getItem('facultyId') || localStorage.getItem('faculty_ID') || '').toString()
  user.value.name          = localStorage.getItem('studentName')  || ''

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
        <nav class="fixed top-0 left-0 right-0 z-50 bg-[#FDF2D3] shadow-sm h-16 flex items-center justify-between px-4">
            <div class="flex items-center gap-2">
                <button class="btn btn-square btn-ghost lg:hidden" @click="sidebarOpen = !sidebarOpen">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <a class="btn btn-ghost text-xl">NU GE</a>
            </div>
            <div class="flex items-center gap-3">
                <div class="btn btn-ghost btn-circle">
                   <router-link
                    :to="{ name: 'favorites' }"
                    class="inline-flex items-center p-2 rounded-md hover:bg-base-200"
                    aria-label="ไปหน้ารายการโปรด"
                    title="รายการโปรด"
                    >
                    <FontAwesomeIcon icon="heart-circle-check" size="2xl" class="text-red-500 cursor-pointer" />
                    </router-link>
                </div>
                <div class="avatar">
                    <div class="w-12 rounded-full">
                        <img :src="profile" alt="profile" />
                    </div>
                </div>
                <span>{{ user.name || '—' }}</span>
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                        <FontAwesomeIcon icon="chevron-down" size="xl" />
                    </div>
                    <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
                        <li><button @click="openProfile">Profile</button></li>
                        <li><button @click="logout">Logout</button></li>
                    </ul>
                </div>

                <!-- Popup โปรไฟล์ -->
                <dialog id="profileModal" class="modal">
                    <div class="modal-box bg-[#FFE0B2] shadow-xl rounded-2xl">
                    <h3 class="font-bold text-2xl mb-5 text-[#8B4513]">โปรไฟล์</h3>

                    <div class="flex items-center gap-4 mb-6">
                        <div class="avatar">
                        <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img :src="profile" alt="profile" />
                        </div>
                        </div>
                        <div>
                        <div class="mt-3 text-xl font-semibold text-[#5D4037]">{{ user.name || '—' }}</div>
                        <div class="text-sm opacity-70">{{ user.email || '—' }}</div>
                        <div class="text-sm opacity-70">Student ID: {{ user.student_ID || '—' }}</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 text-lg"> <!-- ✅ font ใหญ่ขึ้น -->
                        <div class="p-4 rounded-box bg-base-200">
                        <div class="opacity-60 text-base">ชั้นปี</div>
                        <div class="font-medium text-xl">{{ user.student_level || '—' }}</div>
                        </div>
                        <div class="p-4 rounded-box bg-base-200">
                        <div class="opacity-60 text-base">คณะ</div>
                        <div class="font-medium text-xl">{{ facultyName }}</div>
                        </div>
                    </div>

                    <div class="modal-action mt-6">
                        <form method="dialog">
                        <button class="btn bg-[#FFB74D] hover:bg-[#F57C00] text-white text-lg px-6">ปิด</button>
                        </form>
                    </div>
                    </div>
                </dialog>
            </div>
        </nav>

        <!-- ✅ Sidebar  -->
        <aside
            :class="['fixed top-16 bottom-0 left-0 z-40 bg-[#FDF2D3] w-52 p-4 shadow-sm', sidebarOpen ? 'block' : 'hidden', 'lg:block']">
            <ul class="menu rounded-box">
                <li :class="{ active: route.path === '/' }">
                    <RouterLink to="/">
                        <FontAwesomeIcon icon="house-chimney" size="xl" /> แนะนำรายวิชา
                    </RouterLink>
                </li>

                <li :class="{ active: route.path.startsWith('/allsubjects') }">
                    <RouterLink to="/allsubjects">
                        <FontAwesomeIcon icon="clipboard-list" size="xl" /> รายวิชาทั้งหมด
                    </RouterLink>
                </li>

                <li :class="{ active: route.path.startsWith('/popularsubjects') }">
                    <RouterLink to="/popularsubjects">
                        <FontAwesomeIcon icon="people-robbery" size="xl" /> วิชายอดนิยม
                    </RouterLink>
                </li>

                <li :class="{ active: route.path.startsWith('/review') }">
                    <RouterLink to="/review">
                        <FontAwesomeIcon icon="comment-dots" size="xl" /> เขียนรีวิว
                    </RouterLink>
                </li>
            </ul>

        </aside>

        <!-- ✅ พื้นที่ของview -->
        <main class="ml-0 lg:ml-52 pt-16 h-screen overflow-y-auto p-4">
            <slot></slot>
        </main>
    </div>
</template>

<style scoped>
:deep(.menu li.active > a),
:deep(.menu li > a.active),
:deep(.menu li > a.router-link-active),
:deep(.menu li > a.router-link-exact-active),
:deep(.menu li > a[aria-current="page"]) {
    background-color: rgba(0, 0, 0, 0.12);
    font-weight: 600;
    border-radius: 0.5rem;
}
</style>
