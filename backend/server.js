const connection = require("./db");
const cors = require("cors");
const path = require("path");
const express = require("express");

require('dotenv').config();



const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📥 Request: ${req.method} ${req.url}`);
  next();
});




app.get("/testtt", (req, res) => {
  connection.query("SELECT *FROM testtt", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ✅ API ดึงคณะ
app.get("/faculty", (req, res) => {
  connection.query("SELECT faculty_ID, faculty_Name FROM Faculty", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ✅ API ดึงเกรดทั้งหมด
app.get("/grades", (req, res) => {
  connection.query("SELECT grade_ID, grade_Name FROM Grade_map", (err, results) => {
    if (err) return res.status(500).send("ดึงเกรดล้มเหลว");
    res.json(results);
  });
});

// ✅ API วิชา
// ดึงเฉพาะกลุ่มวิชา (distinct group_type)
app.get("/subject-groups", (req, res) => {
  const sql = "SELECT GroupType_ID, GroupType_Name FROM Group_Type";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ SQL ERROR:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results);
  });
});


// ดึงรายวิชาจากกลุ่มวิชาที่เลือก
app.get("/subjects/:groupId", (req, res) => {
  const groupId = req.params.groupId;
  console.log("GroupType_ID ที่รับมา:", groupId);

  const sql = "SELECT subject_ID, subject_Name FROM Subject WHERE group_type_ID = ?";
  connection.query(sql, [groupId], (err, results) => {
    if (err) {
      console.error("❌ SQL ERROR:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results);
  });
});


// ✅ API ดึงข้อมูลความสนใจ
app.get("/interestd", (req, res) => {
  console.log("📡 ถูกเรียก /interestd");
  const sql = "SELECT interest_ID, interest_Name FROM Interestd";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ ดึงข้อมูลความสนใจล้มเหลว:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results); // ส่งข้อมูลกลับเป็น JSON
  });
});

// ✅ API ดึงข้อมูลงานกลุ่ม
app.get("/groupwork", (req, res) => {
  const sql = "SELECT groupwork_ID, groupwork_Name FROM GroupWork_map";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ ดึง groupwork ผิดพลาด:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results);
  });
});

// ✅ API ดึงข้อมูลงานเดี่ยว
app.get("/solowork", (req, res) => {
  const sql = "SELECT solowork_ID, solowork_Name FROM SoloWork_map";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ ดึง solowork ผิดพลาด:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results);
  });
});

// ✅ API ดึงข้อมูลสอบ
app.get("/exam", (req, res) => {
  const sql = "SELECT exam_ID, exam_Name FROM Exam_map";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ ดึง exam ผิดพลาด:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results);
  });
});

// ✅ API ดึงข้อมูลเข้าห้องเรียน
app.get("/attendance", (req, res) => {
  const sql = "SELECT attendance_ID, attendance_Name FROM Attendance_map";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ ดึง attendance ผิดพลาด:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results);
  });
});

// ✅ API ดึงข้อมูลการสอน
app.get("/instruction", (req, res) => {
  const sql = "SELECT instruction_ID, instruction_Name FROM Instruction_map";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ ดึง instruction ผิดพลาด:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results);
  });
});

// ✅ API ดึงข้อมูลนำเสนอ
app.get("/present", (req, res) => {
  const sql = "SELECT present_ID, present_Name FROM Present_map";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ ดึง present ผิดพลาด:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results);
  });
});

// ✅ API ดึงข้อมูลประสบการณ์ใหม่ๆ
app.get("/experience", (req, res) => {
  const sql = "SELECT experience_ID, experience_Name FROM Experience_map";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ ดึง experience ผิดพลาด:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results);
  });
});

// ✅ API ดึงข้อมูลความท้าทาย
app.get("/challenge", (req, res) => {
  const sql = "SELECT challenge_ID, challenge_Name FROM Challenge_map";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ ดึง challenge ผิดพลาด:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results);
  });
});

// ✅ API ดึงข้อมูลเวลา
app.get("/time", (req, res) => {
  const sql = "SELECT time_ID, time_Name FROM Time_map";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ ดึง time ผิดพลาด:", err);
      return res.status(500).send("Database Error");
    }
    res.json(results);
  });
});

app.post("/submit-form", (req, res) => {
  console.log("📦 ฟอร์มที่รับมา:", req.body);
  const {
    student_id,
    subjectGroup,
    student_level,
    faculty,
    interestd,
    subject,
    groupwork,
    solowork,
    exam,
    attendance,
    instruction,
    present,
    experience,
    challenge,
    time,
    grade,
    review
  } = req.body;

  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

  const interestds = Array.isArray(interestd) ? interestd.join(",") : interestd;

  console.log("❤️ interestd =", interestd);
  console.log("💡 interestds =", interestds);

  const insertFormGe = `
    INSERT INTO Form_ge (student_ID, faculty_ID, student_level, interestd, timestamp)
    VALUES (?, ?, ?, ?, ?)

  `;

  connection.query(insertFormGe, [student_id, faculty, student_level, interestds, timestamp], (err, result) => {
    if (err) {
      console.error("Insert Form_ge error:", err);
      return res.status(500).send("Insert Form_ge failed");
    }

    const formGeId = result.insertId;

    const insertReview = `
      INSERT INTO Form_review (
        fg_ID,
        group_type,
        subject_ID,
        groupwork_ID,
        solowork_ID,
        exam_ID,
        attendance_ID,
        instruction_ID,
        present_ID,
        experience_ID,
        challenge_ID,
        time_ID,
        grade_ID,
        review
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(insertReview, [
      formGeId,
      subjectGroup,
      subject,
      groupwork,
      solowork,
      exam,
      attendance,
      instruction,
      present,
      experience,
      challenge,
      time,
      grade,
      review
    ], (err2) => {
      if (err2) {
        console.error("Insert Form_review error:", err2);
        return res.status(500).send("Insert Form_review failed");
      }

      res.send("✅ ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
    });
  });
});


