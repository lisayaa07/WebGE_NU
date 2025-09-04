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
const selectedInterestd = ref([])   // [1,2,3,...]



const groupwork = ref(null)
const solowork = ref(null)
const exam = ref(null)
const attendance = ref(null)
const instruction = ref(null)
const present = ref(null)
const experience = ref(null)
const challenge = ref(null)
const time = ref(null)
const subjectGroups = ref([])
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
                    <h2 class="font-bold mb-2">ความสนใจ</h2>
                    <!-- ปรับ :value ให้ตรงกับ interest_ID ใน DB ของคุณ -->
                    <label class="block">
                        <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600"
                            :value="1" v-model.number="selectedInterestd" />
                        สุขภาพและชีวิตประจำวัน
                    </label>
                    <label class="block">
                        <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600"
                            :value="2" v-model.number="selectedInterestd" />
                        ทักษะชีวิต คณิตศาสตร์ และการเงิน
                    </label>
                    <label class="block">
                        <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600"
                            :value="3" v-model.number="selectedInterestd" />
                        พัฒนาตัวเองและจิตวิทยา
                    </label>
                    <label class="block">
                        <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600"
                            :value="4" v-model.number="selectedInterestd" />
                        สังคม วัฒนธรรม และศาสนา
                    </label>
                    <label class="block">
                        <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600"
                            :value="5" v-model.number="selectedInterestd" />
                        ศิลปะและภาษา
                    </label>
                    <label class="block">
                        <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600"
                            :value="6" v-model.number="selectedInterestd" />
                        วิทยาศาสตร์ เทคโนโลยี และดิจิทัล
                    </label>
                    <label class="block">
                        <input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600"
                            :value="7" v-model.number="selectedInterestd" />
                        กฎหมายและพลเมือง
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
                <fieldset class="mb-4 pl-5">
                    <legend>1. งานกลุ่ม</legend>
                    <div class="pl-5">
                        <label class="block"><input type="radio" name="groupwork"
                                class="radio radio-sm radio-error bg-white/50" :value="1" v-model.number="groupwork" />
                            ไม่มี</label>
                        <label class="block"><input type="radio" name="groupwork"
                                class="radio radio-sm radio-error bg-white/50" :value="2" v-model.number="groupwork" />
                            น้อย</label>
                        <label class="block"><input type="radio" name="groupwork"
                                class="radio radio-sm radio-error bg-white/50" :value="3" v-model.number="groupwork" />
                            ปานกลาง</label>
                        <label class="block"><input type="radio" name="groupwork"
                                class="radio radio-sm radio-error bg-white/50" :value="4" v-model.number="groupwork" />
                            มาก</label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>2. งานเดี่ยว</legend>
                    <div class="pl-5">
                        <label class="block"><input type="radio" name="solowork"
                                class="radio radio-sm radio-error bg-white/50" :value="1" v-model.number="solowork" />
                            ไม่มี</label>
                        <label class="block"><input type="radio" name="solowork"
                                class="radio radio-sm radio-error bg-white/50" :value="2" v-model.number="solowork" />
                            น้อย</label>
                        <label class="block"><input type="radio" name="solowork"
                                class="radio radio-sm radio-error bg-white/50" :value="3" v-model.number="solowork" />
                            ปานกลาง</label>
                        <label class="block"><input type="radio" name="solowork"
                                class="radio radio-sm radio-error bg-white/50" :value="4" v-model.number="solowork" />
                            มาก</label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>3. การสอบ</legend>
                    <div class="pl-5">
                        <!-- เริ่มที่ 0 ให้ตรงกับเคส -->
                        <label class="block">
                            <input type="radio" name="exam" class="radio radio-sm radio-error bg-white/50" :value="'C0'"
                                v-model="exam" />ไม่มีสอบ
                        </label>
                        <label class="block">
                            <input type="radio" name="exam" class="radio radio-sm radio-error bg-white/50" :value="'C1'"
                                v-model="exam" />มีแค่ สอบย่อย
                        </label>
                        <label class="block">
                            <input type="radio" name="exam" class="radio radio-sm radio-error bg-white/50" :value="'C2'"
                                v-model="exam" />สอบย่อย + midterm + final
                        </label>
                        <label class="block">
                            <input type="radio" name="exam" class="radio radio-sm radio-error bg-white/50" :value="'C3'"
                                v-model="exam" />midterm + final
                        </label>
                        <label class="block">
                            <input type="radio" name="exam" class="radio radio-sm radio-error bg-white/50" :value="'C4'"
                                v-model="exam" />มีสอบแค่ midterm
                        </label>
                        <label class="block">
                            <input type="radio" name="exam" class="radio radio-sm radio-error bg-white/50" :value="'C5'"
                                v-model="exam" />มีสอบแค่ final
                        </label>
                        <label class="block">
                            <input type="radio" name="exam" class="radio radio-sm radio-error bg-white/50" :value="'C6'"
                                v-model="exam" />สอบย่อย + midterm
                        </label>
                        <label class="block">
                            <input type="radio" name="exam" class="radio radio-sm radio-error bg-white/50" :value="'C7'"
                                v-model="exam" />สอบย่อย + final
                        </label>
                    </div>
                </fieldset>

            </div>

            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>4. การเข้าเรียน</legend>
                    <div class="pl-5">
                        <label class="block"><input type="radio" name="attendance"
                                class="radio radio-sm radio-error bg-white/50" :value="1" v-model.number="attendance" />
                            ไม่มีเช็คชื่อ</label>
                        <label class="block"><input type="radio" name="attendance"
                                class="radio radio-sm radio-error bg-white/50" :value="2" v-model.number="attendance" />
                            มีเช็คชื่อบางครั้ง</label>
                        <label class="block"><input type="radio" name="attendance"
                                class="radio radio-sm radio-error bg-white/50" :value="3" v-model.number="attendance" />
                            มีเช็คชื่อทุกครั้ง</label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>5. รูปแบบการสอน</legend>
                    <div class="pl-5">
                        <label class="block"><input type="radio" name="instruction"
                                class="radio radio-sm radio-error bg-white/50" :value="1"
                                v-model.number="instruction" /> ไม่ค่อยสอน</label>
                        <label class="block"><input type="radio" name="instruction"
                                class="radio radio-sm radio-error bg-white/50" :value="2"
                                v-model.number="instruction" /> เน้นให้นิสิตทำความเข้าใจเอง</label>
                        <label class="block"><input type="radio" name="instruction"
                                class="radio radio-sm radio-error bg-white/50" :value="3"
                                v-model.number="instruction" /> เน้นสอนให้นิสิตเข้าใจ</label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>6. การนำเสนอหน้าชั้นเรียน</legend>
                    <div class="pl-5">
                        <label class="block"><input type="radio" name="present"
                                class="radio radio-sm radio-error bg-white/50" :value="1" v-model.number="present" />
                            ไม่มี</label>
                        <label class="block"><input type="radio" name="present"
                                class="radio radio-sm radio-error bg-white/50" :value="2" v-model.number="present" />
                            มีน้อย</label>
                        <label class="block"><input type="radio" name="present"
                                class="radio radio-sm radio-error bg-white/50" :value="3" v-model.number="present" />
                            มีปานกลาง</label>
                        <label class="block"><input type="radio" name="present"
                                class="radio radio-sm radio-error bg-white/50" :value="4" v-model.number="present" />
                            มีมาก</label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>7. ประสบการณ์ใหม่ๆ</legend>
                    <div class="pl-5">
                        <label class="block"><input type="radio" name="experience"
                                class="radio radio-sm radio-error bg-white/50" :value="1" v-model.number="experience" />
                            ไม่</label>
                        <label class="block"><input type="radio" name="experience"
                                class="radio radio-sm radio-error bg-white/50" :value="2" v-model.number="experience" />
                            น้อย</label>
                        <label class="block"><input type="radio" name="experience"
                                class="radio radio-sm radio-error bg-white/50" :value="3" v-model.number="experience" />
                            ปานกลาง</label>
                        <label class="block"><input type="radio" name="experience"
                                class="radio radio-sm radio-error bg-white/50" :value="4" v-model.number="experience" />
                            มาก</label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>8. ความท้าทาย</legend>
                    <div class="pl-5">
                        <label class="block"><input type="radio" name="challenge"
                                class="radio radio-sm radio-error bg-white/50" :value="1" v-model.number="challenge" />
                            ง่าย</label>
                        <label class="block"><input type="radio" name="challenge"
                                class="radio radio-sm radio-error bg-white/50" :value="2" v-model.number="challenge" />
                            ปานกลาง</label>
                        <label class="block"><input type="radio" name="challenge"
                                class="radio radio-sm radio-error bg-white/50" :value="3" v-model.number="challenge" />
                            ยาก</label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>9. ช่วงเวลาที่เรียน</legend>
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
