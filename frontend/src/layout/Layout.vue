<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router';
import profile from '/Photo/profilee.jpg'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

function favorites() {
    router.push('/favorites')
}

function home() {
    router.push('/')
}

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

// --- State and Logic for Editing Name --- // ADDED
const isEditingName = ref(false) // State สำหรับสลับโหมด View/Edit
const editableName = ref('') // State สำหรับเก็บชื่อที่กำลังแก้ไขใน input

// ฟังก์ชันเพื่อเริ่มโหมดแก้ไข
function startEditingName() {
    editableName.value = user.value.name // นำชื่อปัจจุบันไปใส่ใน input
    isEditingName.value = true
}

// ฟังก์ชันเพื่อยกเลิกการแก้ไข
function cancelEditingName() {
    isEditingName.value = false
}

// ฟังก์ชันสำหรับบันทึกชื่อใหม่
async function saveName() {
  try {
    const response = await axios.put(`http://localhost:3000/students/${user.value.student_ID}`, {
      name: editableName.value
    });
    
    const updatedUser = response.data; // จะได้รับ { student_Name: "ชื่อใหม่" }
    user.value.name = updatedUser.student_Name; // อัปเดต UI
    localStorage.setItem('studentName', updatedUser.student_Name); // อัปเดต Local Storage
    
    alert('อัปเดตชื่อสำเร็จ!');

  } catch (error) {
    console.error('Failed to update name:', error);
    alert('เกิดข้อผิดพลาดในการอัปเดตชื่อ');
  } finally {
    isEditingName.value = false;
  }
}

// async function saveName() {
//     if (editableName.value.trim() === '' || editableName.value === user.value.name) {
//         isEditingName.value = false;
//         return;
//     }

//     try {
//         console.log('1. [SAVE] กำลังส่งข้อมูล:', { id: user.value.student_ID, name: editableName.value });

//         const response = await axios.put(`http://localhost:3000/students/${user.value.student_ID}`, {
//             name: editableName.value
//         });

//         console.log('2. [SAVE] ได้รับข้อมูลตอบกลับจาก Backend:', response.data);

//         // ตรวจสอบว่า Backend ส่งข้อมูลกลับมาถูกต้องหรือไม่
//         if (response.data && response.data.student_Name) {
//             const updatedUser = response.data;

//             console.log('3. [SAVE] ชื่อเก่าใน State:', user.value.name);

//             // --- ส่วนที่สำคัญที่สุด ---
//             // อัปเดต State ของ Vue และ localStorage
//             user.value.name = updatedUser.student_Name;
//             localStorage.setItem('studentName', updatedUser.student_Name);

//             console.log('4. [SAVE] ชื่อใหม่ใน State:', user.value.name);

//             alert('อัปเดตชื่อสำเร็จ!');
//         } else {
//             // ถ้า Backend ไม่ส่งข้อมูลกลับมา ให้โยน Error
//             throw new Error('Backend did not return the updated user data.');
//         }

//     } catch (error) {
//         console.error('5. [SAVE] เกิดข้อผิดพลาด:', error);
//         alert('เกิดข้อผิดพลาดในการอัปเดตชื่อ');
//     } finally {
//         // --- ส่วนที่สำคัญที่สุด ---
//         // บล็อก finally จะทำงาน "เสมอ" ไม่ว่าจะสำเร็จหรือล้มเหลว
//         // ทำให้ปุ่มบันทึกและยกเลิกหายไปแน่นอน
//         console.log('6. [SAVE] ปิดโหมดแก้ไข (finally block)');
//         isEditingName.value = false;
//     }
// }

function openProfile() {
    const dlg = document.getElementById('profileModal')
    if (dlg && typeof dlg.showModal === 'function') {
        isEditingName.value = false;
        dlg.showModal()
    }
}

// function openProfile() {
//     const dlg = document.getElementById('profileModal')
//     if (dlg && typeof dlg.showModal === 'function') dlg.showModal()
// }

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
            class="fixed top-5 left-10 right-10 z-50 bg-white/80 shadow-md shadow-blue-950 h-20 flex items-center justify-between px-4 rounded-2xl">
            <div class="flex items-center gap-2">
                <button class="btn btn-square btn-ghost lg:hidden" @click="sidebarOpen = !sidebarOpen">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <button @click="home" class="btn btn-ghost text-3xl">
                    GE NU
                </button>
            </div>
            <div class="flex items-center gap-3">
                <button class="btn btn-ghost btn-circle text-center" @click="favorites" aria-label="ไปหน้ารายการโปรด"
                    title="รายการโปรด">
                    <FontAwesomeIcon icon="heart-circle-check" size="2xl" class="text-red-500 cursor-pointer" />
                </button>
                <span class="text-2xl font-semibold">{{ user.name || '—' }}</span>
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
                    <div class="modal-box bg-[#6495ED] rounded-2xl shadow-2xl">
                        <h3 class="font-bold text-2xl mb-5 text-[#F5F5DC]">Profile</h3>
                        <div class="flex items-center gap-4 mb-6">
                            <div class="avatar">
                                <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img :src="profile" alt="profile" />
                                </div>
                            </div>
                            <div>
                                <div v-if="!isEditingName" class="mt-3 text-xl font-semibold text-[#330000]">
                                    {{ user.name || '—' }}
                                    <FontAwesomeIcon icon="pen"
                                        class="text-base-200 cursor-pointer ml-2 hover:text-white" title="แก้ไขชื่อ"
                                        @click="startEditingName" />
                                </div>

                                <div v-else class="mt-3 space-y-2">
                                    <input type="text" v-model="editableName"
                                        class="input input-bordered w-full max-w-xs" placeholder="กรอกชื่อใหม่"
                                        @keyup.enter="saveName" />
                                    <div class="flex gap-2">
                                        <button class="btn btn-sm btn-success" @click="saveName">บันทึก</button>
                                        <button class="btn btn-sm btn-ghost" @click="cancelEditingName">ยกเลิก</button>
                                    </div>
                                </div>

                                <div class="text-sm opacity-70">{{ user.email || '—' }}</div>
                                <div class="text-sm opacity-70">Student ID: {{ user.student_ID || '—' }}</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 text-lg">
                            <div class="p-4 rounded-box bg-base-200 shadow-xl/20">
                                <div class="opacity-60 text-base">ชั้นปี</div>
                                <div class="font-medium text-xl">{{ user.student_level || '—' }}</div>
                            </div>
                            <div class="p-4 rounded-box bg-base-200 shadow-xl/20">
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
            :class="['fixed top-28 bottom-4 left-10 z-40 bg-[#192F4E] text-white/80 w-56 p-4 shadow-sm rounded-l-2xl', sidebarOpen ? 'block' : 'hidden', 'lg:block']">
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

        <!-- ✅ พื้นที่ของview -->
        <main class="pt-28 h-screen pr-4 pb-4 mr-6 ml-10 lg:pl-54">
            <div class="bg-white/90 w-full h-full shadow-lg p-6 overflow-y-auto rounded-2xl lg:rounded-l-none">
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