// ✅ API ล็อกอิน
const bcrypt = require('bcryptjs');

function isNuEmail(v) {
  return typeof v === 'string' && v.toLowerCase().endsWith('@nu.ac.th');
}

app.post('/login', (req, res) => {
  // เปลี่ยนชื่อฟิลด์ให้สื่อชัด: email + password
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: 'กรอก Email และ Password' });
  }
  if (!isNuEmail(email)) {
    return res.status(400).json({ ok: false, message: 'ต้องใช้อีเมล @nu.ac.th เท่านั้น' });
  }

  // 👉 ใช้ email เป็นตัวล็อกอิน / JOIN ด้วย email
  const sql = `
    SELECT
      u.email,
      u.password,
      s.student_Name,
      s.student_level,
      s.faculty_ID,  
      f.faculty_Name,    
      s.student_ID
    FROM Users u
    LEFT JOIN Student s ON s.email = u.email   -- ✅ จับคู่ด้วย email
    LEFT JOIN Faculty f ON f.faculty_ID = s.faculty_ID
    WHERE u.email = ?
    LIMIT 1
  `;

  connection.query(sql, [email.toLowerCase()], async (err, rows) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ ok: false, message: 'Database Error' });
    }
    if (!rows.length) {
      return res.status(401).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const row = rows[0];
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) {
      return res.status(401).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ✅ สำเร็จ: ส่งโปรไฟล์กลับ
    return res.json({
      ok: true,
      user: {
        id: row.email,                               // ใช้ email เป็น id ของ session ฝั่ง client
        student_ID: row.student_ID || '',            // เผื่อหน้าอื่นต้องใช้
        name: row.student_Name || '',
        student_level: row.student_level || '',
        faculty_ID: row.faculty_ID || '',
        faculty_Name: row.faculty_Name || ''
      }
    });
  });
});




