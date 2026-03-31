/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
let subjects = [
  { id: 1,  name: 'Lập trình C',                       status: 'active'   },
  { id: 2,  name: 'Lập trình Frontend với ReactJS',    status: 'inactive' },
  { id: 3,  name: 'Lập trình Backend với Spring boot', status: 'active'   },
  { id: 4,  name: 'Lập trình Frontend với VueJS',      status: 'inactive' },
  { id: 5,  name: 'Cấu trúc dữ liệu và giải thuật',   status: 'inactive' },
  { id: 6,  name: 'Phân tích và thiết kế hệ thống',   status: 'inactive' },
  { id: 7,  name: 'Toán cao cấp',                      status: 'active'   },
  { id: 8,  name: 'Tiếng Anh chuyên ngành',            status: 'inactive' },
  { id: 9,  name: 'Cơ sở dữ liệu',                    status: 'active'   },
  { id: 10, name: 'Mạng máy tính',                     status: 'inactive' },
  { id: 11, name: 'Hệ điều hành',                      status: 'active'   },
  { id: 12, name: 'Trí tuệ nhân tạo',                  status: 'inactive' },
  { id: 13, name: 'Học máy',                           status: 'active'   },
  { id: 14, name: 'Khoa học dữ liệu',                  status: 'inactive' },
  { id: 15, name: 'Lập trình Python',                  status: 'active'   },
  { id: 16, name: 'Lập trình Java nâng cao',           status: 'inactive' },
  { id: 17, name: 'Thiết kế giao diện UI/UX',          status: 'active'   },
  { id: 18, name: 'An toàn thông tin',                 status: 'inactive' },
  { id: 19, name: 'Điện toán đám mây',                 status: 'active'   },
  { id: 20, name: 'Kiểm thử phần mềm',                 status: 'inactive' },
];

let lessons = [
  { id: 1,  name: 'Session 01 - Tổng quan về HTML',   subjectId: 1, duration: 45, checked: true,  status: 'done'    },
  { id: 2,  name: 'Session 02 - Thẻ Inline và Block', subjectId: 1, duration: 60, checked: false, status: 'pending' },
  { id: 3,  name: 'Session 03 - Form và Table',        subjectId: 1, duration: 40, checked: true,  status: 'done'    },
  { id: 4,  name: 'Session 04 - CSS cơ bản',           subjectId: 1, duration: 45, checked: true,  status: 'pending' },
  { id: 5,  name: 'Session 05 - CSS layout',           subjectId: 1, duration: 60, checked: false, status: 'pending' },
  { id: 6,  name: 'Session 06 - CSS Flex box',         subjectId: 1, duration: 45, checked: false, status: 'pending' },
  { id: 7,  name: 'Session 12 - Con trỏ trong C',      subjectId: 1, duration: 45, checked: true,  status: 'done'    },
  { id: 8,  name: 'Session 15 - Đọc và ghi file',      subjectId: 1, duration: 60, checked: false, status: 'pending' },
  { id: 9,  name: 'Session 01 - Tổng quan ReactJS',    subjectId: 2, duration: 50, checked: false, status: 'pending' },
  { id: 10, name: 'Session 02 - Component & Props',    subjectId: 2, duration: 55, checked: false, status: 'pending' },
];

let nextSubjectId = subjects.length + 1;
let nextLessonId  = lessons.length + 1;

/* ═══════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════ */
const state = {
  // subjects
  subjectPage: 1,
  subjectPageSize: 8,
  subjectSearch: '',
  subjectFilter: '',
  subjectSort: { key: 'name', dir: 1 },   // dir: 1=asc, -1=desc
  subjectEditId: null,

  // lessons
  lessonPage: 1,
  lessonPageSize: 8,
  lessonSearch: '',
  lessonFilter: '',
  lessonSort: { key: 'name', dir: 1 },
  lessonEditId: null,

  // delete
  deleteTarget: null,   // { type: 'subject'|'lesson', id, name }

  currentPage: 'subjects',
};

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function $(id) { return document.getElementById(id); }

