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





// ✅ เริ่ม server
const port = 3000;
app.listen(port, () => {
  console.log(`✅ Server started at http://localhost:${port}`);
});
