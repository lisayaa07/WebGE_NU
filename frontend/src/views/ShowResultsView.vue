<script setup>
import Layout from '@/layout/Layout.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useResultsStore } from '@/stores/results'

const router = useRouter()
const store = useResultsStore()

const hasData = computed(() => Array.isArray(store.resultGroups) && store.resultGroups.length > 0)

function backToForm() {
    router.back()
}

function Comments(c) {
    router.push({
        name: 'reviewsubjects',
        params: { id: c.subject_ID },     // ✅ ส่ง subject_ID ไปเป็นพารามิเตอร์
        query: { name: c.subject_Name || '', limit: 5 }, // ส่งชื่อไว้โชว์หัวเรื่อง + limit 5
    })
}
</script>

<template>
    <Layout>
        <div class="bg-base-100 shadow p-6 rounded-3xl mt-10 mx-3">
            <h1 class="text-2xl font-bold">วิชาที่เหมาะกับนิสิต</h1>
            <div v-if="store.errorMsg" class="alert alert-error">
                {{ store.errorMsg }}
            </div>

            <div v-if="!hasData" class="opacity-60">
                ยังไม่มีผลลัพธ์ (กรุณาคำนวณจากหน้าแนะนำรายวิชาก่อน)
            </div>

            <div v-else class="ml-5 mt-5">
                <div v-for="g in store.resultGroups" :key="g.group_type" class="mb-8">
                    <h2 class="text-xl font-bold mb-3">
                        {{ g.group_type_name || g.group_type }}
                    </h2>
                    <div v-if="!g.items?.length" class="opacity-60">— ไม่มีผลลัพธ์ในกลุ่มนี้ —</div>

                    <div class="ml-15">
                        <div v-for="c in g.items" :key="c.subject_ID" class="flex justify-between my-4">
                            {{ c.subject_Name || ('วิชา #' + c.subject_ID) }}
                            <div class="flex justify-between gap-5">
                                <div class="badge badge-warning badge-lg">
                                    {{ Number(c.similarity).toFixed(2) }}%
                                </div>
                                <button type="button"
                                    class="inline-flex p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    aria-label="ดูคอมเมนต์" title="ดูคอมเมนต์" @click="Comments(c)">
                                    <FontAwesomeIcon icon="comment-dots" size="xl" class="text-gray-600" />
                                </button>
                                <!-- <RouterLink :to="'/reviewsubjects'">
                                    <FontAwesomeIcon icon="comment-dots" size="xl" class="text-gray-600" />
                                </RouterLink> -->
                            </div>


                            <!-- <p class="text-sm opacity-70" v-if="c.review">{{ c.review }}</p> -->
                        </div>
                    </div>

                </div>
            </div>
            <div class="text-center">
                <RouterLink :to="'/matchcase'" class="btn btn-error">ย้อนกลับ</RouterLink>
            </div>
        </div>
    </Layout>
</template>
