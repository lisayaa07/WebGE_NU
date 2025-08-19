<script setup>
import Layout from '@/layout/Layout.vue';
</script>

<template>
    <Layout>
        <form class="p-6 space-y-6">
            <!-- ความสนใจ -->
            <div class="bg-[#F992AF]/50 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h2 class="font-bold mb-2">ความสนใจ</h2>
                    <label class="block"><input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        สุขภาพและชีวิตประจำวัน</label>
                    <label class="block"><input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        ทักษะชีวิต คณิตศาสตร์ และการเงิน</label>
                    <label class="block"><input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        พัฒนาตัวเองและจิตวิทยา</label>
                    <label class="block"><input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        สังคม วัฒนธรรม และศาสนา</label>
                    <label class="block"><input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        ศิลปะและภาษา</label>
                    <label class="block"><input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        วิทยาศาสตร์ เทคโนโลยี และดิจิทัล</label>
                    <label class="block"><input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        กฎหมายและพลเมือง</label>
                </div>

                <div>
                    <h2 class="font-bold mb-2">หมวดวิชาศึกษาทั่วไปที่นิสิตจะลงเรียน</h2>
                    <label class="block"><input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        กลุ่มวิชามนุษยศาสตร์</label>
                    <label class="block"><input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        กลุ่มวิชาสังคมศาสตร์</label>
                    <label class="block"><input type="checkbox"
                            class="checkbox checkbox-sm border-pink-400 bg-pink-300 checked:border-pink-700 checked:bg-pink-600 checked:text-orange-800" />
                        กลุ่มวิชาวิทยาศาสตร์และคณิตศาสตร์</label>

                    <label class="block mt-4">
                        <span class="font-semibold">เกรดที่คาดหวัง</span>
                        <select v-model="grade" class="select select-error w-full mt-3">
                            <option disabled value="">กรุณาระบุ</option>
                            <option>A</option>
                            <option>B+</option>
                            <option>B</option>
                            <option>C+</option>
                            <option>C</option>
                            <option>D+</option>
                            <option>D</option>
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
                        <label class="block">
                            <input type="radio" name="teamWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ไม่มี
                        </label>
                        <label class="block">
                            <input type="radio" name="teamWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            น้อย
                        </label>
                        <label class="block">
                            <input type="radio" name="teamWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ปานกลาง
                        </label>
                        <label class="block">
                            <input type="radio" name="teamWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            มาก
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>2. งานเดี่ยว</legend>
                    <div class="pl-5">
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ไม่มี
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            น้อย
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ปานกลาง
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            มาก
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>3. การสอบ</legend>
                    <div class="pl-5">
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ไม่มีสอบ
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            สอบย่อย
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            สอบย่อย + midterm + final
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            midterm + final
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            midterm
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            final
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            สอบย่อย+midterm
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            สอบย่อย+final
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>4. การเข้าเรียน</legend>
                    <div class="pl-5">
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ไม่มีเช็คชื่อ
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            มีเช็คชื่อบางครั้ง
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            มีเช็คชื่อทุกครั้ง
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>5. รูปแบบการสอน</legend>
                    <div class="pl-5">
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ไม่ค่อยสอน
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            เน้นให้นิสิตทำความเข้าใจเอง
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            เน้นสอนให้นิสิตเข้าใจ
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>6. การนำเสนอหน้าชั้นเรียน</legend>
                    <div class="pl-5">
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ไม่มี
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            มีน้อย
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            มีปานกลาง
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            มีมาก
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FFAE00]/35 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>7. นิสิตอยากได้ประสบการณ์ใหม่ๆในการเรียนมากน้อยแค่ไหน</legend>
                    <div class="pl-5">
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ไม่
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            น้อย
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ปานกลาง
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            มาก
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#FBCAA8]/95 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>8. ความท้าทาย</legend>
                    <div class="pl-5">
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ง่าย
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ปานกลาง
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ยาก
                        </label>
                    </div>
                </fieldset>
            </div>

            <div class="bg-[#F992AF]/50 p-6 rounded-3xl">
                <fieldset class="pl-5">
                    <legend>9. ช่วงเวลาที่เรียน</legend>
                    <div class="pl-5">
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ช่วงเช้า
                        </label>
                        <label class="block">
                            <input type="radio" name="soloWork"
                                class="radio radio-sm radio-error bg-white/50" />
                            ช่วงบ่าย
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