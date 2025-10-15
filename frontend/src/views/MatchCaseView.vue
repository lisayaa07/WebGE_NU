<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResultsStore } from '@/stores/results'


import Layout from '@/layout/Layout.vue'
import api from '@/api/api'


const router = useRouter()
const resultsStore = useResultsStore()

const userCase = ref(null)


/* ---------- state: คำตอบผู้ใช้ ---------- */


// ข้อมูลที่โหลดจาก backend
const faculties = ref([])
const interestds = ref([])
const subjectGroups = ref([])
const grades = ref([])
const subjects = ref([])
const groupwork = ref([])
const soloWork = ref([])
const exam = ref([])
const attendance = ref([])
const instruction = ref([])
const present = ref([])
const experience = ref([])
const challenge = ref([])
const time = ref([])
const solowork = ref([])



// ตัวแปรที่ผูกกับ v-model
const studentId = ref('')
const selectedStudentLevel = ref('null')
const selectedFaculty = ref('null')
const selectedGrade = ref('')
const selectedInterestd = ref([])
const selectedSubjectGroup = ref('')
const selectedSubject = ref('')
const selectedGroupwork = ref('')
const selectedsolowork = ref('')
const selectedexam = ref('')
const selectedattendance = ref('')
const selectedinstruction = ref([])
const selectedpresent = ref('')
const selectedexperience = ref('')
const selectedchallenge = ref('')
const selectedtime = ref('')

const selectedGroupTypes = ref([])

const resultGroups = ref([])

/* ---------- state: ผลลัพธ์/โหลด/เออเรอร์ ---------- */
const loading = ref(false)
const errorMsg = ref('')
const results = ref([])


/* ---------- helpers ---------- */

// robust: เลือกคีย์คะแนนที่มีอยู่จริง (กันชื่อไม่ตรง)
function pickSimilarity(obj) {
    const keys = ['similarity', 'similarityPct', 'score', 'percent', 'pct', 'Similarity']
    for (const k of keys) {
        if (obj && Object.prototype.hasOwnProperty.call(obj, k) && obj[k] != null) return obj[k]
    }
    return null
}

// ฟังก์ชันช่วยแปลงเลขเป็น %
function pct(v) {
    if (v == null) return '-'
    const num = Number(v)
    if (!Number.isFinite(num)) return '-'
    const p = num > 1 ? num : num * 100 // รองรับกรณี backend ส่ง 0–1
    return p.toFixed(2) + '%'
}


function normalizeGroups(data) {
  const arr = Array.isArray(data) ? data : (data?.items ?? [])
  return arr
    .map(x => ({
      GroupType_ID:   x.GroupType_ID   ?? x.group_type_id ?? x.groupTypeId ?? x.id,
      GroupType_Name: x.GroupType_Name ?? x.group_type_name ?? x.groupTypeName ?? x.name,
    }))
    .filter(x => x.GroupType_ID && x.GroupType_Name)
}


//โหลดข้อมูลตอน mount
onMounted(async () => {
  try {
    const [
      gRes, fRes, iRes, grRes, gwRes, swRes, exRes, attRes, inRes, preRes, expRes, cRes, tRes
    ] = await Promise.all([
      api.get('/subject-groups'),
      api.get('/faculty'),
      api.get('/interestd'),
      api.get('/grades'),
      api.get('/groupwork'),
      api.get('/solowork'),
      api.get('/exam'),
      api.get('/attendance'),
      api.get('/instruction'),
      api.get('/present'),
      api.get('/experience'),
      api.get('/challenge'),
      api.get('/time'),
    ])

    // ✅ กลุ่มวิชา: map ให้แน่ใจว่าเป็น { GroupType_ID, GroupType_Name }
    subjectGroups.value = normalizeGroups(gRes.data)
    console.log('subjectGroups:', subjectGroups.value) // ดูในคอนโซลว่ามีไหม

    // ที่เหลือปล่อยเป็น array ตรง ๆ ได้เหมือนเดิม
    faculties.value   = fRes.data ?? []
    interestds.value  = iRes.data ?? []
    grades.value      = grRes.data ?? []
    groupwork.value   = gwRes.data ?? []
    soloWork.value    = swRes.data ?? []
    exam.value        = exRes.data ?? []
    attendance.value  = attRes.data ?? []
    instruction.value = inRes.data ?? []
    present.value     = preRes.data ?? []
    experience.value  = expRes.data ?? []
    challenge.value   = cRes.data ?? []
    time.value        = tRes.data ?? []

    // ค่า default จาก localStorage (ของเดิม)
    const email = localStorage.getItem('userEmail')
    if (!email) return router.push({ name: 'login', query: { redirect: '/review' } })

    studentId.value            = localStorage.getItem('student_ID')   || ''
    selectedStudentLevel.value = localStorage.getItem('studentLevel') || ''
    selectedFaculty.value      = localStorage.getItem('facultyId')    || ''
  } catch (err) {
    console.error("โหลดข้อมูลไม่สำเร็จ:", err?.response?.status, err?.response?.data || err.message)
  }
})

