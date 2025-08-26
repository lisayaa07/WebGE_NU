<script setup>
import Layout from '@/layout/Layout.vue';

import { ref ,onMounted, watch} from 'vue'


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
const selectedFaculty = ref('')
const selectedGrade = ref('')
const selectedInterestd = ref([])
const selectedSubjectGroup = ref('')
const selectedSubject = ref('')
const selectedgroupwork = ref('')
const selectedsolowork = ref('')
const selectedexam = ref('')
const selectedattendance = ref('')
const selectedinstruction = ref('')
const selectedpresent = ref('')
const selectedexperience = ref('')
const selectedchallenge = ref('')
const selectedtime = ref('')

function isNumberOnly(event) { 
    if (!/[0-8]/.test(event.key)) {
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
    const [fRes, iRes, gRes, grRes,sgRes,gwRes,swRes,exRes,attRes,inRes,preRes,
            expRes,cRes,tRes] = await Promise.all([
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
  } catch (err) {
    console.error("โหลดข้อมูลไม่สำเร็จ:", err)
  }
})



</script>

<template>
    <Layout>
        <form class="p-6 space-y-6">
            <div class="flex gap-10">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend text-lg">รหัสนิสิต</legend>
                    <input type="text" v-model="studentId" maxlength="8" @keypress="isNumberOnly"
                        class="input input-error" placeholder="กรอกรหัสนิสิต" />
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend text-lg">ชั้นปี</legend>
                    <select class="select select-error">
                        <option disabled selected>เลือกชั้นปี</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>
                </fieldset>

               <fieldset class="fieldset">
                    <legend class="fieldset-legend text-lg">คณะ</legend>
                    <select class="select select-error" v-model="selectedFaculty">
                        <option disabled value="">เลือกคณะ</option>
                        <option v-for="faculty in faculties" :key="faculty.faculty_ID" :value="faculty.faculty_ID">
                        {{ faculty.faculty_Name }}
                        </option>
                    </select>
                    </fieldset>
            </div>


            <!-- ความสนใจ -->
            <div class="bg-[#F992AF]/50 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h2 class="font-bold mb-2">ความสนใจ(สามารถเลือกได้มากว่า 1 คำตอบ)</h2>

                <label
                class="block"
                v-for="item in interestds"
                :key="item.interest_ID"
                >
                <input
                    type="checkbox"
                    class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800"
                    :value="item.interest_ID"
                    v-model="selectedInterestd"
                />
                {{ item.interest_Name }}
                </label>
            </div>
                <div>
                    <h2 class="font-bold mb-2">หมวดวิชาศึกษาทั่วไปที่นิสิตจะลงเรียน</h2>
                    
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend text-lg">หมวดวิชา (กลุ่มวิชา)</legend>
                        <select class="select select-error w-full" v-model="selectedGroupType">
                            <option disabled value="">-- เลือกกลุ่มวิชา --</option>
                            <option v-for="group in subjectGroups" :key="group.GroupType_ID" :value="group.GroupType_ID">
                            {{ group.GroupType_Name }}
                            </option>
                        </select>
                        </fieldset>

                        <fieldset class="fieldset mt-4">
                        <legend class="fieldset-legend text-lg">รายวิชา</legend>
                        <select class="select select-error w-full" v-model="selectedSubject">
                            <option disabled value="">-- เลือกรายวิชา --</option>
                            <option v-for="subject in subjects" :key="subject.subject_ID" :value="subject.subject_ID">
                            {{ subject.subject_Name }}
                            </option>
                        </select>
                        </fieldset>



                    <label class="block mt-4">
                        <span class="font-semibold">เกรดที่คาดหวัง</span>
                        <select v-model="selectedGrade" class="select select-error w-full mt-3">
                            <option disabled value="">กรุณาระบุ</option>
                            <option v-for="grades in grades" :key="grades.grade_ID" :value ="grades.grade_ID">
                                {{grades.grade_Name}}
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
                        <div class="pl-5 space-y-2">
                          <label
                                class="block"
                                v-for="item in groupwork"
                                :key="item.groupwork_ID"
                            >
                                <input
                                type="radio"
                                class="radio radio-sm radio-error bg-white/50"
                                name="groupwork"
                                :value="item.groupwork_ID"
                                v-model="selectedGroupwork"
                                >
                                {{ item.groupwork_Name }}
                            </label>
                            </div>
                        </fieldset>
                        </div>
                        
            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>2. งานเดี่ยว</legend>
                    <div class="pl-5">
                        <label 
                        class="block"
                        v-for="item in soloWork"
                        :key="item.solowork_ID"
                        >
                        <input
                            type="radio"
                            class="radio radio-sm radio-error bg-white/50"
                            name="solowork"
                            :value="item.solowork_ID"
                            v-model="selectedsolowork"
                        >
                        {{ item.solowork_Name }}
                        </label>

                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>3. การสอบ</legend>
                    <div class="pl-5">
                        <label 
                            class="block"
                            v-for="item in exam"
                            :key="item.exam_ID"
                            >
                            <input
                            type="radio"
                            class="radio radio-sm radio-error bg-white/50"
                            name="exam"
                            :value="item.exam_ID"
                            v-model="selectedexam"
                            >
                            {{ item.exam_Name}}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>4. การเข้าเรียน</legend>
                    <div class="pl-5">
                        <label 
                            class="block"
                            v-for="item in attendance"
                            :key="item.attendance_ID"
                    >
                        <input
                        type="radio"
                        class="radio radio-sm radio-error bg-white/50"
                        name="attendance"
                        :value="item.attendance_ID"
                        v-model="selectedattendance"
                        >
                            {{ item.attendance_Name}}
                            
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>5. รูปแบบการสอน</legend>
                    <div class="pl-5">
                        <label
                         class="block"
                         v-for="item in instruction"
                         :key="item.instruction_ID"
                        >
                        <input
                        type="radio"
                        class="radio radio-sm radio-error bg-white/50"
                        name="instruction"
                        :value="item.instruction_Id"
                        v-model="selectedinstruction"
                        >
                            {{ item.instruction_Name}}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>6. การนำเสนอหน้าชั้นเรียน</legend>
                    <div class="pl-5">
                        <label 
                            class="block"
                            v-for="item in present"
                            :key="item.present_ID"
                            >
                            <input
                            type="radio"
                            class="radio radio-sm radio-error bg-white/50"
                            name="present"
                            :value="item.present_ID"
                            v-model="selectedpresent"
                            >
                                {{ item.present_Name}}
                           
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>7. นิสิตอยากได้ประสบการณ์ใหม่ๆในการเรียนมากน้อยแค่ไหน</legend>
                    <div class="pl-5">
                        <label
                             class="block"
                             v-for="item in experience"
                             :key="item.experience_ID"
                             >
                             <input
                             type="radio"
                             class="radio radio-sm radio-error bg-white/50"
                             name="experience"
                             :value="item.experience_ID"
                             v-model="selectedexperience"
                             >
                                {{ item.experience_Name}}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>8. ความท้าทาย</legend>
                    <div class="pl-5">
                        <label 
                            class="block"
                            v-for="item in challenge"
                            :key="item. challenge_ID"
                        >
                        <input
                        type="radio"
                        class="radio radio-sm radio-error bg-white/50"
                        name=" challenge"
                        :value="item.challenge_ID"
                        v-model="selectedchallenge"
                        >
                            {{ item.challenge_Name}}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>9. ช่วงเวลาที่เรียน</legend>
                    <div class="pl-5">
                        <label 
                            class="block"
                            v-for="item in time"
                            :key="item.time_ID"
                        >
                        <input
                        type="radio"
                        class=""
                        name="time"
                        :value="item.time_ID"
                        v-model="selectedtime"
                        >
                            {{ item.time_Name}}
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend text-lg">ความรู้สึกที่มีต่อรายวิชานี้</legend>
                    <textarea class="textarea textarea-warning h-24 w-full" placeholder="กรุณากรอกความรู้สึก"></textarea>
                </fieldset>
            </div>

            <!-- ปุ่ม submit -->
            <div class="text-center">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </Layout>
</template>