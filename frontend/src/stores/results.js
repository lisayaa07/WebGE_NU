import { defineStore } from 'pinia'

export const useResultsStore = defineStore('results', {
  state: () => ({
    resultGroups: [],   // กลุ่มผลลัพธ์จาก backend (ใช้แสดงรายการ)
    results: [],        // รายการ top/all ที่ map similarity แล้ว (ถ้าต้องใช้ที่อื่น)
    payload: null,      // เก็บ payload ที่ส่งไป (เผื่อ debug/ย้อนกลับ)
    errorMsg: '',
    reviewsBySubject: {},       // เผื่ออยากไปโชว์ error ที่หน้าผลลัพธ์
  }),
  actions: {
    setResults({ resultGroups = [], results = [], payload = null, errorMsg = '' }) {
      this.resultGroups = resultGroups
      this.results = results
      this.payload = payload
      this.errorMsg = errorMsg
      this.indexReviewsFromGroups()
    },
    indexReviewsFromGroups() {
      const map = {}
      for (const g of this.resultGroups || []) {
        for (const c of g.items || []) {
          const arr = Array.isArray(c.reviews)
            ? c.reviews
            : (c.review ? [c.review] : [])
          map[c.subject_ID] = arr
        }
      }
      this.reviewsBySubject = map
    },
    clear() {
      this.resultGroups = []
      this.results = []
      this.payload = null
      this.errorMsg = ''
    }
  }
})