function openModal(id) {
  const el = $(id);
  el.classList.add('is-open');
  el.style.display = 'flex';
}
function closeModal(id) {
  const el = $(id);
  el.classList.remove('is-open');
  el.style.display = 'none';
}
function handleOverlayClick(e, id) {
  if (e.target === $(id)) closeModal(id);
}

function showToast(title, msg) {
  $('toast-title').textContent = title;
  $('toast-msg').textContent = msg;
  const t = $('toast');
  t.classList.remove('is-hidden');
  t.style.display = 'flex';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => closeToast(), 3500);
}
function closeToast() {
  const t = $('toast');
  t.style.display = 'none';
  t.classList.add('is-hidden');
}

function clearError(id) {
  const el = $(id);
  if (el) el.textContent = '';
  const inputMap = {
    'subject-name-error':    'subject-name-input',
    'subject-status-error':  'subject-status-input',
    'lesson-name-error':     'lesson-name-input',
    'lesson-subject-error':  'lesson-subject-input',
    'lesson-duration-error': 'lesson-duration-input',
  };
  const inp = $(inputMap[id]);
  if (inp) inp.classList.remove('is-error');
}

function setError(inputId, errorId, msg) {
  const inp = $(inputId);
  const err = $(errorId);
  if (inp) inp.classList.add('is-error');
  if (err) err.textContent = msg;
}

/* ═══════════════════════════════════════════════
   PAGE NAVIGATION
═══════════════════════════════════════════════ */
function showPage(page) {
  state.currentPage = page;
  $('page-subjects').style.display = page === 'subjects' ? '' : 'none';
  $('page-lessons').style.display  = page === 'lessons'  ? '' : 'none';

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('nav-item--active'));
  $(`nav-${page}`).classList.add('nav-item--active');

  if (page === 'lessons') {
    populateLessonSubjectFilter();
    renderLessons();
  } else {
    renderSubjects();
  }
}

function toggleSidebar() {
  $('sidebar').classList.toggle('sidebar--hidden');
}

/* ═══════════════════════════════════════════════
   SUBJECTS – RENDER
═══════════════════════════════════════════════ */
function getFilteredSubjects() {
  let list = [...subjects];
  const q = state.subjectSearch.toLowerCase().trim();
  if (q) list = list.filter(s => s.name.toLowerCase().includes(q));
  if (state.subjectFilter) list = list.filter(s => s.status === state.subjectFilter);

  const { key, dir } = state.subjectSort;
  list.sort((a, b) => {
    if (a[key] < b[key]) return -1 * dir;
    if (a[key] > b[key]) return 1 * dir;
    return 0;
  });
  return list;
}

function renderSubjects() {
  const list  = getFilteredSubjects();
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / state.subjectPageSize));
  if (state.subjectPage > pages) state.subjectPage = pages;

  const start = (state.subjectPage - 1) * state.subjectPageSize;
  const slice = list.slice(start, start + state.subjectPageSize);

  const tbody = $('subjects-tbody');
  const empty = $('subjects-empty');

  if (slice.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'flex';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = slice.map(s => `
      <tr>
        <td>${escHtml(s.name)}</td>
        <td>
          <span class="badge badge--${s.status === 'active' ? 'active' : 'inactive'}">
            <span class="badge__dot"></span>
            ${s.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          </span>
        </td>
        <td style="text-align:right;">
          <button class="action-btn action-btn--delete" onclick="openDeleteSubject(${s.id},'${escHtml(s.name)}')" title="Xóa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
          <button class="action-btn action-btn--edit" onclick="openEditSubjectModal(${s.id})" title="Sửa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </td>
      </tr>`).join('');
  }

  renderPagination('subjects-pagination', state.subjectPage, pages, (p) => {
    state.subjectPage = p;
    renderSubjects();
  });
}

function applyFilters() {
  state.subjectSearch = $('search-subject').value;
  state.subjectFilter = $('filter-status').value;
  state.subjectPage   = 1;
  renderSubjects();
}

