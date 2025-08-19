<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router';
const sidebarOpen = ref(false)
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
                    <FontAwesomeIcon icon="heart-circle-check" size="2xl" class="text-red-500" />
                </div>
                <div class="avatar">
                    <div class="w-12 rounded-full">
                        <img
                            src="https://scontent.fcnx1-1.fna.fbcdn.net/v/t39.30808-1/515922313_1851394292258966_1297962357253773703_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEidjXgXnKD3Bta0OtpXLFA53EGbMn858zncQZsyfznzEBQ-L_gav3Xb9m7ttm3f7vGVz5Xc627yri9ZpvFqeW6&_nc_ohc=UR6kppwHPm4Q7kNvwHnR1Gi&_nc_oc=AdmkUyFNM5pJy471E5DbLenp9zVzRuLaw1fUHNWTF9bTz7X_zbUiRHWT1MTiV2uTbTE&_nc_zt=24&_nc_ht=scontent.fcnx1-1.fna&_nc_gid=k2nSgfCCxp7P2gRKH6KqUQ&oh=00_AfVQ4uEi9Os1RMdFNZ6ur-nV7mZIXd0MeC0mccUgeWbpyw&oe=68A689AD" />
                    </div>
                </div>
                <span>Chanipron Oonping</span>
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                        <FontAwesomeIcon icon="chevron-down" size="xl" />
                    </div>
                    <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
                        <li><a>Profile</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- ✅ Sidebar  -->
        <aside
            :class="['fixed top-16 bottom-0 left-0 z-40 bg-[#FDF2D3] w-52 p-4 shadow-sm', sidebarOpen ? 'block' : 'hidden', 'lg:block']">
            <ul class="menu">
                <li><RouterLink :to="'/'">
                        <FontAwesomeIcon icon="house-chimney" size="xl" /> แนะนำรายวิชา
                    </RouterLink></li>
                <li><a>
                        <FontAwesomeIcon icon="clipboard-list" size="xl" /> รายวิชาทั้งหมด
                    </a></li>
                <li><a>
                        <FontAwesomeIcon icon="people-robbery" size="xl" /> วิชายอดนิยม
                    </a></li>
                <li><RouterLink :to="'/review'">
                        <FontAwesomeIcon icon="comment-dots" size="xl" /> เขียนรีวิว
                    </RouterLink></li>
            </ul>
        </aside>

        <!-- ✅ พื้นที่ของview -->
        <main class="ml-0 lg:ml-52 pt-16 h-screen overflow-y-auto p-4">
            <slot></slot>
        </main>
    </div>
</template>
