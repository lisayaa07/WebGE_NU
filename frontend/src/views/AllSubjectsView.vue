<script setup>
import { ref, onMounted } from 'vue'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const groupedSubjects = ref([])
const loading = ref(false)
const error = ref(null)

async function loadGroupedSubjects() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${API_URL}/grouped-subjects`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error((await res.json()).message || res.statusText)
    groupedSubjects.value = await res.json()
  } catch (e) {
    error.value = e.message || 'ไม่สามารถโหลดรายการได้'
  } finally {
    loading.value = false
  }
}

onMounted(loadGroupedSubjects)
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
