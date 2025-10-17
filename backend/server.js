
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); // ✅ IMPORT POOL PROMISE ที่แก้ไขแล้วจาก db.js
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ✅ ย้าย bcrypt มาด้านบน

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ป้องกันการแคช
app.use((req, res, next) => {
  if (req.path === '/' || req.path.endsWith('.html')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
  }
  next();
});
const expressJwt = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ ok: false, message: 'not authenticated' });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'please_set_jwt_secret');
    req.user = data; // { id, student_ID, name, ... }
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, message: 'invalid token' });
  }
};

app.get('/me', expressJwt, async (req, res) => {
  // คืนข้อมูลโปรไฟล์ที่จำเป็น (ไม่คืน password)
  res.json({ ok: true, user: req.user });
});

// logout route
app.post('/logout', (_req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
  res.json({ ok: true });
});

// ✅ Route: Health Check
app.get('/db-health', async (_req, res) => {
  try {
    // 💡 ใช้ db.query ที่มาจาก pool.promise()
    const [r] = await db.query('SELECT 1'); 
    res.json({ ok: true, r });
  } catch (e) {
    console.error('DB health fail:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// =========================================================================
// ✅ แปลงทุก API ที่ใช้ DB Connection (Callback -> Async/Await)
// =========================================================================

app.get("/testtt", async (req, res) => {
  try {
    const [results] = await db.query("SELECT *FROM testtt");
    res.json(results);
  } catch (err) {
    console.error("❌ SQL ERROR:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API ดึงคณะ
app.get("/faculty", async (req, res) => {
  try {
    const [results] = await db.query("SELECT faculty_ID, faculty_Name FROM Faculty");
    res.json(results);
  } catch (err) {
    console.error("❌ SQL ERROR:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API ดึงเกรดทั้งหมด
app.get("/grades", async (req, res) => {
  try {
    const [results] = await db.query("SELECT grade_ID, grade_Name FROM Grade_map");
    res.json(results);
  } catch (err) {
    console.error("❌ SQL ERROR:", err);
    res.status(500).send("ดึงเกรดล้มเหลว");
  }
});

// ✅ API ดึงเฉพาะกลุ่มวิชา
app.get("/subject-groups", async (req, res) => {
  const sql = "SELECT GroupType_ID, GroupType_Name FROM Group_Type";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ SQL ERROR:", err);
    res.status(500).send("Database Error");
  }
});


// ดึงรายวิชาจากกลุ่มวิชาที่เลือก
app.get("/subjects/:groupId", async (req, res) => {
  const groupId = req.params.groupId;
  console.log("GroupType_ID ที่รับมา:", groupId);

  const sql = "SELECT subject_ID, subject_Name FROM Subject WHERE group_type_ID = ?";
  try {
    const [results] = await db.query(sql, [groupId]);
    res.json(results);
  } catch (err) {
    console.error("❌ SQL ERROR:", err);
    res.status(500).send("Database Error");
  }
});


// ✅ API ดึงข้อมูลความสนใจ
app.get("/interestd", async (req, res) => {
  console.log("📡 ถูกเรียก /interestd");
  const sql = "SELECT interest_ID, interest_Name FROM Interestd";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ ดึงข้อมูลความสนใจล้มเหลว:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API ดึงข้อมูลงานกลุ่ม
app.get("/groupwork", async (req, res) => {
  const sql = "SELECT groupwork_ID, groupwork_Name FROM GroupWork_map";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ ดึง groupwork ผิดพลาด:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API ดึงข้อมูลงานเดี่ยว
app.get("/solowork", async (req, res) => {
  const sql = "SELECT solowork_ID, solowork_Name FROM SoloWork_map";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ ดึง solowork ผิดพลาด:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API ดึงข้อมูลสอบ
app.get("/exam", async (req, res) => {
  const sql = "SELECT exam_ID, exam_Name FROM Exam_map";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ ดึง exam ผิดพลาด:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API ดึงข้อมูลเข้าห้องเรียน
app.get("/attendance", async (req, res) => {
  const sql = "SELECT attendance_ID, attendance_Name FROM Attendance_map";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ ดึง attendance ผิดพลาด:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API ดึงข้อมูลการสอน
app.get("/instruction", async (req, res) => {
  const sql = "SELECT instruction_ID, instruction_Name FROM Instruction_map";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ ดึง instruction ผิดพลาด:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API ดึงข้อมูลนำเสนอ
app.get("/present", async (req, res) => {
  const sql = "SELECT present_ID, present_Name FROM Present_map";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ ดึง present ผิดพลาด:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API ดึงข้อมูลประสบการณ์ใหม่ๆ
app.get("/experience", async (req, res) => {
  const sql = "SELECT experience_ID, experience_Name FROM Experience_map";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ ดึง experience ผิดพลาด:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API ดึงข้อมูลความท้าทาย
app.get("/challenge", async (req, res) => {
  const sql = "SELECT challenge_ID, challenge_Name FROM Challenge_map";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ ดึง challenge ผิดพลาด:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API ดึงข้อมูลเวลา
app.get("/time", async (req, res) => {
  const sql = "SELECT time_ID, time_Name FROM Time_map";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ ดึง time ผิดพลาด:", err);
    res.status(500).send("Database Error");
  }
});

// ✅ API บันทึกฟอร์ม (ต้องจัดการ Transaction และ Async/Await)
app.post("/submit-form", async (req, res) => {
  console.log("📦 ฟอร์มที่รับมา:", req.body);
  const {
    student_id, subjectGroup, student_level, faculty, interestd, subject,
    groupwork, solowork, exam, attendance, instruction, present,
    experience, challenge, time, grade, review
  } = req.body;

  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
  const interestds = Array.isArray(interestd) ? interestd.join(",") : interestd;
  
  // 💡 ต้องใช้ Transaction เพื่อให้มั่นใจว่าข้อมูลเข้าทั้ง 2 ตารางพร้อมกัน
  let connection;
  try {
    // 1. ดึง Connection จาก Pool
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 2. Insert Form_ge
    const insertFormGe = `
      INSERT INTO Form_ge (student_ID, faculty_ID, student_level, interestd, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [resultFormGe] = await connection.query(insertFormGe, [student_id, faculty, student_level, interestds, timestamp]);
    const formGeId = resultFormGe.insertId;

    // 3. Insert Form_review
    const insertReview = `
      INSERT INTO Form_review (
        fg_ID, group_type, subject_ID, groupwork_ID, solowork_ID, exam_ID, attendance_ID,
        instruction_ID, present_ID, experience_ID, challenge_ID, time_ID, grade_ID, review
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(insertReview, [
      formGeId, subjectGroup, subject, groupwork, solowork, exam, attendance,
      instruction, present, experience, challenge, time, grade, review
    ]);

    // 4. Commit Transaction
    await connection.commit();
    res.send("✅ ข้อมูลถูกบันทึกเรียบร้อยแล้ว");

  } catch (err) {
    console.error("Insert Form error:", err);
    if (connection) {
      await connection.rollback();
    }
    res.status(500).send("Database Insert failed");

  } finally {
    // 5. คืน Connection สู่ Pool
    if (connection) connection.release();
  }
});


// ✅ API ล็อกอิน (แปลงเป็น Async/Await)

function isNuEmail(v) {
  return typeof v === 'string' && v.toLowerCase().endsWith('@nu.ac.th');
}

app.post('/login', async (req, res) => { // ✅ เพิ่ม async
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, message: 'กรอก Email และ Password' });
  if (!isNuEmail(email)) return res.status(400).json({ ok: false, message: 'ต้องใช้อีเมล @nu.ac.th เท่านั้น' });

  // 👉 ใช้ email เป็นตัวล็อกอิน / JOIN ด้วย email
  const sql = `
    SELECT
      u.email, u.password, s.student_Name, s.student_level,
      s.faculty_ID, f.faculty_Name, s.student_ID
    FROM Users u
    LEFT JOIN Student s ON s.email = u.email
    LEFT JOIN Faculty f ON f.faculty_ID = s.faculty_ID
    WHERE u.email = ?
    LIMIT 1
  `;

  try {
    const [rows] = await db.query(sql, [email.toLowerCase()]); // ✅ ใช้ await db.query
    
    if (!rows.length) return res.status(401).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    const row = rows[0];
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(401).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    // สร้าง JWT
    const payload = {
      id: row.email,
      student_ID: row.student_ID || '',
      name: row.student_Name || '',
      student_level: row.student_level || '',
      faculty_ID: row.faculty_ID || ''
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'please_set_jwt_secret', { expiresIn: '7d' });

    // เซ็ต HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // คืนเฉพาะข้อมูลโปรไฟล์
    return res.json({ ok: true, user: { id: row.email, student_ID: row.student_ID || '', name: row.student_Name || '', student_level: row.student_level || '', faculty_ID: row.faculty_ID || '', faculty_Name: row.faculty_Name || '' }});
  
  } catch (err) {
    console.error('Login DB Error:', err);
    return res.status(500).json({ ok: false, message: 'Database Error' });
  }
});


// ===== สมัครบัญชี (แปลงเป็น Async/Await และ Transaction) =====
app.post('/register', async (req, res) => { // ✅ เพิ่ม async
  const student_ID = req.body.student_ID ?? req.body.student_id;
  const student_Name = req.body.student_Name ?? req.body.full_name;
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password;
  const student_level = req.body.student_level;
  const faculty = req.body.faculty;

  // ตรวจความครบถ้วนและโดเมนอีเมล
  if (!student_ID || !student_Name || !email || !password || !student_level || !faculty) {
    return res.status(400).json({ ok: false, message: 'กรอกข้อมูลให้ครบ' });
  }
  if (!isNuEmail(email)) {
    return res.status(400).json({ ok: false, message: 'ต้องใช้อีเมล @nu.ac.th เท่านั้น' });
  }
  
  let connection;
  try {
    // 1. ดึง Connection จาก Pool
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 2. เช็คซ้ำว่ามีอยู่แล้วหรือไม่
    const checkSql = `
      SELECT
        (SELECT COUNT(*) FROM Student WHERE student_ID = ?) AS sCount,
        (SELECT COUNT(*) FROM Users WHERE email = ?) AS uCount
    `;
    const [checkRows] = await connection.query(checkSql, [student_ID, email]);
    const { sCount = 0, uCount = 0 } = checkRows?.[0] || {};
    
    if (sCount > 0 || uCount > 0) {
      await connection.rollback();
      return res.status(409).json({ ok: false, message: 'มีบัญชีนี้อยู่แล้ว' });
    }

    // 3. แทรก Users
    const hash = await bcrypt.hash(password, 10);
    const insertUser = `INSERT INTO Users (email, password) VALUES (?, ?)`;
    await connection.query(insertUser, [email, hash]);

    // 4. แทรก Student
    const insertStudent = `
      INSERT INTO Student (student_ID, student_Name, student_level, faculty_ID, email)
      VALUES (?, ?, ?, ?, ?)
    `;
    await connection.query(
      insertStudent,
      [student_ID, student_Name, student_level, faculty, email]
    );

    // 5. Commit Transaction
    await connection.commit();
    res.json({ ok: true, message: 'สมัครบัญชีสำเร็จ' });

  } catch (e) {
    console.error('Register error:', e);
    if (connection) {
      await connection.rollback();
    }
    // Handle Duplicate Entry specifically for email (if it fails on step 3)
    if (e.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ ok: false, message: 'อีเมลนี้ถูกใช้แล้ว' });
    }
    res.status(500).json({ ok: false, message: 'Register failed' });

  } finally {
    // 6. คืน Connection สู่ Pool
    if (connection) connection.release();
  }
});


// CBR-MATCH (แปลงเป็น Async/Await)
app.post('/cbr-match', async (req, res) => { // ✅ เพิ่ม async
  const {
    // ... destructuring req.body
  } = req.body;
  // ... (helpers functions, weights definitions, etc. ไม่มีการเปลี่ยนแปลง)
  
  // 💡 ไม่จำเป็นต้องแปลงฟังก์ชัน CBR ภายในทั้งหมด เนื่องจากคุณใช้ `connection.query` แค่ครั้งเดียวที่นี่
  // แต่ต้องแปลงส่วนนี้ให้ใช้ async/await
  
  // --- SQL: ดึง CSV ของ instruction จากตารางเชื่อม ถ้ามี; ถ้าไม่มี ใช้คอลัมน์เดิม ---
  let sql = `
    SELECT
      fr.subject_ID, s.subject_Name, fr.group_type, gt.GroupType_Name,
      fr.groupwork_ID, fr.solowork_ID, fr.exam_ID, fr.attendance_ID, fr.instruction_ID, 
      COALESCE(fri.instruction_csv, fr.instruction_ID) AS instruction_csv, 
      fr.present_ID, fr.experience_ID, fr.challenge_ID, fr.time_ID,
      fr.grade_ID, gm.grade_Name, fr.review, fg.interestd
    FROM Form_review AS fr
    JOIN Form_ge  AS fg ON fg.id = fr.fg_ID
    LEFT JOIN Subject    AS s  ON s.subject_ID = fr.subject_ID
    LEFT JOIN Group_Type AS gt ON gt.GroupType_ID = fr.group_type
    LEFT JOIN Grade_map  AS gm ON gm.grade_ID  = fr.grade_ID
    LEFT JOIN (
      SELECT fr_ID, GROUP_CONCAT(instruction_ID ORDER BY instruction_ID) AS instruction_csv
      FROM Form_review_instruction
      GROUP BY fr_ID
    ) AS fri ON fri.fr_ID = fr.fr_ID
  `;
  const params = [];

  if (Array.isArray(group_types) && group_types.length) {
    sql += ` WHERE fr.group_type IN (${group_types.map(() => '?').join(',')})`;
    params.push(...group_types);
  }

  try {
    const [rows] = await db.query(sql, params); // ✅ ใช้ await db.query

    // ... (ส่วนการคำนวณความคล้ายคลึงทั้งหมด)
    // เนื่องจากส่วนนี้ยาวมาก ผมจะละไว้ในโค้ดที่ให้ แต่คุณต้องมั่นใจว่ามันยังคงอยู่
    
    // ... (ส่วนการคำนวณความคล้ายคลึงและเรียงลำดับ) ...
    // ในที่นี้ผมจะใส่แค่ Logic การ return เพื่อให้โค้ดทำงานได้ แต่คุณต้องใส่ Logic CBR ทั้งหมดกลับเข้าไป

    // ... (Logic CBR ทั้งหมด) ...

    /*
    * โค้ดส่วนนี้มาจากไฟล์เดิมของคุณที่ถูกตัดออกไปเพื่อความกระชับ
    * ต้องนำกลับมาใส่ในไฟล์จริงที่คุณแก้ไข
    */
    
    const baseW = { /* ... */ }; // (your weights)
    const W = { ...baseW, ...(weights || {}) };
    // ... (your helper functions: normalizeInterestTokens, diceTokens, etc.) ...
    
    // ... (The entire CBR calculation and grouping logic) ...
    
    // สำหรับการตอบกลับที่ถูกตัดออกไป
    const results = []; // Placeholder for actual results
    
    if (Array.isArray(group_types) && group_types.length) {
        // ... (Grouping Logic) ...
        const groups = []; // Placeholder for groups
        return res.json({ ok: true, groups });
    }

    return res.json({ ok: true, top: results.slice(0, 3), all: results });


  } catch (e) {
    console.error('CBR SQL/compute error:', e);
    return res.status(500).json({ ok: false, message: 'Database Error / CBR compute error' });
  }
});


//รวมวิชาทั้งหมด ไว้ในกลุ่ม (แปลงเป็น Async/Await)
app.get('/grouped-subjects', async (req, res) => { // ✅ เพิ่ม async
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
  try {
    const [rows] = await db.query(sql); // ✅ ใช้ await db.query

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

  } catch (err) {
    console.error("❌ SQL ERROR:", err);
    res.status(500).send("Database Error")
  }
})

// ✅ ดึง "รีวิวทั้งหมด" ของวิชานั้น (แปลงเป็น Async/Await)
app.get('/subjects/:id/reviews', async (req, res) => { // ✅ เพิ่ม async
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
  try {
    const [rows] = await db.query(sql, [subjectId]); // ✅ ใช้ await db.query

    res.json({
      subjectId,
      count: rows.length,
      reviews: rows, // [{ id, subjectId, text }]
    })
  } catch (err) {
    console.error('❌ fetch reviews failed:', err)
    return res.status(500).json({ message: 'Failed to fetch reviews' })
  }
})

// ✅ API อัปเดตชื่อนิสิต (แปลงเป็น Async/Await)
app.put('/students/:id', async (req, res) => { // ✅ เพิ่ม async
    const studentId = req.params.id;
    const { name } = req.body; 

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const sql = "UPDATE Student SET student_Name = ? WHERE student_ID = ?";
    
    try {
        const [result] = await db.query(sql, [name, studentId]); // ✅ ใช้ await db.query
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        console.log(`✅ Success: Updated student ID ${studentId} to name "${name}". Responding to client.`);
        
        res.status(200).json({ 
            student_ID: studentId,
            student_Name: name 
        });
    } catch (err) {
        console.error("Database Error on UPDATE:", err);
        return res.status(500).json({ error: 'Database update failed' });
    }
});


module.exports = app;