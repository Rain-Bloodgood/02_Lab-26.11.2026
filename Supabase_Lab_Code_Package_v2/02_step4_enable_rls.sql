-- ==============================================================================
-- ไฟล์: 02_step4_enable_rls.sql
-- ใช้สำหรับ: ปฏิบัติการตอนที่ 4 (เปิดใช้งานความปลอดภัยระดับแถว RLS และสร้าง Policies)
-- วิธีใช้: กด Ctrl+A คัดลอกทั้งหมดไปวางใน SQL Editor ของ Supabase แล้วกด Run
-- ==============================================================================

-- 1. เปิดใช้งาน Row Level Security (RLS) กับตาราง public.todos
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 2. ลบ Policy เก่า (ถ้ามี) เพื่อป้องกันข้อผิดพลาดกรณีนักศึกษากด Run ซ้ำ
DROP POLICY IF EXISTS "Users can view their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON public.todos;

-- 3. Policy สำหรับ SELECT (อ่านข้อมูล): อนุญาตให้อ่านเฉพาะแถวที่ user_id ตรงกับผู้ที่ล็อกอินอยู่
CREATE POLICY "Users can view their own todos"
ON public.todos
FOR SELECT
USING (auth.uid() = user_id);

-- 4. Policy สำหรับ INSERT (เพิ่มข้อมูล): อนุญาตให้เพิ่มข้อมูลได้เฉพาะเมื่อ user_id เป็นของตนเอง
CREATE POLICY "Users can insert their own todos"
ON public.todos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. Policy สำหรับ UPDATE (แก้ไขข้อมูล): อนุญาตให้แก้ไขเฉพาะแถวของตนเอง
CREATE POLICY "Users can update their own todos"
ON public.todos
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Policy สำหรับ DELETE (ลบข้อมูล): อนุญาตให้ลบเฉพาะแถวของตนเอง
CREATE POLICY "Users can delete their own todos"
ON public.todos
FOR DELETE
USING (auth.uid() = user_id);
