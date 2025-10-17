<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authState, fetchMe, logoutApi } from '@/composables/auth' // path ตามโปรเจกต์

const router = useRouter()

onMounted(async () => {
  // เช็ก session จริงจาก backend
  await fetchMe()
})

function doLogout() {
  logoutApi()
  router.push('/login')
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