function sortTable(key) {
  if (state.subjectSort.key === key) {
    state.subjectSort.dir *= -1;
  } else {
    state.subjectSort.key = key;
    state.subjectSort.dir = 1;
  }
  updateSortIcon('sort-icon-name', key === 'name' ? state.subjectSort.dir : 0);
  renderSubjects();
}

function updateSortIcon(iconId, dir) {
  const icon = $(iconId);
  if (!icon) return;
  icon.classList.remove('sort-icon--asc', 'sort-icon--desc');
  if (dir === 1)  icon.classList.add('sort-icon--asc');
  if (dir === -1) icon.classList.add('sort-icon--desc');
}

/* ═══════════════════════════════════════════════
   SUBJECTS – ADD / EDIT
═══════════════════════════════════════════════ */
function openAddSubjectModal() {
  state.subjectEditId = null;
  $('modal-subject-title').textContent = 'Thêm mới môn học';
  $('btn-submit-subject').textContent  = 'Thêm';
  $('subject-name-input').value        = '';
  $('subject-status-input').value      = '';
  clearAllSubjectErrors();
  openModal('modal-subject');
  setTimeout(() => $('subject-name-input').focus(), 100);
}

function openEditSubjectModal(id) {
  const s = subjects.find(x => x.id === id);
  if (!s) return;
  state.subjectEditId = id;
  $('modal-subject-title').textContent = 'Cập nhật môn học';
  $('btn-submit-subject').textContent  = 'Cập nhật';
  $('subject-name-input').value        = s.name;
  $('subject-status-input').value      = s.status;
  clearAllSubjectErrors();
  openModal('modal-subject');
  setTimeout(() => $('subject-name-input').focus(), 100);
}

function clearAllSubjectErrors() {
  clearError('subject-name-error');
  clearError('subject-status-error');
}

function submitSubjectForm() {
  const name   = $('subject-name-input').value.trim();
  const status = $('subject-status-input').value;
  let valid = true;

  if (!name) {
    setError('subject-name-input', 'subject-name-error', 'Tên môn học không được để trống');
    valid = false;
  }
  if (!status) {
    setError('subject-status-input', 'subject-status-error', 'Trạng thái không được để trống');
    valid = false;
  }
  if (!valid) return;

  if (state.subjectEditId) {
    const idx = subjects.findIndex(x => x.id === state.subjectEditId);
    if (idx > -1) { subjects[idx].name = name; subjects[idx].status = status; }
    showToast('Thành công', 'Cập nhật môn học thành công');
  } else {
    subjects.push({ id: nextSubjectId++, name, status });
    showToast('Thành công', 'Thêm mới môn học thành công');
  }

  closeModal('modal-subject');
  renderSubjects();
  populateLessonSubjectFilter();
}

/* ═══════════════════════════════════════════════
   SUBJECTS – DELETE
═══════════════════════════════════════════════ */
function openDeleteSubject(id, name) {
  state.deleteTarget = { type: 'subject', id };
  $('confirm-message').innerHTML = `Bạn có chắc chắn muốn xóa môn học <strong>${escHtml(name)}</strong> khỏi hệ thống không?`;
  openModal('modal-delete');
}

function confirmDelete() {
  const t = state.deleteTarget;
  if (!t) return;

  if (t.type === 'subject') {
    subjects = subjects.filter(s => s.id !== t.id);
    lessons  = lessons.filter(l => l.subjectId !== t.id);
    showToast('Thành công', 'Xóa môn học thành công');
    renderSubjects();
    populateLessonSubjectFilter();
  } else if (t.type === 'lesson') {
    lessons = lessons.filter(l => l.id !== t.id);
    showToast('Thành công', 'Xóa bài học thành công');
    renderLessons();
  }

  closeModal('modal-delete');
  state.deleteTarget = null;
}