// เปิด/ปิดการล็อกดีบักในคอนโซล (ตั้ง false เมื่อปล่อยโปรดักชัน)
const DEBUG_LOG = import.meta.env.DEV || import.meta.env.VITE_DEBUG_LOG === 'true'

function logDebugItem(c) {
    if (!DEBUG_LOG || !c?.dbg) return

    const name = c.subject_Name || `วิชา #${c.subject_ID}`
    const simPct = Number(c.similarity ?? 0).toFixed(2)

    // กลุ่มแบบย่อ อ่านง่าย
    console.groupCollapsed(`DBG: ${name} (similarity ${simPct}%)`)

    // 1) ค่าที่ผู้ใช้กรอก / ค่าของเคส
    console.log('ผู้ใช้กรอก:', c.dbg.user_input)
    console.log('ค่าของเคส (DB):', c.dbg.case_values)

    // 2) ตารางคอนทริบิวชัน (ใช้ console.table ให้อ่านง่าย)
    const contribs = c.dbg.contributions || {}
    const rows = Object.keys(contribs).map((k) => ({
        dim: k,
        sim: Number(c.sims?.[k] ?? 0).toFixed(3),
        weight: contribs[k]?.w,
        ws: contribs[k]?.ws,
        pct: `${contribs[k]?.ws_pct}%`,
    }))
    if (rows.length) {
        console.table(rows)
    } else {
        console.log('ไม่มี contributions')
    }

    // 3) สรุปรวม
    console.log('สรุป:', c.dbg.sums)

    console.groupEnd()
}


