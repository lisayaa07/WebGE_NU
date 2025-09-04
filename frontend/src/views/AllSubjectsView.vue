<script setup>
import Layout from '@/layout/Layout.vue'

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'     
import axios from 'axios'

const router = useRouter()                 
const groupedSubjects = ref([])

onMounted(async () => {
    try {
        const res = await axios.get('http://localhost:3000/grouped-subjects')
        groupedSubjects.value = res.data
    } catch (err) {
        console.error('❌ โหลด grouped subjects ล้มเหลว', err)
    }
})

//พาไปหน้ารีวิวของรายวิชาที่กดเข้าไป
function Comments(subject) {
    if (!subject?.subject_ID) {
        console.warn('ไม่มี subject_ID')
        return
    }
    router.push({
        name: 'reviewsubjects',
        params: { id: subject.subject_ID },           // ส่งรหัสวิชา
        query: { name: subject.subject_Name || '' },  // ส่งชื่อ
    })
}
</script>

<template>
    <Layout>
        <p class="text-3xl m-4 mb-5">หมวดวิชาศึกษาทั่วไป</p>

        <div v-for="group in groupedSubjects" :key="group.group_ID" class="ml-20">
            <p class="text-xl mb-2.5">{{ group.group_Name }}</p>

            <div class="ml-25">
                <div>
                    <div v-for="subject in group.subjects" :key="subject.subject_ID"
                        class="flex justify-between items-center">
                        <span>
                            {{ subject.subject_ID }} {{ subject.subject_Name }}
                        </span>

                        <div class="flex pr-20 gap-6">
                            <!-- ✅ ทำให้ปุ่มคอมเมนต์คลิกได้จริง และไม่ไป submit ฟอร์ม -->
                            <button type="button" class="btn btn-ghost btn-circle" @click="Comments(subject)"
                                aria-label="ดูคอมเมนต์ของวิชานี้" title="ดูคอมเมนต์">
                                <FontAwesomeIcon icon="comment-dots" size="xl" class="text-gray-600" />
                            </button>

                            <!-- ปุ่มหัวใจ (เดิม) -->
                            <button type="button" class="btn btn-ghost btn-circle" aria-label="ถูกใจ">
                                <FontAwesomeIcon :icon="['far', 'heart']" size="xl" class="text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
