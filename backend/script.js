// โหลดคณะ
fetch("http://localhost:3000/faculty")
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById("facultySelect");
    data.forEach(faculty => {
      const option = document.createElement("option");
      option.value = faculty.faculty_ID;
      option.textContent = faculty.faculty_Name;
      select.appendChild(option);
    });
  })
  .catch(err => {
    console.error("โหลดคณะไม่สำเร็จ:", err);
  });

// โหลดความสนใจ
fetch("http://localhost:3000/interestd")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("interestCheckboxGroup");
    container.innerHTML = "";
    data.forEach(item => {
      const label = document.createElement("label");
      label.style.display = "block";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "interestd[]";
      checkbox.value = item.interest_ID;
      label.appendChild(checkbox);
      label.append(" " + item.interest_Name);
      container.appendChild(label);
    });
  })
  .catch(err => {
    console.error("โหลดข้อมูลความสนใจล้มเหลว:", err);
  });

// โหลดเกรด
fetch("http://localhost:3000/grades")
  .then(res => res.json())
  .then(data => {
    const gradeSelect = document.getElementById("gradeSelect");
    data.forEach(grade => {
      const option = document.createElement("option");
      option.value = grade.grade_ID;
      option.textContent = grade.grade_Name;
      gradeSelect.appendChild(option);
    });
  })
  .catch(err => {
    console.error("โหลดเกรดไม่สำเร็จ:", err);
  });

// โหลดกลุ่มวิชาและรายวิชา
async function loadSubjects() {
  try {
    const groupRes = await fetch("http://localhost:3000/subject-groups");
    const groups = await groupRes.json();

    const groupSelect = document.getElementById("subjectGroup");
    groupSelect.innerHTML = '<option disabled selected>-- เลือกกลุ่มวิชา --</option>';

    groups.forEach(g => {
      const opt = document.createElement("option");
      opt.value = g.GroupType_ID;
      opt.textContent = g.GroupType_Name;
      groupSelect.appendChild(opt);
    });

    groupSelect.addEventListener("change", async () => {
      const selected = groupSelect.value;
      const subjectRes = await fetch(`http://localhost:3000/subjects/${selected}`);
      const subjects = await subjectRes.json();

      const subjectSelect = document.getElementById("subjectSelect");
      subjectSelect.innerHTML = '<option disabled selected>-- เลือกรายวิชา --</option>';

      subjects.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.subject_ID;
        opt.textContent = s.subject_Name;
        subjectSelect.appendChild(opt);
      });
    });
  } catch (err) {
    console.error("โหลดข้อมูลผิดพลาด:", err);
  }
}
window.onload = loadSubjects;

// โหลด groupwork จาก db
fetch("http://localhost:3000/groupwork")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("groupworkContainer");
    data.forEach(item => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "groupwork";
      radio.value = item.groupwork_ID;
      label.appendChild(radio);
      label.append(" " + item.groupwork_Name);
      label.style.display = "block";
      container.appendChild(label);
    });
  })
  .catch(err => {
    console.error("โหลด groupwork ไม่สำเร็จ:", err);
  });


  fetch("http://localhost:3000/solowork")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("soloworkContainer");
    data.forEach(item => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "solowork";
      radio.value = item.solowork_ID;
      label.appendChild(radio);
      label.append(" " + item.solowork_Name);
      label.style.display = "block";
      container.appendChild(label);
    });
  })
  .catch(err => {
    console.error("โหลด solowork ไม่สำเร็จ:", err);
  });

  fetch("http://localhost:3000/attendance")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("attendanceContainer");
    data.forEach(item => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "attendance";
      radio.value = item.attendance_ID;
      label.appendChild(radio);
      label.append(" " + item.attendance_Name);
      label.style.display = "block";
      container.appendChild(label);
    });
  })
  .catch(err => {
    console.error("โหลด solowork ไม่สำเร็จ:", err);
  });
  // โหลดตัวเลือกการสอบจาก Exam_map
fetch("http://localhost:3000/exam")
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById("examSelect");
    data.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.exam_ID;
      opt.textContent = item.exam_Name;
      select.appendChild(opt);
    });
  })
  .catch(err => {
    console.error("โหลด exam ไม่สำเร็จ:", err);
  });

 fetch("http://localhost:3000/instruction")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("instructionContainer");
    data.forEach(item => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "instruction";
      radio.value = item.instruction_ID;
      label.appendChild(radio);
      label.append(" " + item.instruction_Name);
      label.style.display = "block";
      container.appendChild(label);
    });
  })
  .catch(err => {
    console.error("โหลด instruction ไม่สำเร็จ:", err);
  });

   fetch("http://localhost:3000/present")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("presentContainer");
    data.forEach(item => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "present";
      radio.value = item.present_ID;
      label.appendChild(radio);
      label.append(" " + item.present_Name);
      label.style.display = "block";
      container.appendChild(label);
    });
  })
  .catch(err => {
    console.error("โหลด present ไม่สำเร็จ:", err);
  });

   fetch("http://localhost:3000/experience")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("experienceContainer");
    data.forEach(item => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "experience";
      radio.value = item.experience_ID;
      label.appendChild(radio);
      label.append(" " + item.experience_Name);
      label.style.display = "block";
      container.appendChild(label);
    });
  })
  .catch(err => {
    console.error("โหลด experience ไม่สำเร็จ:", err);
  });

   fetch("http://localhost:3000/challenge")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("challengeContainer");
    data.forEach(item => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "challenge";
      radio.value = item.challenge_ID;
      label.appendChild(radio);
      label.append(" " + item.challenge_Name);
      label.style.display = "block";
      container.appendChild(label);
    });
  })
  .catch(err => {
    console.error("โหลด challenge ไม่สำเร็จ:", err);
  });

   fetch("http://localhost:3000/time")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("timeContainer");
    data.forEach(item => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "time";
      radio.value = item.time_ID;
      label.appendChild(radio);
      label.append(" " + item.time_Name);
      label.style.display = "block";
      container.appendChild(label);
    });
  })
  .catch(err => {
    console.error("โหลด time ไม่สำเร็จ:", err);
  });
// ปุ่ม reset
function resetForm() {
  if (confirm("คุณต้องการล้างฟอร์มหรือไม่?")) {
    document.querySelector("form").reset();
  }
}

document.getElementById("reviewForm").addEventListener("submit", function (e) {
  e.preventDefault(); // ❌ ไม่ reload

  const form = e.target;
  const formData = new FormData(form);

  fetch("http://localhost:3000/submit-form", {
    method: "POST",
    body: new URLSearchParams(formData),
  })
    .then(res => {
      if (!res.ok) throw new Error("ส่งข้อมูลล้มเหลว");
      return res.text(); // หรือ res.json()
    })
    .then(data => {
      console.log("✅ Success:", data);

      form.style.display = "none";                 // ซ่อนฟอร์ม
      document.getElementById("successMessage").style.display = "block";  // โชว์ข้อความ
    })
    .catch(err => {
      alert("❌ เกิดข้อผิดพลาด: " + err.message);
      console.error(err);
    });
});

function startNewForm() {
  document.getElementById("reviewForm").reset();
  document.getElementById("successMessage").style.display = "none";
  document.getElementById("reviewForm").style.display = "block";
}