// ===== สมัครบัญชี =====
app.post('/register', (req, res) => {
  // รับค่าจาก body: ใช้ชื่อ student_ID / student_Name เป็นหลัก
  // (เผื่อฟรอนต์เก่าส่ง student_id/full_name มาจะ fallback ให้)
  const student_ID = req.body.student_ID ?? req.body.student_id;
  const student_Name = req.body.student_Name ?? req.body.full_name;
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password;
  const student_level = req.body.student_level;
  const faculty = req.body.faculty;

  // ตรวจความครบถ้วน
  if (!student_ID || !student_Name || !email || !password || !student_level || !faculty) {
    return res.status(400).json({ ok: false, message: 'กรอกข้อมูลให้ครบ' });
  }
  // ตรวจโดเมนอีเมล @nu.ac.th
  function isNuEmail(v) {
    return typeof v === 'string' && v.endsWith('@nu.ac.th');
  }
  if (!isNuEmail(email)) {
    return res.status(400).json({ ok: false, message: 'ต้องใช้อีเมล @nu.ac.th เท่านั้น' });
  }

  // เช็คซ้ำว่ามีอยู่แล้วหรือไม่
  const checkSql = `
    SELECT
      (SELECT COUNT(*) FROM Student WHERE student_ID = ?) AS sCount,
      (SELECT COUNT(*) FROM Users   WHERE email      = ?) AS uCount
  `;
  connection.query(checkSql, [student_ID, email], async (err, rows) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ ok: false, message: 'Database Error' });
    }
    const { sCount = 0, uCount = 0 } = rows?.[0] || {};
    if (sCount > 0 || uCount > 0) {
      return res.status(409).json({ ok: false, message: 'มีบัญชีนี้อยู่แล้ว' });
    }

    // เริ่มทรานแซกชัน
    connection.beginTransaction(async (trErr) => {
      if (trErr) {
        console.error('beginTransaction error:', trErr);
        return res.status(500).json({ ok: false, message: 'Transaction start failed' });
      }

      try {
        // 1) แทรก Users ก่อน (ถ้า Student.email เป็น FK → Users.email)
        const hash = await bcrypt.hash(password, 10);
        const insertUser = `INSERT INTO Users (email, password) VALUES (?, ?)`;
        connection.query(insertUser, [email, hash], (iUErr) => {
          if (iUErr) {
            // ซ้ำอีเมล
            if (iUErr.code === 'ER_DUP_ENTRY') {
              return connection.rollback(() => {
                res.status(409).json({ ok: false, message: 'อีเมลนี้ถูกใช้แล้ว' });
              });
            }
            console.error('Insert Users error:', iUErr);
            return connection.rollback(() => {
              res.status(500).json({ ok: false, message: 'Insert Users failed' });
            });
          }

          // 2) แทรก Student (ใช้คอลัมน์ตาม DB: student_ID, student_Name, ...)
          const insertStudent = `
            INSERT INTO Student (student_ID, student_Name, student_level, faculty_ID, email)
            VALUES (?, ?, ?, ?, ?)
          `;
          connection.query(
            insertStudent,
            [student_ID, student_Name, student_level, faculty, email],
            (iSErr) => {
              if (iSErr) {
                // ถ้า FK ล้มเหลวเพราะ Users ยังไม่พร้อม (ไม่น่าเกิดเพราะเรา insert Users ก่อนแล้ว)
                console.error('Insert Student error:', iSErr);
                return connection.rollback(() => {
                  res.status(500).json({ ok: false, message: 'Insert Student failed' });
                });
              }

              connection.commit((cErr) => {
                if (cErr) {
                  console.error('Commit error:', cErr);
                  return connection.rollback(() => {
                    res.status(500).json({ ok: false, message: 'Commit failed' });
                  });
                }
                res.json({ ok: true, message: 'สมัครบัญชีสำเร็จ' });
              });
            }
          );
        });
      } catch (e) {
        console.error('Register catch error:', e);
        return connection.rollback(() => {
          res.status(500).json({ ok: false, message: 'Register failed' });
        });
      }
    });
  });
});






