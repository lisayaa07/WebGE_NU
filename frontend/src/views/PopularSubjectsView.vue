<script setup>
import Layout from '@/layout/Layout.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faCommentDots)

const router = useRouter()
const popularGroups = ref([])

const API = 'http://localhost:3000'

// โหลดข้อมูล popular subjects
onMounted(async () => {
  try {
    const res = await axios.get(`${API}/popular-subjects`)
    popularGroups.value = res.data
  } catch (err) {
    console.error('❌ โหลด popular subjects ล้มเหลว', err)
  }
})

// ไปหน้ารีวิวรายวิชา
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
    <p class="text-3xl m-4 mb-5">Top 3 วิชายอดฮิตของแต่ละกลุ่มวิชา</p>

    <div v-for="group in popularGroups" :key="group.group_ID" class="ml-20 ">
      <p class="text-xl mb-2.5">{{ group.group_Name }}</p>

      <div class="ml-25">
        <div>
          <div
            v-for="subject in group.subjects"
            :key="subject.subject_ID"
            class="flex justify-between items-center"
          >
            <!-- ชื่อวิชา -->
            <span class="text-xl font-medium text-black">
              {{ subject.subject_ID }} {{ subject.subject_Name }}
              <span class="ml-2 text-sm text-gray-500">
                ({{ subject.review_count }} รีวิว)
              </span>
            </span>


            <!-- ปุ่มคอมเมนต์ -->
            <div class="flex pr-20 gap-6">
              <button
                type="button"
                class="btn btn-ghost btn-circle"
                @click="Comments(subject)"
                aria-label="ดูคอมเมนต์ของวิชานี้"
                title="ดูคอมเมนต์"
              >
                <FontAwesomeIcon icon="comment-dots" size="xl" class="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
