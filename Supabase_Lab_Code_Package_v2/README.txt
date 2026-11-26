================================================================================
ชุดไฟล์ประกอบใบงานปฏิบัติการ: การใช้งานและเชื่อมต่อ Supabase (3 ชั่วโมง) [v2]
================================================================================

โครงสร้างไฟล์ในชุดฝึกปฏิบัติ (Folder Structure):
--------------------------------------------------------------------------------
1. 01_step2_create_table.sql  (ใช้ในปฏิบัติการ ตอนที่ 2)
   - สร้างตาราง `public.todos` (7 คอลัมน์)
   - เพิ่มข้อมูลตัวอย่าง 3 แถว
   - ปิด Row Level Security (RLS) ชั่วคราว เพื่อใช้ทดสอบ CRUD พื้นฐานในตอนที่ 3
   - วิธีใช้: กด Ctrl+A คัดลอกทั้งไฟล์ไปวางใน SQL Editor แล้วกด Run ได้ทันที

2. 02_step4_enable_rls.sql  (ใช้ในปฏิบัติการ ตอนที่ 4)
   - เปิดใช้งาน Row Level Security (RLS) บนตาราง `public.todos`
   - สร้าง Policy ความปลอดภัยครบทั้ง 4 สิทธิ์ (SELECT, INSERT, UPDATE, DELETE)
   - วิธีใช้: กด Ctrl+A คัดลอกทั้งไฟล์ไปวางใน SQL Editor แล้วกด Run เมื่อเริ่มตอนที่ 4

3. 02_starter_crud/  (สำหรับปฏิบัติการ ตอนที่ 3: การเชื่อมต่อและทำ CRUD)
   - index.html : โครงสร้างหน้าเว็บ HTML5 + Google Web Font (Prompt) + Supabase CDN
   - style.css  : ไฟล์ตกแต่งหน้าตาเว็บไซต์ (CSS3 + CSS Variables + Responsive)
   - app.js     : โค้ด Vanilla JavaScript สำหรับ Create, Read, Update, Delete
                  (มีคอมเมนต์อธิบายทุกบรรทัด)

4. 03_complete_auth_rls/  (สำหรับปฏิบัติการ ตอนที่ 4-5: Auth + RLS + Search + Storage)
   - index.html : หน้าเว็บฉบับสมบูรณ์ รองรับระบบสมาชิก (สมัครสมาชิก/เข้าสู่ระบบ/ออกจากระบบ)
                  ระบบค้นหา กรองสถานะ และแนบรูปภาพ
   - style.css  : ไฟล์ตกแต่งหน้าตาสำหรับเวอร์ชันสมบูรณ์
   - app.js     : โค้ด Vanilla JavaScript ฉบับสมบูรณ์ เชื่อมต่อ Auth, Database และ Storage

วิธีเริ่มต้นใช้งาน (Quick Start):
--------------------------------------------------------------------------------
1. แตกไฟล์ .zip นี้ไว้ในเครื่องคอมพิวเตอร์
2. เปิดโฟลเดอร์นี้ด้วยโปรแกรม Visual Studio Code (VS Code)
3. คัดลอกค่า 2 รายการจาก Supabase Dashboard มาใส่ในไฟล์ app.js:
   - Project URL (จาก Project Overview หรือ Project Settings > Data API)
   - Publishable key (sb_publishable_...) หรือ anon key (จาก Project Settings > API Keys)
4. คลิกขวาที่ไฟล์ index.html แล้วเลือก "Open with Live Server"
5. กด F12 บนเบราว์เซอร์เพื่อเปิด Developer Tools (แท็บ Console และ Network) ดูการทำงาน