/* ---------- Case-based Reasoning ---------- */
app.post('/cbr-match', (req, res) => {
  const {
    interestd = [],                         // เช่น [1,3,6] (จากฟอร์ม)
    groupwork, solowork, exam, attendance, instruction,
    present, experience, challenge, time,
    group_types = [],
    grade: userGrade,                    // กรองหมวดวิชา (อาจเป็นรหัสหรือเลขให้ตรง fr.group_type)
    weights = {}
  } = req.body;

  const wantDebug = Boolean(req.body.debug) || process.env.DEBUG_CBR === '1'


  // --- SQL (JOIN ชื่อกลุ่ม) ---
  let sql = `
    SELECT
      fr.subject_ID,
      s.subject_Name,
      fr.group_type,
      gt.GroupType_Name,
      fr.groupwork_ID, fr.solowork_ID, fr.exam_ID, fr.attendance_ID,
      fr.instruction_ID, fr.present_ID, fr.experience_ID, fr.challenge_ID,
      fr.time_ID, fr.grade_ID, gm.grade_Name AS grade_Name, fr.review,
      fg.interestd
    FROM Form_review AS fr
    JOIN Form_ge  AS fg ON fg.id = fr.fg_ID
    LEFT JOIN Subject    AS s  ON s.subject_ID = fr.subject_ID
    LEFT JOIN Group_Type AS gt ON gt.GroupType_ID = fr.group_type
    LEFT JOIN Grade_map  AS gm ON gm.grade_ID  = fr.grade_ID  
  `;
  const params = [];

  if (Array.isArray(group_types) && group_types.length) {
    const placeholders = group_types.map(() => '?').join(',');
    sql += ` WHERE fr.group_type IN (${placeholders})`;
    params.push(...group_types);
  }

  connection.query(sql, params, (err, rows) => {
    if (err) {
      console.error('CBR SQL error:', err);
      return res.status(500).json({ ok: false, message: 'Database Error' });
    }

    try {
      // ---------- น้ำหนัก ----------
      const baseW = {
        interestd: 20,
        exam: 15,
        instruction: 12,
        groupwork: 10,
        solowork: 10,
        experience: 8,
        challenge: 6,
        time: 4,
        attendance: 2,
        present: 1,
      };
      // ถ้าหน้าเว็บส่ง weights มา จะ merge ทับค่า default
      const W = { ...baseW, ...(weights || {}) };
      const merged = { ...baseW, ...weights };



      // แปลง interest เป็น token ตัวเลขเสมอ: ['A1','F3',6] -> ['1','3','6']
      function normalizeInterestTokens(value) {
        if (value == null) return [];
        const tokens = Array.isArray(value) ? value : String(value).split(',');
        const out = tokens
          .map(t => String(t).trim())
          .filter(Boolean)
          .map(t => {
            const m = t.match(/\d+/);
            if (!m) return null;
            const n = parseInt(m[0], 10);       // <<— บังคับเป็นตัวเลข
            return Number.isFinite(n) ? String(n) : null;
          })
          .filter(Boolean);
        return [...new Set(out)]; // ตัดซ้ำ
      }


      // Dice ระหว่าง token (ข้ามมิตินี้ถ้า user หรือ case ว่าง)
      function diceTokens(A, B) {
        if (!Array.isArray(A) || !Array.isArray(B) || A.length === 0 || B.length === 0) return null;
        const a = new Set(A), b = new Set(B);
        const inter = [...a].filter(x => b.has(x)).length;
        return (2 * inter) / (a.size + b.size);
      }

      function parseCodeLevel(v) {
        if (v == null) return { prefix: null, level: null };
        const s = String(v).trim();
        // ถ้ากรอกมาเป็นเลขล้วน
        if (/^\d+(\.\d+)?$/.test(s)) return { prefix: null, level: Number(s) };
        const m = s.match(/^([A-Za-z]+)?\s*(\d+(?:\.\d+)?)$/);
        if (!m) return { prefix: null, level: null };
        return { prefix: (m[1] || '').toUpperCase(), level: Number(m[2]) };
      }

      function simCodeOrdinal(userVal, caseVal, { expectedPrefix = null, min = 1, max = 4, onPrefixMismatch = 'zero' } = {}) {
        const u = parseCodeLevel(userVal);
        const c = parseCodeLevel(caseVal);
        if (expectedPrefix) {
          const badU = u.prefix && u.prefix !== expectedPrefix;
          const badC = c.prefix && c.prefix !== expectedPrefix;
          if (badU || badC) return onPrefixMismatch === 'skip' ? null : 0;
        }
        if (!Number.isFinite(u.level) || !Number.isFinite(c.level)) return null; // ข้ามมิติถ้าข้อมูลไม่ครบ

        const range = Number(max) - Number(min);
        if (range <= 0) return u.level === c.level ? 1 : 0;

        const diff = Math.abs(u.level - c.level) / range;
        const sim = 1 - diff;
        return Math.max(0, Math.min(1, sim));
      }

      // inverse-abs สำหรับสเกลลำดับ
      const simInverseAbs = (a, b) => {
        const an = Number(a), bn = Number(b);
        if (!Number.isFinite(an) || !Number.isFinite(bn)) return null;
        return 1 / (1 + Math.abs(an - bn));
      };

      function ensurePrefix(val, prefix) {
        if (val == null) return null;
        const s = String(val).trim();
        if (/^\d+$/.test(s)) return prefix + s;   // "0" -> "C0"
        return s;
      }

      const GRADE_SCORE = { 'A': 7, 'B+': 6, 'B': 5, 'C+': 4, 'C': 3, 'D+': 2, 'D': 1, 'F': 0 };

      function gradeScoreFromItem(it) {
        const raw = String(it.grade_Name ?? it.grade_ID ?? '').toUpperCase().trim();
        // พยายามดึง token เกรดจากชื่อหรือรหัส เช่น "B1" -> "B", "C+" -> "C+"
        const m = raw.match(/A|B\+|B|C\+|C|D\+|D|F/);
        const key = m ? m[0] : null;
        return key in GRADE_SCORE ? GRADE_SCORE[key] : -1; // -1 = ไม่รู้เกรด
      }

      function bySimThenGrade(a, b) {
        const sa = Number(a.similarity) || 0;
        const sb = Number(b.similarity) || 0;
        if (sb !== sa) return sb - sa;              // 1) เปอร์เซ็นต์มาก่อน
        const ga = gradeScoreFromItem(a);
        const gb = gradeScoreFromItem(b);
        if (gb !== ga) return gb - ga;              // 2) เกรดสูงกว่า ชนะ
        // 3) กันกระพือด้วยการเรียงตาม id
        return String(a.subject_ID).localeCompare(String(b.subject_ID));
      }

      function dedupeBySubjectKeepBest(arr) {
        // เรียงให้เคสดีสุดมาก่อน แล้วเก็บตัวแรกของแต่ละ subject_ID
        const sorted = arr.slice().sort(bySimThenGrade);
        const seen = new Set();
        const out = [];
        for (const it of sorted) {
          const key = String(it.subject_ID);
          if (seen.has(key)) continue;
          seen.add(key);
          out.push(it);
        }
        return out;
      }


      // ---------- คำนวณแต่ละเคส ----------
      const results = rows.map((r) => {
        const userInterestTokens = normalizeInterestTokens(interestd);
        const caseInterestTokens = normalizeInterestTokens(r.interestd);



        // ถ้าคุณใช้รหัส B/C/D ให้เห็น level ที่แยกได้


        const uExam = parseCodeLevel(exam);
        const cExam = parseCodeLevel(r.exam_ID);
        const uInstr = parseCodeLevel(instruction);
        const cInstr = parseCodeLevel(r.instruction_ID);

        const sims = {
          interestd: diceTokens(userInterestTokens, caseInterestTokens), // อาจเป็น null ถ้าฝั่งใดว่าง
          groupwork: simInverseAbs(groupwork, r.groupwork_ID),
          solowork: simInverseAbs(solowork, r.solowork_ID),
          exam: simCodeOrdinal(ensurePrefix(exam, 'C'), r.exam_ID, { expectedPrefix: 'C', min: 0, max: 7 }),
          attendance: simInverseAbs(attendance, r.attendance_ID),
          instruction: simCodeOrdinal(instruction, r.instruction_ID, { expectedPrefix: 'D', min: 1, max: 3 }),
          present: simInverseAbs(present, r.present_ID),
          experience: simInverseAbs(experience, r.experience_ID),
          challenge: simInverseAbs(challenge, r.challenge_ID),
          time: simInverseAbs(time, r.time_ID), // 1..2 ก็ได้ 1/(1+|a-b|)
        };

        // รวมถ่วงน้ำหนัก: นับเฉพาะมิติที่มี sim จริง (ไม่ใช่ null)
        let score = 0, wsum = 0;
        const contribs = {};      // เก็บ w, s, w*s ต่อมิติ (เพื่อ debug/UI)
        const weightsUsed = {};   // เก็บน้ำหนักเฉพาะมิติที่ใช้งานจริง
        for (const k of Object.keys(sims)) {
          const s = sims[k];
          if (s == null || !Number.isFinite(s)) continue;
          const w = Number(W[k]) || 0;
          if (w <= 0) continue;
          score += w * s;
          wsum += w;
          contribs[k] = { w, s, ws: w * s };
          weightsUsed[k] = w;
        }

        const norm = wsum ? (score / wsum) : 0;         // 0..1
        const normClamped = Math.min(1, Math.max(0, norm));
        const similarityPct = Math.round(normClamped * 10000) / 100; // ไม่มี boost เพื่อความเรียบง่าย/สอดคล้อง CBR.py


        // --- แพ็ก debug object (แนบเฉพาะเมื่อเปิด debug) ---
        const dbg = wantDebug ? {
          user_input: {
            interestd_raw: interestd,
            interestd_tokens: userInterestTokens,
            groupwork, solowork, exam, instruction, attendance,
            present, experience, challenge, time,
            // แสดงการ parse โค้ด:
            parsed: { exam: uExam, instruction: uInstr }
          },
          case_values: {
            subject_ID: r.subject_ID,
            group_type: r.group_type,
            interestd_raw: r.interestd,
            interestd_tokens: caseInterestTokens,
            groupwork_ID: r.groupwork_ID,
            solowork_ID: r.solowork_ID,
            exam_ID: r.exam_ID,
            instruction_ID: r.instruction_ID,
            attendance_ID: r.attendance_ID,
            present_ID: r.present_ID,
            experience_ID: r.experience_ID,
            challenge_ID: r.challenge_ID,
            time_ID: r.time_ID,
            parsed: { exam: cExam, instruction: cInstr }
          },
          sims,                 // 0..1 หรือ null
          weights_used: weightsUsed,
          contributions: Object.fromEntries(
            Object.entries(contribs).map(([k, v]) => [
              k,
              {
                w: +v.w.toFixed(6),
                s: +v.s.toFixed(6),
                ws: +v.ws.toFixed(6),
                // สัดส่วนต่อคะแนนรวม (คิดเฉพาะมิติที่ active)
                ws_pct: wsum ? +((v.ws / wsum) * 100).toFixed(3) : 0
              }
            ])
          ),
          sums: {
            score: +score.toFixed(6),
            wsum: +wsum.toFixed(6),
            norm: +norm.toFixed(6),
            similarityPct
          }
        } : undefined;

        // (ทางเลือก) log ออกคอนโซลเมื่อ DEBUG_CBR=1
        if (wantDebug) {
          const active = Object.keys(contribs).map(k => ({
            k, w: contribs[k].w, s: contribs[k].s, ws: +contribs[k].ws.toFixed(6)
          }));
          console.log('—— CBR DEBUG —— subject', r.subject_ID);
          console.log('W used =', weightsUsed);
          console.log('active dims =', active);
          console.log('sumW =', +wsum.toFixed(6), 'score =', +score.toFixed(6), 'norm =', +norm.toFixed(6));
        }


        return {
          subject_ID: r.subject_ID,
          subject_Name: r.subject_Name,
          review: r.review,
          group_type: r.group_type,
          group_type_name: r.GroupType_Name || String(r.group_type),
          similarity: similarityPct,
          sims,
          grade_ID: r.grade_ID ?? null,
          grade_Name: r.grade_Name ?? null,
          ...(wantDebug ? { dbg } : {})   // <<— ส่งชุดดีบักกลับไป
        };
      });

      // เรียงคะแนน
      results.sort((a, b) => b.similarity - a.similarity);

      // ตอบแบบ “แยกกลุ่ม” (Top 3/กลุ่ม) ถ้าผู้ใช้เลือก group_types
      const wantGroups = Array.isArray(group_types) && group_types.length > 0;
      if (wantGroups) {
        const groupsMap = {};
        for (const item of results) {
          const key = String(item.group_type);
          (groupsMap[key] ||= { group_type: key, group_type_name: item.group_type_name || key, items: [] }).items.push(item);
        }

        const groups = Object.values(groupsMap).map(g => {
          const unique = dedupeBySubjectKeepBest(g.items);
          g.items = unique.slice(0, 3);
          return g;
        });

        return res.json({ ok: true, groups });
      }
      // ไม่ได้ส่ง group_types → ส่งแบบรวม
      return res.json({ ok: true, top: results.slice(0, 3), all: results });

    } catch (e) {
      console.error('CBR compute error:', e);
      return res.status(500).json({ ok: false, message: 'CBR compute error' });
    }
  });

  // ---- utils ----
  function normalizeWeights(w) {
    const sum = Object.values(w).reduce((a, b) => a + b, 0) || 1;
    const out = {};
    for (const k in w) out[k] = w[k] / sum;
    return out;
  }
});



