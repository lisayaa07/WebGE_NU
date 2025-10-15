<script setup>
import Layout from '@/layout/Layout.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'
library.add(farHeart, fasHeart)

// --- START: EDIT ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// --- END: EDIT ---

const router = useRouter()
const groupedSubjects = ref([])
const studentId = ref(localStorage.getItem('student_ID') || '')
const isLoggedIn = computed(() => localStorage.getItem('auth') === '1' && !!studentId.value)
const favoriteIds = ref(new Set())
const isFav = (subjectId) => favoriteIds.value.has(String(subjectId).trim())

async function fetchFavorites () {
  if (!isLoggedIn.value) return
  try {
    const { data } = await axios.get(`${API_URL}/favorites/ids`, { // <-- EDIT
      params: { student_id: studentId.value }
    })
    favoriteIds.value = new Set((data || []).map(String))
  } catch (err) {
    console.error('❌ โหลดรายการโปรดล้มเหลว', err)
  }
}

const toggleFavorite = async (subjectId) => {
  if (!isLoggedIn.value) {
    router.push({ name: 'login' })
    return
  }
  const stringId = String(subjectId).trim()
  const isCurrentlyFav = isFav(stringId)

  try {
    if (isCurrentlyFav) {
      await axios.delete(`${API_URL}/favorites`, { // <-- EDIT
        data: { student_id: studentId.value, subject_id: stringId }
      })
      favoriteIds.value.delete(stringId)
    } else {
      await axios.post(`${API_URL}/favorites`, { // <-- EDIT
        student_id: studentId.value,
        subject_id: stringId
      })
      favoriteIds.value.add(stringId)
    }
  } catch (err) {
    console.error('❌ อัปเดตรายการโปรดล้มเหลว', err)
  }
}

onMounted(async () => {
  try {
    const res = await axios.get(`${API_URL}/subjects-grouped`) // <-- EDIT
    groupedSubjects.value = res.data
    await fetchFavorites()
  } catch (err) {
    console.error('❌ โหลดวิชาล้มเหลว', err)
  }
})

function Comments(subject) {
  if (!subject?.subject_ID) return
  router.push({
    name: 'reviewsubjects',
    params: { id: subject.subject_ID },
    query: { name: subject.subject_Name || '' },
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

                            <!-- ปุ่มหัวใจ (layered) -->
                          <button
                            type="button"
                            class="btn btn-ghost btn-circle"
                            :aria-pressed="isFav(subject.subject_ID)"
                            @click="toggleFavorite(subject.subject_ID)"
                            :title="isFav(subject.subject_ID) ? 'เอาออกจากรายการโปรด' : 'เพิ่มเป็นรายการโปรด'"
                            >
                            <FontAwesomeIcon
                                :icon="isFav(subject.subject_ID) ? ['fas','heart'] : ['far','heart']"
                                size="xl"
                                :class="isFav(subject.subject_ID)
                                ? 'text-red-500 transition-transform duration-150 scale-110'
                                : 'text-red-500/40 hover:text-red-500 transition-colors duration-150'"
                            />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
