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
const solowork = ref(null)

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
const selectedinstruction = ref('')
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



function toZeroBased(v) {
    if (v == null || v === '') return null
    const n = Number(v)
    if (!Number.isFinite(n)) return null
    return n - 1   // แปลง 1→0, 2→1, ...
}

//โหลดข้อมูลตอน mount
onMounted(async () => {
    try {
        const { data } = await api.get('/subject-groups')
        subjectGroups.value = Array.isArray(data) ? data : []

        const [fRes, iRes, gRes, grRes, sgRes, gwRes, swRes, exRes, attRes, inRes, preRes,
            expRes, cRes, tRes] = await Promise.all([
                fetch("http://localhost:3000/faculty"),
                fetch("http://localhost:3000/interestd"),
                fetch("http://localhost:3000/subject-groups"),
                fetch("http://localhost:3000/grades"),
                fetch("http://localhost:3000/subjects/:groupId"),
                fetch("http://localhost:3000/groupwork"),
                fetch("http://localhost:3000/solowork"),
                fetch("http://localhost:3000/exam"),
                fetch("http://localhost:3000/attendance"),
                fetch("http://localhost:3000/instruction"),
                fetch("http://localhost:3000/present"),
                fetch("http://localhost:3000/experience"),
                fetch("http://localhost:3000/challenge"),
                fetch("http://localhost:3000/time")
            ])

            faculties.value = await fRes.json()
            interestds.value = await iRes.json()
            subjectGroups.value = await gRes.json()
            grades.value = await grRes.json()
            subjects.value = await sgRes.json()
            groupwork.value = await gwRes.json()
            soloWork.value = await swRes.json()
            exam.value = await exRes.json()
            attendance.value = await attRes.json()
            instruction.value = await inRes.json()
            present.value = await preRes.json()
            experience.value = await expRes.json()
            challenge.value = await cRes.json()
            time.value = await tRes.json()

            const email = localStorage.getItem('userEmail')
            if (!email) {
                return router.push({ name: 'login', query: { redirect: '/review' } })
            }

            studentId.value = localStorage.getItem('student_ID') || ''
            selectedStudentLevel.value = localStorage.getItem('studentLevel') || ''
            selectedFaculty.value = localStorage.getItem('facultyId') || ''

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

    try {
        const payload = {
            interestd: selectedInterestd.value,
            groupwork: toZeroBased(groupwork.value),
            solowork: toZeroBased(solowork.value),
            exam: exam.value,   // จะได้ "C0" .. "C7"
            attendance: toZeroBased(attendance.value),
            instruction: instruction.value,   // ไม่เปลี่ยน (ไม่ได้เป็น simInverseAbs)
            present: toZeroBased(present.value),
            experience: toZeroBased(experience.value),
            challenge: toZeroBased(challenge.value),
            time: toZeroBased(time.value),
            group_types: selectedGroupTypes.value,  // ✅ ส่งหลายกลุ่ม
            debug: true,
            // weights: { ... }  // (ถ้ามี)
        }

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
                    <h2 class="font-bold mb-2">ความสนใจ(เลือกได้มากกว่า 1 คำตอบ)</h2>
                    <label class="block" v-for="item in interestds" :key="item.interest_ID">
                        <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800"
                            :value="item.interest_ID" v-model="selectedInterestd" />
                        {{ item.interest_Name }}
                    </label>
                </div>
                <div>
                    <h2 class="font-bold mb-2">หมวดวิชาศึกษาทั่วไปที่นิสิตจะลงเรียน</h2>
                    <label class="block" v-for="g in subjectGroups" :key="g.GroupType_ID">
                        <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600"
                            :value="g.GroupType_ID" v-model="selectedGroupTypes" />
                        {{ g.GroupType_Name }}
                    </label>
                </div>
            </div>

            <!-- งานกลุ่ม -->
            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <h2 class="font-bold mb-3">เลือกคำตอบที่นิสิตคิดว่าตรงกับตนเองมากที่สุด</h2>
                <fieldset class="mb-4 pl-5 space-y-2">
                    <legend>
                        1. นิสิตต้องการให้มีการมอบหมาย 
                        <span style="color:red;">งานกลุ่ม</span> 
                        ในรายวิชาอย่างไร <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5 space-y-2">
                        <label class="block" v-for="item in groupwork" :key="item.groupwork_ID">
                            <input type="radio" class="radio radio-sm radio-error bg-white/50" name="groupwork"
                                :value="item.groupwork_ID" v-model="selectedGroupwork">
                            {{ item.groupwork_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5 space-y-2">
                    <legend>
                        2. นิสิตต้องการให้มีการมอบหมาย 
                        <span style="color:red;">งานเดี่ยว</span> 
                        ในรายวิชาอย่างไร <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5 space-y-2">
                        <label class="block" v-for="item in soloWork" :key="item.solowork_ID">
                            <input type="radio" class="radio radio-sm radio-error bg-white/50" name="solowork"
                                :value="item.solowork_ID" v-model="selectedsolowork">
                            {{ item.solowork_Name }}
                        </label>

                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5 space-y-2">
                    <legend>
                        3.นิสิตต้องการให้มีรูปแบบ
                        <span style="color:red;">การสอบ</span> แบบใด 
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in exam" :key="item.exam_ID">
                            <input type="radio" class="radio radio-sm radio-error bg-white/50" name="exam"
                                :value="item.exam_ID" v-model="selectedexam">
                            {{ item.exam_Name }}
                        </label>
                    </div>
                </fieldset>

            </div>

            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="pl-5 space-y-2">
                    <legend>
                        4.นิสิตต้องการให้มีการ <span style="color:red;">เช็คชื่อ</span> เข้าห้องเรียนอย่างไร 
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in attendance" :key="item.attendance_ID">
                            <input type="radio" class="radio radio-sm radio-error bg-white/50" name="attendance"
                                :value="item.attendance_ID" v-model="selectedattendance">
                            {{ item.attendance_Name }}

                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5 space-y-2">
                    <legend>
                        5.นิสิตต้องการให้รูปแบบ
                        <span style="color:red;">การสอน</span> เป็นอย่างไร (ตอบได้มากกว่า 1 ข้อ)
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in instruction" :key="item.instruction_ID">
                            <input type="radio" class="radio radio-sm radio-error bg-white/50" name="instruction"
                                :value="item.instruction_ID" v-model="selectedinstruction">
                            {{ item.instruction_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>
                        6.นิสิตชอบให้มีการ
                        <span style="color:red;">นำเสนอหน้าชั้นเรียน</span> มากน้อยเพียงใด
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5 space-y-2">
                        <label class="block" v-for="item in present" :key="item.present_ID">
                            <input type="radio" class="radio radio-sm radio-error bg-white/50" name="present"
                                :value="item.present_ID" v-model="selectedpresent">
                            {{ item.present_Name }}

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
                <div class="pl-5 space-y-2">
                        <label class="block" v-for="item in experience" :key="item.experience_ID">
                            <input type="radio" class="radio radio-sm radio-error bg-white/50" name="experience"
                                :value="item.experience_ID" v-model="selectedexperience">
                            {{ item.experience_Name }}
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
                    <div class="pl-5 space-y-2">
                        <label class="block" v-for="item in challenge" :key="item.challenge_ID">
                            <input type="radio" class="radio radio-sm radio-error bg-white/50" name="challenge"
                                :value="item.challenge_ID" v-model="selectedchallenge">
                            {{ item.challenge_Name }}
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
                        <label class="block"><input type="radio" name="time"
                                class="radio radio-sm radio-error bg-white/50" :value="1" v-model.number="time" />
                            ช่วงเช้า</label>
                        <label class="block"><input type="radio" name="time"
                                class="radio radio-sm radio-error bg-white/50" :value="2" v-model.number="time" />
                            ช่วงบ่าย</label>
                    </div>
                </fieldset>
            </div>

            <!-- ปุ่ม submit -->
            <div class="text-center">
                <button type="submit" class="btn btn-primary">คำนวณ</button>
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