/* ═══════════════════════════════════════════════
   LESSONS – RENDER
═══════════════════════════════════════════════ */
function populateLessonSubjectFilter() {
  const sel = $('filter-lesson-subject');
  const lessonSubjectSel = $('lesson-subject-input');
  const current = sel.value;

  sel.innerHTML = '<option value="">Lọc theo môn học</option>' +
    subjects.map(s => `<option value="${s.id}">${escHtml(s.name)}</option>`).join('');
  sel.value = current;

  if (lessonSubjectSel) {
    lessonSubjectSel.innerHTML = '<option value="">-- Chọn môn học --</option>' +
      subjects.map(s => `<option value="${s.id}">${escHtml(s.name)}</option>`).join('');
  }
}

function getFilteredLessons() {
  let list = [...lessons];
  const q = state.lessonSearch.toLowerCase().trim();
  if (q) list = list.filter(l => l.name.toLowerCase().includes(q));
  if (state.lessonFilter) list = list.filter(l => l.subjectId === parseInt(state.lessonFilter));

  const { key, dir } = state.lessonSort;
  list.sort((a, b) => {
    const av = key === 'duration' ? a.duration : a.name;
    const bv = key === 'duration' ? b.duration : b.name;
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
  return list;
}

function renderLessons() {
  const list  = getFilteredLessons();
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / state.lessonPageSize));
  if (state.lessonPage > pages) state.lessonPage = pages;

  const start = (state.lessonPage - 1) * state.lessonPageSize;
  const slice = list.slice(start, start + state.lessonPageSize);

  const tbody = $('lessons-tbody');
  const empty = $('lessons-empty');

  if (slice.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'flex';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = slice.map(l => `
      <tr class="${l.checked ? 'row--checked' : ''}">
        <td><input type="checkbox" ${l.checked ? 'checked' : ''} onchange="toggleLessonCheck(${l.id},this)" /></td>
        <td>${escHtml(l.name)}</td>
        <td>${l.duration}</td>
        <td>
          <span class="badge badge--${l.status === 'done' ? 'done' : 'pending'}">
            <span class="badge__dot"></span>
            ${l.status === 'done' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
          </span>
        </td>
        <td style="text-align:right;">
          <button class="action-btn action-btn--delete" onclick="openDeleteLesson(${l.id},'${escHtml(l.name)}')" title="Xóa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
          <button class="action-btn action-btn--edit" onclick="openEditLessonModal(${l.id})" title="Sửa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </td>
      </tr>`).join('');
  }

  renderPagination('lessons-pagination', state.lessonPage, pages, (p) => {
    state.lessonPage = p;
    renderLessons();
  });

  // sync select-all checkbox
  const allChecked = slice.length > 0 && slice.every(l => l.checked);
  $('check-all-lessons').checked = allChecked;
}

function applyLessonFilters() {
  state.lessonSearch = $('search-lesson').value;
  state.lessonFilter = $('filter-lesson-subject').value;
  state.lessonPage   = 1;
  renderLessons();
}

function toggleLessonCheck(id, checkbox) {
  const lesson = lessons.find(l => l.id === id);
  if (lesson) {
    lesson.checked = checkbox.checked;
    const row = checkbox.closest('tr');
    row.classList.toggle('row--checked', checkbox.checked);
  }
}

function toggleAllLessons(master) {
  const list = getFilteredLessons()
    .slice((state.lessonPage - 1) * state.lessonPageSize, state.lessonPage * state.lessonPageSize);
  list.forEach(l => { l.checked = master.checked; });
  renderLessons();
}

function sortLessons(key) {
  if (state.lessonSort.key === key) {
    state.lessonSort.dir *= -1;
  } else {
    state.lessonSort.key = key;
    state.lessonSort.dir = 1;
  }
  state.lessonPage = 1;
  renderLessons();
}

/* ═══════════════════════════════════════════════
   LESSONS – ADD / EDIT
═══════════════════════════════════════════════ */
function openAddLessonModal() {
  state.lessonEditId = null;
  populateLessonSubjectFilter();
  $('modal-lesson-title').textContent = 'Thêm mới bài học';
  $('btn-submit-lesson').textContent  = 'Thêm';
  $('lesson-name-input').value        = '';
  $('lesson-subject-input').value     = '';
  $('lesson-duration-input').value    = '';
  clearAllLessonErrors();
  openModal('modal-lesson');
  setTimeout(() => $('lesson-name-input').focus(), 100);
}

