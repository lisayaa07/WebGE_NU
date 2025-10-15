<script setup>
import Layout from '@/layout/Layout.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'

library.add(farHeart, fasHeart)




const router = useRouter()
const groupedSubjects = ref([])

// ✅ อ่านค่าจาก localStorage แบบที่โปรเจ็กต์คุณใช้อยู่แล้ว
const studentId = ref(localStorage.getItem('student_ID') || '')
const isLoggedIn = computed(() => localStorage.getItem('auth') === '1' && !!studentId.value)

// ✅ รายการโปรด (subject_ID เป็นชุด)
const favoriteIds = ref(new Set())
const isFav = (subjectId) => favoriteIds.value.has(String(subjectId).trim())

const API = 'http://localhost:3000' 

async function fetchFavorites () {
  if (!isLoggedIn.value) return
  try {
    const { data } = await axios.get(`${API}/favorites/ids`, {
      params: { student_id: studentId.value }
    })
    favoriteIds.value = new Set((data || []).map(String))
  } catch (err) {
    console.error('❌ โหลด favorites ล้มเหลว', err)
  }
}

async function toggleFavorite (subjectId) {
  if (!isLoggedIn.value) {
    alert('กรุณาเข้าสู่ระบบก่อนจึงจะใช้งานรายการโปรดได้')
    return
  }
  const sid = String(subjectId).trim()
  const wasFav = favoriteIds.value.has(sid)

  // optimistic update (ต้องสร้าง Set ใหม่ให้ reactive)
  const next = new Set(favoriteIds.value)
  wasFav ? next.delete(sid) : next.add(sid)
  favoriteIds.value = next

  try {
    if (wasFav) {
      await axios.delete(`${API}/favorites`, {
        params: { student_id: studentId.value, subject_id: sid }
      })
    } else {
      // ไม่ต้องส่ง group_type — trigger ใน DB จะเติมให้เอง
      await axios.post(`${API}/favorites`, {
        student_id: studentId.value,
        subject_id: sid
      })
    }
  } catch (err) {
    console.error('❌ toggle favorite error', err)
    // rollback
    const rollback = new Set(favoriteIds.value)
    wasFav ? rollback.add(sid) : rollback.delete(sid)
    favoriteIds.value = rollback
    alert('ไม่สามารถอัปเดตรายการโปรดได้ กรุณาลองใหม่')
  }
}

// โหลดข้อมูลหน้ารวมวิชา + รายการโปรด
onMounted(async () => {
  try {
    const res = await axios.get(`${API}/grouped-subjects`)
    groupedSubjects.value = res.data
  } catch (err) {
    console.error('❌ โหลด grouped subjects ล้มเหลว', err)
  }
  await fetchFavorites()
})

// ไปหน้ารีวิวรายวิชา
function Comments (subject) {
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
