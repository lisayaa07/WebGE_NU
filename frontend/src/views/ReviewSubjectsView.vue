<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '@/layout/Layout.vue'
import api from '@/api/api'

const route = useRoute()
const router = useRouter()

const subjectId = computed(() => String(route.params.id || ''))
const subjectName = computed(() => route.query.name || `วิชา #${subjectId.value}`)

const loading = ref(false)
const errorMsg = ref('')
const comments = ref([])

// แปลงให้แสดงผลง่าย (รองรับโครงสร้างที่ต่างกันได้เล็กน้อย)
function normalize(r) {
    return {
        id: r?.id ?? crypto.randomUUID?.() ?? Math.random(),
        text: r?.text ?? r?.review ?? r?.comment ?? '',
        author: r?.author?.name ?? r?.author ?? r?.user_name ?? 'ผู้ใช้',
        rating: r?.rating ?? r?.score ?? null,
        date: r?.created_at ?? r?.date ?? null,
    }
}

async function fetchAllReviews() {
    if (!subjectId.value) {
        errorMsg.value = 'ไม่มี subjectId'
        return
    }
    loading.value = true
    errorMsg.value = ''
    comments.value = []
    try {
        // ถ้า backend มี prefix /api ให้แก้เป็น api.get(`/api/subjects/${...}/reviews`)
        const { data } = await api.get(`/subjects/${subjectId.value}/reviews`)
        const list = Array.isArray(data?.reviews) ? data.reviews : (Array.isArray(data) ? data : [])
        comments.value = list.map(normalize)
    } catch (e) {
        errorMsg.value = e?.response?.data?.message || e.message || 'โหลดคอมเมนต์ไม่สำเร็จ'
    } finally {
        loading.value = false
    }
}

onMounted(fetchAllReviews)

function back() {
    router.back()
}
</script>

<template>
    <Layout>
        <div class="p-6 space-y-4">
            <div class="flex items-center justify-between">
                <div class="text-2xl font-bold">รีวิวจากรุ่นพี่</div>
                <button class="btn btn-active" @click="back">ย้อนกลับ</button>
            </div>

            <div class=" bg-base-200/70 rounded-4xl py-5 shadow">
                <div class="ml-13">
                    <div class="text-xl font-bold">
                        วิชา {{ subjectName }}
                    </div>

                    <div v-if="loading" class="p-4">กำลังโหลดคอมเมนต์…</div>
                    <div v-else-if="errorMsg" class="alert alert-error">{{ errorMsg }}</div>

                    <div v-else>
                        <div class="mb-2 text-sm opacity-70">ทั้งหมด {{ comments.length }} คอมเมนต์</div>

                        <div v-if="!comments.length" class="opacity-60">ยังไม่มีคอมเมนต์สำหรับวิชานี้</div>

                        <div v-else class="space-y-3">
                            <div v-for="c in comments" :key="c.id" class="chat chat-start">
                                <div class="chat-bubble">
                                    <!-- <div class="flex items-center justify-between">
                                    <div class="text-sm">
                                        <span v-if="c.rating">★ {{ c.rating }}</span>
                                        <span v-if="c.date" class="ml-2">{{ c.date }}</span>
                                    </div>
                                </div> -->
                                    <p class="text-base whitespace-pre-wrap">{{ c.text }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </Layout>
</template>