function openEditLessonModal(id) {
  const l = lessons.find(x => x.id === id);
  if (!l) return;
  state.lessonEditId = id;
  populateLessonSubjectFilter();
  $('modal-lesson-title').textContent = 'Cập nhật bài học';
  $('btn-submit-lesson').textContent  = 'Cập nhật';
  $('lesson-name-input').value        = l.name;
  $('lesson-subject-input').value     = l.subjectId;
  $('lesson-duration-input').value    = l.duration;
  clearAllLessonErrors();
  openModal('modal-lesson');
  setTimeout(() => $('lesson-name-input').focus(), 100);
}

function clearAllLessonErrors() {
  clearError('lesson-name-error');
  clearError('lesson-subject-error');
  clearError('lesson-duration-error');
}

function submitLessonForm() {
  const name      = $('lesson-name-input').value.trim();
  const subjectId = $('lesson-subject-input').value;
  const duration  = $('lesson-duration-input').value.trim();
  let valid = true;

  if (!name) {
    setError('lesson-name-input', 'lesson-name-error', 'Tên bài học không được để trống');
    valid = false;
  }
  if (!subjectId) {
    setError('lesson-subject-input', 'lesson-subject-error', 'Loại môn học không được để trống');
    valid = false;
  }
  if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
    setError('lesson-duration-input', 'lesson-duration-error', 'Thời gian học không được để trống');
    valid = false;
  }
  if (!valid) return;

  if (state.lessonEditId) {
    const idx = lessons.findIndex(x => x.id === state.lessonEditId);
    if (idx > -1) {
      lessons[idx].name      = name;
      lessons[idx].subjectId = parseInt(subjectId);
      lessons[idx].duration  = Number(duration);
    }
    showToast('Thành công', 'Cập nhật bài học thành công');
  } else {
    lessons.push({
      id: nextLessonId++,
      name,
      subjectId: parseInt(subjectId),
      duration: Number(duration),
      checked: false,
      status: 'pending',
    });
    showToast('Thành công', 'Thêm mới bài học thành công');
  }

  closeModal('modal-lesson');
  renderLessons();
}

/* ═══════════════════════════════════════════════
   LESSONS – DELETE
═══════════════════════════════════════════════ */
function openDeleteLesson(id, name) {
  state.deleteTarget = { type: 'lesson', id };
  $('confirm-message').innerHTML = `Bạn có chắc chắn muốn xóa bài học <strong>${escHtml(name)}</strong> khỏi hệ thống không?`;
  openModal('modal-delete');
}

/* ═══════════════════════════════════════════════
   PAGINATION
═══════════════════════════════════════════════ */
function renderPagination(containerId, current, total, onPage) {
  const el = $(containerId);
  if (!el) return;
  if (total <= 1) { el.innerHTML = ''; return; }

  let html = '';

  // Prev
  html += `<button class="page-btn" ${current === 1 ? 'disabled' : ''} onclick="(${onPage.toString()})(${current - 1})">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  </button>`;

  const pages = getPageRange(current, total);
  pages.forEach(p => {
    if (p === '...') {
      html += `<span class="page-dots">…</span>`;
    } else {
      html += `<button class="page-btn ${p === current ? 'page-btn--active' : ''}" onclick="(${onPage.toString()})(${p})">${p}</button>`;
    }
  });

  // Next
  html += `<button class="page-btn" ${current === total ? 'disabled' : ''} onclick="(${onPage.toString()})(${current + 1})">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  </button>`;

  el.innerHTML = html;
}

function getPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  pages.push(1);
  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

/* ═══════════════════════════════════════════════
   UTILITY
═══════════════════════════════════════════════ */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ═══════════════════════════════════════════════
   KEYBOARD: ESC closes topmost modal
═══════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  ['modal-delete', 'modal-subject', 'modal-lesson'].forEach(id => {
    const el = $(id);
    if (el && el.classList.contains('is-open')) closeModal(id);
  });
});

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderSubjects();
  populateLessonSubjectFilter();
});
