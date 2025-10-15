<script setup>
import Layout from '@/layout/Layout.vue';

import { ref, onMounted, watch } from 'vue'


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

const reviewText = ref('')

function isNumberOnly(event) {
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault()
    }
}

const selectedGroupType = ref('')


watch(selectedGroupType, async (newGroupId) => {
    if (!newGroupId) {
        subjects.value = []
        return
    }

    try {
        const res = await fetch(`http://localhost:3000/subjects/${newGroupId}`)
        subjects.value = await res.json()
    } catch (err) {
        console.error("โหลดรายวิชาไม่สำเร็จ:", err)
        subjects.value = []
    }
})




// โหลดข้อมูลจาก backend
onMounted(async () => {
    try {
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
        console.error("โหลดข้อมูลไม่สำเร็จ:", err)
    }
})


// ====== ส่งฟอร์มเข้า /submit-form ======
async function onSubmit(e) {
    e.preventDefault()

    // ตรวจง่าย ๆ
    if (!studentId.value) return alert('กรุณากรอกรหัสนิสิต')
    if (!selectedStudentLevel.value) return alert('กรุณาเลือกชั้นปี')
    if (!selectedFaculty.value) return alert('กรุณาเลือกคณะ')
    if (!selectedGroupType.value) return alert('กรุณาเลือกหมวดวิชา')
    if (!selectedSubject.value) return alert('กรุณาเลือกรายวิชา')
    if (!selectedGroupwork.value) return alert('กรุณาตอบคำถามข้อที่ 1')
    if (!selectedsolowork.value) return alert('กรุณาตอบคำถามข้อที่ 2')
    if (!selectedexam.value) return alert('กรุณาตอบคำถามข้อที่ 3')
    if (!selectedattendance.value) return alert('กรุณาตอบคำถามข้อที่ 4')
    if (selectedinstruction.value.length === 0) return alert('กรุณาตอบคำถามข้อที่ 5')
    if (!selectedpresent.value) return alert('กรุณาตอบคำถามข้อที่ 6')
    if (!selectedexperience.value) return alert('กรุณาตอบคำถามข้อที่ 7')
    if (!selectedchallenge.value) return alert('กรุณาตอบคำถามข้อที่ 8')
    if (!selectedtime.value) return alert('กรุณาตอบคำถามข้อที่ 9')

    // เตรียม payload ให้ตรงกับ backend
    const payload = {
        student_id: studentId.value,
        subjectGroup: selectedGroupType.value,
        student_level: selectedStudentLevel.value,
        faculty: selectedFaculty.value,
        interestd: selectedInterestd.value,   // backend รวมเป็น comma ให้เอง
        subject: selectedSubject.value,

        groupwork: selectedGroupwork.value,
        solowork: selectedsolowork.value,
        exam: selectedexam.value,
        attendance: selectedattendance.value,
        instruction: selectedinstruction.value.join(','),
        present: selectedpresent.value,
        experience: selectedexperience.value,
        challenge: selectedchallenge.value,
        time: selectedtime.value,

        grade: selectedGrade.value,
        review: reviewText.value
        
    }

    try {
        const res = await fetch('http://localhost:3000/submit-form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        const text = await res.text()
        if (!res.ok) {
            console.error('submit-form failed:', text)
            return alert('บันทึกไม่สำเร็จ: ' + text)
        }

        alert('บันทึกสำเร็จ 🎉')
        // จะ reset ฟอร์มไหม? ถ้าต้องการ uncomment ข้างล่าง
        // resetForm()
    } catch (err) {
        console.error('submit error:', err)
        alert('เกิดข้อผิดพลาดระหว่างบันทึก')
    }
}

//(ถ้าต้องการ reset)
function resetForm() {
    studentId.value = ''
    selectedStudentLevel.value = ''
    selectedFaculty.value = ''
    selectedInterestd.value = []
    selectedGroupType.value = ''
    selectedSubject.value = ''
    selectedGroupwork.value = ''
    selectedsolowork.value = ''
    selectedexam.value = ''
    selectedattendance.value = ''
    selectedinstruction.value = []
    selectedpresent.value = ''
    selectedexperience.value = ''
    selectedchallenge.value = ''
    selectedtime.value = ''
    selectedGrade.value = ''
    reviewText.value = ''
}


</script>

<template>
    <Layout>
        <form class="p-6 space-y-6" @submit="onSubmit">

            <div class="flex gap-10">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend text-lg">รหัสนิสิต</legend>
                    <input type="text" v-model="studentId" class="input input-neutral" placeholder="กรอกรหัสนิสิต" />
                </fieldset>

                <!-- ชั้นปี -->
                <fieldset class="fieldset">
                    <legend class="fieldset-legend text-lg">ชั้นปี</legend>
                    <select class="select select-neutral" v-model="selectedStudentLevel">
                        <option disabled value="">เลือกชั้นปี</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </fieldset>

                <!-- คณะ -->
                <fieldset class="fieldset">
                    <legend class="fieldset-legend text-lg">คณะ</legend>
                    <select class="select select-neutral" v-model="selectedFaculty">
                        <option disabled value="">เลือกคณะ</option>
                        <option v-for="f in faculties" :key="f.faculty_ID" :value="f.faculty_ID">
                            {{ f.faculty_Name }}
                        </option>
                    </select>
                </fieldset>
            </div>


            <!-- ความสนใจ -->
            <div class="bg-[#6495ED]/50 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h2 class="font-bold mb-2">ความสนใจ(สามารถเลือกได้มากว่า 1 คำตอบ)</h2>

                    <label class="block" v-for="item in interestds" :key="item.interest_ID">
                        <input type="checkbox"
                            class="checkbox checkbox-sm border-blue-500 bg-blue-300 checked:border-blue-700 checked:bg-blue-600"
                            :value="item.interest_ID" v-model="selectedInterestd" />
                        {{ item.interest_Name }}
                    </label>
                </div>
                <div>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend text-lg">หมวดวิชา (กลุ่มวิชา)</legend>
                        <select class="select select-neutral w-full" v-model="selectedGroupType">
                            <option disabled value="">-- เลือกกลุ่มวิชา --</option>
                            <option v-for="group in subjectGroups" :key="group.GroupType_ID"
                                :value="group.GroupType_ID">
                                {{ group.GroupType_Name }}
                            </option>
                        </select>
                    </fieldset>

                    <fieldset class="fieldset mt-4">
                        <legend class="fieldset-legend text-lg">รายวิชา</legend>
                        <select class="select select-neutral w-full" v-model="selectedSubject">
                            <option disabled value="">-- เลือกรายวิชา --</option>
                            <option v-for="subject in subjects" :key="subject.subject_ID" :value="subject.subject_ID">
                                {{ subject.subject_Name }}
                            </option>
                        </select>
                    </fieldset>



                    <label class="block mt-4">
                        <span class="font-semibold">เกรดที่ได้</span>
                        <select v-model="selectedGrade" class="select select-neutral w-full mt-3">
                            <option disabled value="">กรุณาระบุ</option>
                            <option v-for="grades in grades" :key="grades.grade_ID" :value="grades.grade_ID">
                                {{ grades.grade_Name }}
                            </option>

                        </select>
                    </label>
                </div>
            </div>

            <!-- งานกลุ่ม -->
            <div class="bg-[#6495ED]/35 p-6 rounded-3xl">
                <h2 class="font-bold mb-3">เลือกคำตอบที่นิสิตคิดว่าตรงกับตนเองมากที่สุด</h2>
                <fieldset class="mb-4 pl-5">
                    <legend>
                        1. มีการมอบหมาย 
                        <span style="color:red;">งานกลุ่ม</span> 
                        ในรายวิชาอย่างไร <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5 space-y-2">
                        <label class="block" v-for="item in groupwork" :key="item.groupwork_ID">
                            <input type="radio" class="radio radio-sm bg-blue-100 border-blue-500 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600" name="groupwork"
                                :value="item.groupwork_ID" v-model="selectedGroupwork">
                            {{ item.groupwork_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#ADD8E6]/60 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>
                        2. มีการมอบหมาย 
                        <span style="color:red;">งานเดี่ยว</span> 
                        ในรายวิชาอย่างไร <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in soloWork" :key="item.solowork_ID">
                            <input type="radio" class="radio radio-sm bg-blue-100 border-blue-500 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600" name="solowork"
                                :value="item.solowork_ID" v-model="selectedsolowork">
                            {{ item.solowork_Name }}
                        </label>

                    </div>
                </fieldset>
            </div>

            <div class="bg-[#6495ED]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>
                        3.นิสิตต้องการให้มีรูปแบบ
                        <span style="color:red;">การสอบ</span> แบบใด 
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in exam" :key="item.exam_ID">
                            <input type="radio" class="radio radio-sm bg-blue-100 border-blue-500 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600" name="exam"
                                :value="item.exam_ID" v-model="selectedexam">
                            {{ item.exam_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#6495ED]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>
                        4.นิสิตต้องการให้มีการ <span style="color:red;">เช็คชื่อ</span> เข้าห้องเรียนอย่างไร 
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in attendance" :key="item.attendance_ID">
                            <input type="radio" class="radio radio-sm bg-blue-100 border-blue-500 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600" name="attendance"
                                :value="item.attendance_ID" v-model="selectedattendance">
                            {{ item.attendance_Name }}

                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#ADD8E6]/60 p-6 rounded-3xl">
                <fieldset class="pl-5 space-y-2">
                    <legend>
                    5.นิสิตต้องการให้รูปแบบ <span style="color:red;">การสอน</span> เป็นอย่างไร (ตอบได้มากกว่า 1 ข้อ)
                    <span style="color:red;">*</span>
                    </legend>

                    <div class="pl-5">
                    <label
                        class="flex items-center gap-2 py-1"
                        v-for="item in instruction"
                        :key="item.instruction_ID"
                        :for="`inst-${item.instruction_ID}`"
                    >
                        <input
                        type="checkbox"
                        class="checkbox checkbox-sm border-blue-500 bg-blue-300 checked:border-blue-700 checked:bg-blue-600"
                        :id="`inst-${item.instruction_ID}`"
                        :value="item.instruction_ID"
                        v-model="selectedinstruction"     
                        />
                        <span>{{ item.instruction_Name }}</span>
                    </label>
                    </div>
                </fieldset>
            </div>


            <div class="bg-[#6495ED]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>
                        6.นิสิตชอบให้มีการ
                        <span style="color:red;">นำเสนอหน้าชั้นเรียน</span> มากน้อยเพียงใด
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in present" :key="item.present_ID">
                            <input type="radio" class="radio radio-sm bg-blue-100 border-blue-500 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600" name="present"
                                :value="item.present_ID" v-model="selectedpresent">
                            {{ item.present_Name }}

                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#6495ED]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                   <legend>
                        7.นิสิตต้องการ
                        <span style="color:red;">ประสบการณ์ใหม่ๆ</span> จากวิชานี้หรือไม่
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in experience" :key="item.experience_ID">
                            <input type="radio" class="radio radio-sm bg-blue-100 border-blue-500 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600" name="experience"
                                :value="item.experience_ID" v-model="selectedexperience">
                            {{ item.experience_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#ADD8E6]/60 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>
                        8.ระดับ
                        <span style="color:red;">ความยากง่าย</span> ที่นิสิตต้องการ 
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in challenge" :key="item.challenge_ID">
                            <input type="radio" class="radio radio-sm bg-blue-100 border-blue-500 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600" name="challenge"
                                :value="item.challenge_ID" v-model="selectedchallenge">
                            {{ item.challenge_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#6495ED]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>
                       9.
                        <span style="color:red;">ช่วงเวลา</span> ในการเรียนที่นิสิตต้องการ(ช่วงเช้า = 8.00-11.50 , ช่วงบ่าย = 13.00-16.50)
                        <span style="color:red;">*</span>
                    </legend>
                    <div class="pl-5">
                        <label class="block" v-for="item in time" :key="item.time_ID">
                            <input type="radio" class="radio radio-sm bg-blue-100 border-blue-500 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600" name="time"
                                :value="item.time_ID" v-model="selectedtime">
                            {{ item.time_Name }}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#6495ED]/35 p-6 rounded-3xl">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend text-lg">ความรู้สึกที่มีต่อรายวิชานี้</legend>
                    <textarea v-model="reviewText" class="textarea textarea-neutral h-24 w-full"
                        placeholder="กรุณากรอกความรู้สึก"></textarea>

                </fieldset>
            </div>

            <!-- ปุ่ม submit -->
            <div class="text-center">
                <button type="submit" class="btn bg-blue-900 hover:bg-[#192F4E] text-white text-xl mt-3 p-6">Submit</button>
            </div>
        </form>
    </Layout>
</template>
