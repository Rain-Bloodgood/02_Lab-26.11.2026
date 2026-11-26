/* ============================================================================
 * ไฟล์: 02_starter_crud/app.js
 * วัตถุประสงค์: ฝึกเชื่อมต่อ Supabase และเขียนคำสั่ง CRUD ด้วย Vanilla JavaScript
 * ============================================================================ */

// ----------------------------------------------------------------------------
// 1. ตั้งค่าการเชื่อมต่อ Supabase (นักศึกษาต้องเปลี่ยนค่า 2 บรรทัดนี้เป็นของตนเอง)
//    - SUPABASE_URL: หาได้จาก Project Overview หรือ Project Settings > Data API
//    - SUPABASE_ANON_KEY: หาได้จาก Project Settings > API Keys (ใช้ช่อง Publishable key: sb_publishable_...)
// ----------------------------------------------------------------------------
const SUPABASE_URL = "https://pgvqcalscvscqmttyuzm.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_m4LYesNtTyNgxi1cnpBJMQ_KwchbF3v";

// สร้าง Client Object สำหรับติดต่อกับ Supabase API
// window.supabase มาจากสคริปต์ CDN ที่เราโหลดไว้ในไฟล์ index.html
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

// ----------------------------------------------------------------------------
// 2. อ้างอิงองค์ประกอบ HTML (DOM Elements) เพื่อนำไปควบคุมผ่าน JavaScript
// ----------------------------------------------------------------------------
const statusBanner = document.getElementById("statusBanner");
const todoForm = document.getElementById("todoForm");
const todoTitle = document.getElementById("todoTitle");
const todoCategory = document.getElementById("todoCategory");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const refreshBtn = document.getElementById("refreshBtn");

// ฟังก์ชันช่วยเปลี่ยนข้อความและสีของแถบสถานะด้านบน
function setStatus(message, type = "loading") {
  statusBanner.textContent = message;
  statusBanner.className = `status-banner status-${type}`;
}

// ----------------------------------------------------------------------------
// 3. [READ] ฟังก์ชันดึงข้อมูลรายการงานทั้งหมดจากตาราง `todos`
// ----------------------------------------------------------------------------
async function fetchTodos() {
  // ตรวจสอบเบื้องต้นว่านักศึกษาเปลี่ยนค่า URL/Key แล้วหรือยัง
  if (SUPABASE_URL.includes("YOUR-PROJECT-ID")) {
    setStatus(
      "กรุณาแก้ไขค่า SUPABASE_URL และ SUPABASE_ANON_KEY ในไฟล์ app.js ก่อนใช้งาน",
      "error",
    );
    todoList.innerHTML =
      '<li class="empty-state">ยังไม่ได้ตั้งค่าการเชื่อมต่อ</li>';
    return;
  }

  setStatus("กำลังโหลดข้อมูลจาก Supabase...", "loading");

  // เรียกใช้คำสั่ง .from('todos').select('*') เพื่อดึงทุกคอลัมน์
  // .order('created_at', { ascending: false }) คือเรียงจากรายการล่าสุดขึ้นก่อน
  // ต้องใส่ await เพราะการติดต่อฐานข้อมูลผ่านเครือข่ายเป็นงานแบบ Asynchronous
  const { data, error } = await supabaseClient
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("เกิดข้อผิดพลาดขณะดึงข้อมูล:", error);
    setStatus(`เชื่อมต่อไม่สำเร็จ: ${error.message}`, "error");
    return;
  }

  setStatus(
    `เชื่อมต่อ Supabase สำเร็จ! พบข้อมูลทั้งหมด ${data.length} รายการ`,
    "ok",
  );
  renderTodos(data);
}