//รวมวิชาทั้งหมด ไว้ในกลุ่ม
app.get('/grouped-subjects', (req, res) => {
  const sql = `
    SELECT
      g.GroupType_ID,
      g.GroupType_Name,
      s.subject_ID,
      s.subject_Name
    FROM Group_Type g
    LEFT JOIN Subject s ON s.Group_Type_ID = g.GroupType_ID
    ORDER BY g.GroupType_ID, s.subject_Name
  `

  connection.query(sql, (err, rows) => {
    if (err) return res.status(500).send("Database Error")

    const grouped = []

    rows.forEach(row => {
      let group = grouped.find(g => g.group_ID === row.GroupType_ID)

      if (!group) {
        group = {
          group_ID: row.GroupType_ID,
          group_Name: row.GroupType_Name,
          subjects: []
        }
        grouped.push(group)
      }

      if (row.subject_ID) {
        group.subjects.push({
          subject_ID: row.subject_ID,
          subject_Name: row.subject_Name
        })
      }
    })

    res.json(grouped)
  })
})

// ✅ ดึง "รีวิวทั้งหมด" ของวิชานั้น
app.get('/subjects/:id/reviews', (req, res) => {
  const subjectId = String(req.params.id || '').trim()
  if (!subjectId) {
    return res.status(400).json({ message: 'subject id is required' })
  }

  const sql = `
    SELECT
      fr_ID      AS id,
      subject_ID AS subjectId,
      review     AS text
    FROM Form_review
    WHERE subject_ID = ?
    ORDER BY fr_ID DESC
  `
  connection.query(sql, [subjectId], (err, rows) => {
    if (err) {
      console.error('❌ fetch reviews failed:', err)
      return res.status(500).json({ message: 'Failed to fetch reviews' })
    }
    res.json({
      subjectId,
      count: rows.length,
      reviews: rows, // [{ id, subjectId, text }]
    })
  })
})





// ✅ เริ่ม server
const port = 3000;
app.listen(port, () => {
  console.log(`✅ Server started at http://localhost:${port}`);
});