/* ---------- submit ---------- */
async function onSubmit() {
    loading.value = true
    errorMsg.value = ''
    results.value = []

const toD = (v) => /^\d+$/.test(String(v)) ? `D${v}` : String(v)
const instructionTokens = Array.isArray(selectedinstruction.value)
  ? selectedinstruction.value.map(toD)
  : []

    try {
        const payload = {
            interestd: selectedInterestd.value,
            groupwork:   selectedGroupwork.value,
            solowork:    selectedsolowork.value,
            exam:        selectedexam.value,   // จะได้ "C0" .. "C7"
            attendance:  selectedattendance.value,
            
            instructions:instructionTokens,
            instruction: instructionTokens[0] || '',
            instruction_CSV : instructionTokens.join(','),
            present:     selectedpresent.value,
            experience:  selectedexperience.value,
            challenge:   selectedchallenge.value,
            time:        selectedtime.value,
            group_types: selectedGroupTypes.value,  // ✅ ส่งหลายกลุ่ม
            debug: true,
            // weights: { ... }  // (ถ้ามี)
        }
        console.log('PLYLOAD /cbr-match:', payload)
        const { data } = await api.post('/cbr-match', payload)

        // ✅ รับ groups จาก backend
        resultGroups.value = Array.isArray(data.groups) ? data.groups : []

        // ใช้ top ถ้ามี ไม่งั้นใช้ all
        const raw = (Array.isArray(data.top) && data.top.length ? data.top : data.all) || []

        // ✅ บังคับให้มี field similarity เสมอ (รองรับหลายชื่อ)
        results.value = raw.map(r => {
            const s = r.similarity ?? r.similarityPct ?? r.score ?? r.percent ?? r.pct ?? null
            const n = Number(s)
            return { ...r, similarity: Number.isFinite(n) ? n : 0 }
        })

        // debug
        console.log('CBR response:', data)
        console.log('Mapped results:', results.value)

        // ✅ ส่งผลลัพธ์ไปเก็บใน Pinia store และไปหน้า /results 
        resultsStore.setResults({
            resultGroups: resultGroups.value,
            results: results.value,
            payload, // เก็บไว้เผื่อ debug/ย้อนกลับ 
        })

        if (DEBUG_LOG) {
            for (const g of resultGroups.value || []) {
                for (const c of g.items || []) {
                    logDebugItem(c)
                }
            }
        }

        router.push({ name: 'showresults' }) // ไปหน้าแสดงผล


    } catch (e) {
        errorMsg.value = e?.response?.data?.message || e.message || 'เกิดข้อผิดพลาด'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <Layout>
        
        <form class="p-6 space-y-6" @submit.prevent="onSubmit">
            <!-- ความสนใจ -->
            <div class="bg-[#F992AF]/50 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <h2 class="font-bold mb-2">ความสนใจ (เลือกได้มากกว่า 1 คำคอบ)</h2>
                    <label class="block"
                        v-for="it in interestds" :key="it.interest_ID"
                        :for="`interest-${it.interest_ID}`">
                    <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600"
                            :id="`interest-${it.interest_ID}`"
                            :value="String(it.interest_ID)"
                            v-model="selectedInterestd">
                    {{ it.interest_Name }}
                    </label>
                </div>
                <div>
                    <h2 class="font-bold mb-2">หมวดวิชาศึกษาทั่วไปที่นิสิตจะลงเรียน</h2>
                    <label class="block"
                        v-for="g in subjectGroups" :key="g.GroupType_ID">
                    <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600"
                            :value="g.GroupType_ID"
                            v-model="selectedGroupTypes">
                    {{ g.GroupType_Name }}
                    </label>
                </div>
            </div>

            <!-- งานกลุ่ม -->
            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <h2 class="font-bold mb-3">เลือกคำตอบที่นิสิตคิดว่าตรงกับตนเองมากที่สุด</h2>
                <fieldset class="mb-4 pl-5">
                     <legend>
                        1. นิสิตต้องการให้มีการมอบหมาย 
                        <span style="color:red;">งานกลุ่ม</span> 
                        ในรายวิชาอย่างไร <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                    <label class="block" v-for="o in groupwork" :key="o.groupwork_ID">
                        <input type="radio" name="groupwork"
                            class="radio radio-sm radio-error bg-white/50"
                            :value="o.groupwork_ID"
                            v-model="selectedGroupwork">
                        {{ o.groupwork_Name }}
                    </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                   <legend>
                        2. นิสิตต้องการให้มีการมอบหมาย 
                        <span style="color:red;">งานเดี่ยว</span> 
                        ในรายวิชาอย่างไร <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                    <label class="block" v-for="o in soloWork" :key="o.solowork_ID">
                        <input type="radio" name="solowork"
                            class="radio radio-sm radio-error bg-white/50"
                            :value="o.solowork_ID"
                            v-model="selectedsolowork">
                        {{ o.solowork_Name }}
                    </label>
                    </div>

                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                  <legend>
                        3.นิสิตต้องการให้มีรูปแบบ
                        <span style="color:red;">การสอบ</span> แบบใด 
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                    <label class="block" v-for="o in exam" :key="o.exam_ID">
                        <input type="radio" name="exam"
                            class="radio radio-sm radio-error bg-white/50"
                            :value="o.exam_ID"            
                            v-model="selectedexam">
                        {{ o.exam_Name }}
                    </label>
                    </div>

                </fieldset>

            </div>

            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>
                        4.นิสิตต้องการให้มีการ <span style="color:red;">เช็คชื่อ</span> เข้าห้องเรียนอย่างไร 
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                    <label class="block" v-for="o in attendance" :key="o.attendance_ID">
                        <input type="radio" name="attendance"
                            class="radio radio-sm radio-error bg-white/50"
                            :value="o.attendance_ID"
                            v-model="selectedattendance">
                        {{ o.attendance_Name }}
                    </label>
                    </div>
                    </fieldset>
                     </div>


            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>
                        5.นิสิตต้องการให้รูปแบบ
                        <span style="color:red;">การสอน</span> เป็นอย่างไร (ตอบได้มากกว่า 1 ข้อ)
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                    <label class="block" v-for="o in instruction" :key="o.instruction_ID"
                            :for="`inst-${o.instruction_ID}`">
                        <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-700 bg-white/50"
                            :id="`inst-${o.instruction_ID}`"
                            :value="String(o.instruction_ID)"
                            v-model="selectedinstruction">
                        {{ o.instruction_Name }}
                    </label>
                    </div>
                    </fieldset>
                     </div>


            <!-- 6. นำเสนอ -->
            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>
                        6.นิสิตชอบให้มีการ
                        <span style="color:red;">นำเสนอหน้าชั้นเรียน</span> มากน้อยเพียงใด
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                    <label class="block" v-for="o in present" :key="o.present_ID">
                        <input type="radio" name="present"
                            class="radio radio-sm radio-error bg-white/50"
                            :value="o.present_ID"
                            v-model="selectedpresent">
                        {{ o.present_Name }}
                    </label>
                    </div>
                    </fieldset>
                     </div>

                    
            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>
                        7.นิสิตต้องการ
                        <span style="color:red;">ประสบการณ์ใหม่ๆ</span> จากวิชานี้หรือไม่
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                    <label class="block" v-for="o in experience" :key="o.experience_ID">
                        <input type="radio" name="experience"
                            class="radio radio-sm radio-error bg-white/50"
                            :value="o.experience_ID"
                            v-model="selectedexperience">
                        {{ o.experience_Name }}
                    </label>
                    </div>
                    </fieldset>
                     </div>

                <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                  <fieldset class="pl-5">
                    <legend>
                        8.ระดับ
                        <span style="color:red;">ความยากง่าย</span> ที่นิสิตต้องการ 
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                    <label class="block" v-for="o in challenge" :key="o.challenge_ID">
                        <input type="radio" name="challenge"
                            class="radio radio-sm radio-error bg-white/50"
                            :value="o.challenge_ID"
                            v-model="selectedchallenge">
                        {{ o.challenge_Name }}
                    </label>
                    </div>
                    </fieldset>
                     </div>

                <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                    <fieldset class="pl-5">
                    <legend>
                       9.
                        <span style="color:red;">ช่วงเวลา</span> ในการเรียนที่นิสิตต้องการ(ช่วงเช้า = 8.00-11.50 , ช่วงบ่าย = 13.00-16.50)
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                    <label class="block" v-for="o in time" :key="o.time_ID">
                        <input type="radio" name="time"
                            class="radio radio-sm radio-error bg-white/50"
                            :value="o.time_ID"
                            v-model="selectedtime">
                        {{ o.time_Name }}
                    </label>
                    </div>
                    </fieldset>
                     </div>


            <!-- ปุ่ม submit -->
            <div class="text-center">
                <button type="submit" class="btn bg-[#FFB74D] hover:bg-[#F57C00] text-white">คำนวณ</button>
            </div>

            <!-- แสดงผลลัพธ์ -->
            <!-- <div class="mt-6">
                <div v-if="loading" class="p-4">กำลังคำนวณเคส…</div>
                <div v-else-if="errorMsg" class="p-4 text-error">{{ errorMsg }}</div>
                <div v-else>
                    <div v-if="!resultGroups.length" class="opacity-60">ยังไม่มีผลลัพธ์</div>

                    <div v-for="g in resultGroups" :key="g.group_type" class="mb-8">
                        <h2 class="text-xl font-bold mb-3">
                            กลุ่มวิชา: {{ g.group_type_name || g.group_type }}
                        </h2>

                        <div v-if="!g.items?.length" class="opacity-60">— ไม่มีผลลัพธ์ในกลุ่มนี้ —</div>

                        <div v-for="c in g.items" :key="c.subject_ID" class="card bg-base-100 shadow mb-3">
                            <div class="card-body">
                                <h3 class="card-title">
                                    {{ c.subject_Name || ('วิชา #' + c.subject_ID) }}
                                    <span class="badge badge-warning badge-lg ml-2">
                                        {{ Number(c.similarity).toFixed(2) }}%
                                    </span>
                                </h3>
                                <p class="text-sm opacity-70" v-if="c.review">{{ c.review }}</p>
                                <details class="mt-2 opacity-80" v-if="c.dbg">
                                    <summary>ดูดีบัก (ค่าผู้ใช้ vs เคส, น้ำหนัก, คอนทริบิวชัน)</summary>

                                    <div class="mt-3 grid md:grid-cols-2 gap-4 text-sm">
                                        <div class="p-3 rounded-xl bg-base-200">
                                            <h4 class="font-semibold mb-2">ผู้ใช้กรอก</h4>
                                            <pre class="text-xs whitespace-pre-wrap">{{ c.dbg.user_input }}</pre>
                                        </div>
                                        <div class="p-3 rounded-xl bg-base-200">
                                            <h4 class="font-semibold mb-2">ค่าของเคส (DB)</h4>
                                            <pre class="text-xs whitespace-pre-wrap">{{ c.dbg.case_values }}</pre>
                                        </div>
                                    </div>

                                    <div class="mt-3 overflow-x-auto">
                                        <table class="table table-zebra text-xs">
                                            <thead>
                                                <tr>
                                                    <th>มิติ</th>
                                                    <th>sim</th>
                                                    <th>weight</th>
                                                    <th>w*s</th>
                                                    <th>% ต่อคะแนน</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(v, k) in c.dbg.contributions" :key="k">
                                                    <td class="font-mono">{{ k }}</td>
                                                    <td>{{ (c.sims[k] ?? 0).toFixed(3) }}</td>
                                                    <td>{{ v.w }}</td>
                                                    <td>{{ v.ws }}</td>
                                                    <td>{{ v.ws_pct }}%</td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td class="font-semibold">รวม</td>
                                                    <td></td>
                                                    <td>{{ c.dbg.sums.wsum }}</td>
                                                    <td>{{ c.dbg.sums.score }}</td>
                                                    <td>{{ (c.dbg.sums.norm * 100).toFixed(2) }}%</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
        </form>
    </Layout>
</template>
