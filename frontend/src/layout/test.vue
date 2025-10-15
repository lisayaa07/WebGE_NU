<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router';

import profilee from '../../public/Photo/profilee.jpg'

// --- FontAwesome Imports ---
// เราจะ import ไอคอนทั้งหมดที่ใช้ในหน้านี้
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBars, faXmark, faHouseChimney, faClipboardList, faPeopleRobbery,
  faCommentDots, faHeartCircleCheck, faChevronDown, faChevronRight, faHeart
} from '@fortawesome/free-solid-svg-icons';

// เพิ่มไอคอนเข้า library
library.add(
  faBars, faXmark, faHouseChimney, faClipboardList, faPeopleRobbery,
  faCommentDots, faHeartCircleCheck, faChevronDown, faChevronRight, faHeart
);


const router = useRouter()
const route = useRoute()

// --- State ---
// State สำหรับเมนูแบบพับในจอมือถือ
const isMobileMenuOpen = ref(false)

// ปิดเมนูอัตโนมัติเมื่อเปลี่ยนหน้า (route) ในจอมือถือ
watch(route, () => {
  if (isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false;
  }
})


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
  <div>
    <div class="hidden md:block min-h-screen">
      <nav
        class="bg-white shadow-lg h-20 flex items-center justify-between px-4 fixed top-5 left-10 right-10 z-50 rounded-2xl">
        <a class="btn btn-ghost text-3xl font-semibold">NU GE</a>
        <div class="flex items-center gap-3">
          <router-link to="#" title="รายการโปรด" class="btn btn-ghost btn-circle">
            <FontAwesomeIcon icon="heart-circle-check" size="2xl" class="text-red-500" />
          </router-link>
          <span class="text-xl font-semibold">{{ user.name || '—' }}</span>
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
            <div class="modal-box bg-[#FFE0B2] shadow-xl rounded-2xl">
              <h3 class="font-bold text-2xl mb-5 text-[#8B4513]">โปรไฟล์</h3>

              <div class="flex items-center gap-4 mb-6">
                <div class="avatar">
                  <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img :src="profilee" alt="profile" />
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

      
      <aside class="fixed top-28 bottom-4 left-10 z-40 bg-[#192F4E] text-white w-56 p-4 shadow-sm rounded-2xl">
        <nav class="space-y-2">
          <router-link to="#" class="flex items-center px-4 py-2 rounded-lg gap-2">
            <FontAwesomeIcon icon="house-chimney" size="xl" />แนะนำวิชา
          </router-link>
          <router-link to="#" class="flex items-center px-4 py-2 rounded-lg gap-2">
            <FontAwesomeIcon icon="clipboard-list" size="xl" />รายวิชาทั้งหมด
          </router-link>
          <router-link to="#" class="flex items-center px-4 py-2 rounded-lg gap-2">
            <FontAwesomeIcon icon="people-robbery" size="xl" />วิชายอดนิยม
          </router-link>
          <router-link to="#" class="flex items-center px-4 py-2 rounded-lg gap-2">
            <FontAwesomeIcon icon="comment-dots" size="xl" />เขียนรีวิว
          </router-link>
        </nav>
      </aside>
      <main class="ml-72 pr-10 pt-28 h-screen pb-4">
        <div class="bg-white w-full h-full shadow-lg p-6 overflow-y-auto rounded-2xl">
          <slot>
            <h1 class="text-2xl font-bold mb-4">Desktop Content Area</h1>
            <p>Your page content will be displayed here via the &lt;slot&gt;.</p>
          </slot>
        </div>
      </main>
    </div>

    <div class="md:hidden">
      <nav class="bg-white shadow-md h-20 flex items-center justify-between px-4 sticky top-0 z-20">
        <a class="btn btn-ghost text-2xl font-semibold">NU GE</a>
        <button class="btn btn-ghost btn-circle" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <FontAwesomeIcon v-if="!isMobileMenuOpen" icon="bars" class="h-6 w-6" />
          <FontAwesomeIcon v-else icon="xmark" class="h-6 w-6" />
        </button>
      </nav>

      <div :class="[
        'grid transition-[grid-template-rows] duration-300 ease-in-out',
        isMobileMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      ]">
        <div class="overflow-hidden">
          <div class="p-4 bg-white border-b">
            <nav class="flex flex-col space-y-1">
              <router-link to="#"
                class="flex items-center justify-between px-4 py-3 rounded-lg text-lg hover:bg-gray-100"><span>แนะนำวิชา</span>
                <FontAwesomeIcon icon="chevron-right" class="text-gray-400" />
              </router-link>
              <router-link to="#"
                class="flex items-center justify-between px-4 py-3 rounded-lg text-lg hover:bg-gray-100"><span>รายวิชาทั้งหมด</span>
                <FontAwesomeIcon icon="chevron-right" class="text-gray-400" />
              </router-link>
              <router-link to="#"
                class="flex items-center justify-between px-4 py-3 rounded-lg text-lg hover:bg-gray-100"><span>วิชายอดนิยม</span>
                <FontAwesomeIcon icon="chevron-right" class="text-gray-400" />
              </router-link>
              <router-link to="#"
                class="flex items-center justify-between px-4 py-3 rounded-lg text-lg hover:bg-gray-100"><span>เขียนรีวิว</span>
                <FontAwesomeIcon icon="chevron-right" class="text-gray-400" />
              </router-link>
              <router-link to="#"
                class="flex items-center justify-between px-4 py-3 rounded-lg text-lg hover:bg-gray-100"><span>วิชาที่ชื่นชอบ</span>
                <FontAwesomeIcon icon="chevron-right" class="text-gray-400" />
              </router-link>
            </nav>
          </div>
        </div>
      </div>

      <main class="p-4">
        <slot>
          <h1 class="text-2xl font-bold mb-4">Mobile Content Area</h1>
          <p>Your page content will be displayed here via the &lt;slot&gt;.</p>
        </slot>
      </main>
    </div>


  </div>
</template>

<style scoped>
/* สไตล์ Active Link สำหรับ Mobile Collapsible Menu */
.md\:hidden .router-link-exact-active {
  background-color: #F3E8FF;
  /* สีม่วงอ่อน */
  color: #6D28D9;
  /* สีม่วงเข้ม */
  font-weight: bold;
}

.md\:hidden .router-link-exact-active .fa-chevron-right {
  color: #6D28D9;
}


/* --- สไตล์สำหรับ Desktop Sidebar --- */
.hidden.md\:block .router-link-exact-active {
  background-color: #6A5ACD;
  color: white;
  font-weight: bold;
}

.hidden.md\:block a:not(.router-link-exact-active):hover {
  background-color: #374151;
}
</style>