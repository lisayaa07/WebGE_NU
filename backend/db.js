// require ข้างบนไฟล์
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// ... other requires

const app = express();

// ตั้งค่า CORS — เปลี่ยนค่า origin ให้ตรงกับ front-end domain(s)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://web-ge-nu-9943-602f2zfrb-chlisas-projects.vercel.app';

const corsOptions = {
  origin: FRONTEND_ORIGIN,   // หรือเป็น array of origins ถ้ามีหลาย
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  credentials: true,         // สำคัญมากถ้าใช้ cookie
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ตอบ preflight สำหรับทุก route

app.use(express.json());
app.use(cookieParser());
// ... rest of your middleware & routes
