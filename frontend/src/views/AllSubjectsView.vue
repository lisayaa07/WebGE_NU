<script setup>
import Layout from '@/layout/Layout.vue';

import { ref, onMounted } from 'vue';
import axios from 'axios';

const groupedSubjects = ref([])

onMounted(async () => {
    try {
        const res = await axios.get('http://localhost:3000/grouped-subjects')
        groupedSubjects.value = res.data
    } catch (err) {
        console.error("❌ โหลด grouped subjects ล้มเหลว", err)
    }
})

</script>

<template>
    <Layout>
        <p class="text-3xl m-4 mb-5">หมวดวิชาศึกษาทั่วไป</p>
        <div v-for="group in groupedSubjects" :key="group.group_ID" class="ml-20">
            <p class="text-xl mb-2.5">{{ group.group_Name }}</p>
            <div class="ml-25">
                <div>
                    <div v-for="subject in group.subjects" :key="subject.subject_ID" class="flex justify-between">
                        {{ subject.subject_ID }} {{ subject.subject_Name }}
                        <div class="flex pr-20 gap-6 justify-between">
                            <div class="btn btn-ghost btn-circle">
                                <FontAwesomeIcon icon="comment-dots" size="xl" class="text-gray-600" />
                            </div>
                            <div class="btn btn-ghost btn-circle">
                                <FontAwesomeIcon :icon="['far', 'heart']" size="xl" class="text-red-500" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </Layout>
</template>