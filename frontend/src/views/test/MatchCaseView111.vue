<script setup>
import Layout from '@/layout/Layout.vue';

import { ref, onMounted } from 'vue'
import axios from 'axios'

const interestd = ref([])
const interestdOptions = ref([])
const subjectGroup = ref([])
const subjectGroupOptions = ref([])
const subject = ref('')
const subjectOptions = ref([])
const grade = ref('')
const gradeOptions = ref([])
const groupwork = ref('')
const groupworkOptions = ref([])
const solowork = ref('')
const soloworkOptions = ref([])
const attendance = ref('')
const attendanceOptions = ref([])
const exam = ref('')
const examOptions = ref([])
const instruction = ref('')
const instructionOptions = ref([])
const present = ref('')
const presentOptions = ref([])
const experience = ref('')
const experienceOptions = ref([])
const challenge = ref('')
const challengeOptions = ref([])
const time = ref('')
const timeOptions = ref([])

onMounted(async () => {
    try {
        interestdOptions.value = (await axios.get('http://localhost:3000/interestd')).data
        gradeOptions.value = (await axios.get('http://localhost:3000/grades')).data
        subjectGroupOptions.value = (await axios.get('http://localhost:3000/subject-groups')).data
        groupworkOptions.value = (await axios.get('http://localhost:3000/groupwork')).data
        soloworkOptions.value = (await axios.get('http://localhost:3000/solowork')).data
        attendanceOptions.value = (await axios.get('http://localhost:3000/attendance')).data
        examOptions.value = (await axios.get('http://localhost:3000/exam')).data
        instructionOptions.value = (await axios.get('http://localhost:3000/instruction')).data
        presentOptions.value = (await axios.get('http://localhost:3000/present')).data
        experienceOptions.value = (await axios.get('http://localhost:3000/experience')).data
        challengeOptions.value = (await axios.get('http://localhost:3000/challenge')).data
        timeOptions.value = (await axios.get('http://localhost:3000/time')).data
    }catch (err) {
    console.error('❌ ดึงข้อมูลผิดพลาด:', err)
    }
})

async function onSubjectGroupChange() {
  const res = await axios.get(`http://localhost:3000/subjects/${subjectGroup.value}`)
  subjectOptions.value = res.data
}

</script>

<template>
    <Layout>
        <form class="p-6 space-y-6">
            <!-- ความสนใจ -->
            <div class="bg-[#F992AF]/50 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h2 class="font-bold mb-2">ความสนใจ</h2>
                    <label class="block" v-for="item in interestdOptions" :key="item.interest_ID">
                        <input type="checkbox" :value="item.interest_ID" v-model="interestd"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        {{ item.interest_Name }}
                    </label>
                </div>

                <div>
                    <h2 class="font-bold mb-2">หมวดวิชาศึกษาทั่วไปที่นิสิตจะลงเรียน</h2>
                    <label class="block" v-for="item in subjectGroupOptions" :key="item.GroupType_ID">
                        <input type="checkbox" :value="item.GroupType_ID" v-model="subjectGroup"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        {{ item.GroupType_Name }}
                    </label>

                    <label class="block mt-4">
                        <span class="font-semibold">เกรดที่คาดหวัง</span>
                        <select v-model="grade" class="select select-error w-full mt-3">
                            <option disabled value="">กรุณาระบุ</option>
                            <option v-for="item in gradeOptions" :key="item.grade_ID" :value="item.grade_ID">
                                {{ item.grade_Name }}
                            </option>
                        </select>
                    </label>
                </div>
            </div>

            <!-- งานกลุ่ม -->
            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <h2 class="font-bold mb-3">เลือกคำตอบที่นิสิตคิดว่าตรงกับตนเองมากที่สุด</h2>
                <fieldset class="mb-4 pl-5">
                    <legend>1. งานกลุ่ม</legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in groupworkOptions" :key="item.groupwork_ID">
                            <input v-model="grade" :value="item.groupwork_ID"
                                type="radio" class="radio radio-sm radio-error bg-white/50" />
                            {{ item.groupwork_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>2. งานเดี่ยว</legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in soloworkOptions" :key="item.solowork_ID">
                            <input v-model="solowork" :value="item.solowork_ID"
                                type="radio" class="radio radio-sm radio-error bg-white/50" />
                            {{ item.solowork_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>3. การสอบ</legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in examOptions" :key="item.exam_ID">
                            <input v-model="exam" :value="item.exam_ID"
                                type="radio" class="radio radio-sm radio-error bg-white/50" />
                            {{ item.exam_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>4. การเข้าเรียน</legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in attendanceOptions" :key="item.attendance_ID">
                            <input v-model="attendance" :value="item.attendance_ID"
                                type="radio" class="radio radio-sm radio-error bg-white/50" />
                            {{ item.attendance_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>5. รูปแบบการสอน</legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in instructionOptions" :key="item.instruction_ID">
                            <input v-model="instruction" :value="item.instruction_ID"
                                type="radio" class="radio radio-sm radio-error bg-white/50" />
                            {{ item.instruction_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>6. การนำเสนอหน้าชั้นเรียน</legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in presentOptions" :key="item.present_ID">
                            <input v-model="present" :value="item.present_ID"
                                type="radio" name="soloWork" class="radio radio-sm radio-error bg-white/50" />
                            {{ item.present_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>7. นิสิตอยากได้ประสบการณ์ใหม่ๆในการเรียนมากน้อยแค่ไหน</legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in experienceOptions" :key="item.experience_ID">
                            <input v-model="experience" :value="item.experience_ID"
                                type="radio" name="soloWork" class="radio radio-sm radio-error bg-white/50" />
                            {{ item.experience_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>8. ความท้าทาย</legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in challengeOptions" :key="item.challenge_ID">
                            <input v-model="challenge" :value="item.challenge_ID"
                                type="radio" name="soloWork" class="radio radio-sm radio-error bg-white/50" />
                            {{ item.challenge_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>9. ช่วงเวลาที่เรียน</legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in timeOptions" :key="item.time_ID">
                            <input v-model="time" :value="item.time_ID"
                                type="radio" name="soloWork" class="radio radio-sm radio-error bg-white/50" />
                            {{ item.time_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <!-- ปุ่ม submit -->
            <div class="text-center">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </Layout>
</template>