// ----------------------------------------------------------------------------
// 4. ฟังก์ชันนำข้อมูล Array ที่ได้จากฐานข้อมูลมาวาดเป็นรายการ <li> บนหน้าเว็บ
// ----------------------------------------------------------------------------
function renderTodos(todos) {
  todoCount.textContent = todos.length;
  todoList.innerHTML = "";

  if (todos.length === 0) {
    todoList.innerHTML =
      '<li class="empty-state">ยังไม่มีรายการงาน ลองเพิ่มงานใหม่ด้านบนได้เลย</li>';
    return;
  }

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.is_complete ? "completed" : ""}`;

    const leftDiv = document.createElement("div");
    leftDiv.className = "todo-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.is_complete;
    checkbox.addEventListener("change", () =>
      toggleTodoStatus(todo.id, checkbox.checked),
    );

    const titleSpan = document.createElement("span");
    titleSpan.className = "todo-title";
    titleSpan.textContent = todo.title; // ใช้ textContent เพื่อป้องกันช่องโหว่ XSS

    const categoryBadge = document.createElement("span");
    categoryBadge.className = "todo-meta";
    categoryBadge.textContent = todo.category || "ทั่วไป";

    leftDiv.append(checkbox, titleSpan, categoryBadge);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "todo-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-edit";
    editBtn.textContent = "แก้ไข";
    editBtn.addEventListener("click", () => editTodoTitle(todo.id, todo.title));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-delete";
    deleteBtn.textContent = "ลบ";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    actionsDiv.append(editBtn, deleteBtn);

    li.append(leftDiv, actionsDiv);
    todoList.appendChild(li);
  });
}

// ----------------------------------------------------------------------------
// 5. [CREATE] ฟังก์ชันเพิ่มรายการงานใหม่ลงในตาราง `todos`
// ----------------------------------------------------------------------------
async function addTodo(event) {
  event.preventDefault();

  const title = todoTitle.value.trim();
  const category = todoCategory.value;
  if (!title) return;

  const { error } = await supabaseClient.from("todos").insert([
    {
      title: title,
      category: category,
      is_complete: false,
    },
  ]);

  if (error) {
    console.error("เพิ่มข้อมูลไม่สำเร็จ:", error);
    alert(`เกิดข้อผิดพลาดในการเพิ่มข้อมูล: ${error.message}`);
    return;
  }

  todoTitle.value = "";
  await fetchTodos();
}

// ----------------------------------------------------------------------------
// 6. [UPDATE] ฟังก์ชันสลับสถานะเสร็จ/ยังไม่เสร็จ และฟังก์ชันแก้ไขชื่อรายการ
// ----------------------------------------------------------------------------
async function toggleTodoStatus(id, isComplete) {
  const { error } = await supabaseClient
    .from("todos")
    .update({ is_complete: isComplete })
    .eq("id", id);

  if (error) {
    console.error("อัปเดตสถานะไม่สำเร็จ:", error);
    alert(`อัปเดตไม่สำเร็จ: ${error.message}`);
    return;
  }

  await fetchTodos();
}

async function editTodoTitle(id, currentTitle) {
  const newTitle = prompt("แก้ไขชื่องาน:", currentTitle);
  if (newTitle === null || newTitle.trim() === "") return;

  const { error } = await supabaseClient
    .from("todos")
    .update({ title: newTitle.trim() })
    .eq("id", id);

  if (error) {
    console.error("แก้ไขชื่องานไม่สำเร็จ:", error);
    alert(`แก้ไขไม่สำเร็จ: ${error.message}`);
    return;
  }

  await fetchTodos();
}

// ----------------------------------------------------------------------------
// 7. [DELETE] ฟังก์ชันลบรายการงานออกจากฐานข้อมูล
// ----------------------------------------------------------------------------
async function deleteTodo(id) {
  const confirmed = confirm("คุณต้องการลบรายการงานนี้ใช่หรือไม่?");
  if (!confirmed) return;

  const { error } = await supabaseClient.from("todos").delete().eq("id", id);

  if (error) {
    console.error("ลบข้อมูลไม่สำเร็จ:", error);
    alert(`ลบไม่สำเร็จ: ${error.message}`);
    return;
  }

  await fetchTodos();
}

// ----------------------------------------------------------------------------
// 8. ผูกเหตุการณ์ (Event Listeners) และเริ่มต้นโหลดข้อมูลเมื่อเปิดหน้าเว็บ
// ----------------------------------------------------------------------------
todoForm.addEventListener("submit", addTodo);
refreshBtn.addEventListener("click", fetchTodos);

fetchTodos();
