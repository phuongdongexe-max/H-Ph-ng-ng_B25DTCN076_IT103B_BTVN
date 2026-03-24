let todos = [
    { id: 1, name: "Học JavaScript cơ bản", completed: false },
    { id: 2, name: "Làm bài tập Session 15", completed: true },
];
let nextId = 3;

function render() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    if (todos.length === 0) {
        taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">Chưa có công việc nào. Hãy thêm công việc mới!</div>
      </div>`;
        updateFooter();
        return;
    }

    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];

        let item = document.createElement("div");
        item.dataset.id = todo.id;

        if (todo.completed) {
            item.className = "task-item completed";
        } else {
            item.className = "task-item";
        }

        let completedClass = "";
        if (todo.completed) {
            completedClass = "completed";
        }

        item.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${todo.completed ? "checked" : ""} />
      <span class="task-text ${completedClass}">${todo.name}</span>
      <div class="task-actions">
        <button class="btn-edit">✏️ Sửa</button>
        <button class="btn-delete">🗑️ Xóa</button>
      </div>`;

        item.querySelector(".task-checkbox").onclick = function () {
            toggleComplete(todo.id);
        };

        item.querySelector(".btn-edit").onclick = function () {
            startEdit(todo.id);
        };

        item.querySelector(".btn-delete").onclick = function () {
            deleteTodo(todo.id);
        };

        taskList.appendChild(item);
    }

    updateFooter();
}

function addTodo() {
    let taskInput = document.getElementById("taskInput");
    let name = taskInput.value.trim();

    if (name === "") {
        alert("Vui lòng nhập tên công việc!");
        taskInput.focus();
        return;
    }

    let newTodo = { id: nextId, name: name, completed: false };
    todos.push(newTodo);
    nextId++;

    taskInput.value = "";
    taskInput.focus();

    render();
}

function toggleComplete(id) {
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            todos[i].completed = !todos[i].completed;
        }
    }
    render();
}

function deleteTodo(id) {
    let confirmed = confirm("Bạn có chắc muốn xóa công việc này không?");
    if (!confirmed) return;

    let newTodos = [];
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id !== id) {
            newTodos.push(todos[i]);
        }
    }
    todos = newTodos;

    render();
}

function startEdit(id) {
    let taskList = document.getElementById("taskList");
    let item = taskList.querySelector("[data-id='" + id + "']");

    let textSpan = item.querySelector(".task-text");
    let actionsDiv = item.querySelector(".task-actions");
    let currentName = textSpan.textContent;

    textSpan.style.display = "none";
    actionsDiv.style.display = "none";

    let editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "task-edit-input";
    editInput.value = currentName;

    let newActions = document.createElement("div");
    newActions.className = "task-actions";
    newActions.innerHTML = `
    <button class="btn-save">💾 Lưu</button>
    <button class="btn-cancel">✖ Hủy</button>`;

    item.insertBefore(editInput, actionsDiv);
    item.appendChild(newActions);

    editInput.focus();

    newActions.querySelector(".btn-save").onclick = function () {
        saveEdit(id, editInput.value);
    };

    newActions.querySelector(".btn-cancel").onclick = function () {
        render();
    };

    editInput.onkeydown = function (e) {
        if (e.key === "Enter") {
            saveEdit(id, editInput.value);
        }
        if (e.key === "Escape") {
            render();
        }
    };
}

function saveEdit(id, newName) {
    newName = newName.trim();

    if (newName === "") {
        alert("Tên công việc không được để trống!");
        return;
    }

    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            todos[i].name = newName;
        }
    }

    render();
}

function updateFooter() {
    let total = todos.length;
    let done = 0;

    for (let i = 0; i < todos.length; i++) {
        if (todos[i].completed) {
            done++;
        }
    }

    document.getElementById("completedCount").textContent = done;
    document.getElementById("totalCount").textContent = total;

    let footer = document.querySelector(".footer");
    let badge = document.getElementById("completionBadge");

    if (total > 0 && done === total) {
        if (!badge) {
            let newBadge = document.createElement("div");
            newBadge.id = "completionBadge";
            newBadge.className = "completion-badge";
            newBadge.innerHTML = `<span class="check-icon">✅</span> Hoàn thành tất cả!`;
            newBadge.style.animation = "badgePop 0.4s ease-out";
            footer.appendChild(newBadge);

            let style = document.createElement("style");
            style.textContent = `
        @keyframes badgePop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }`;
            document.head.appendChild(style);
        }
    } else {
        if (badge) {
            badge.remove();
        }
    }
}

document.getElementById("addBtn").onclick = function () {
    addTodo();
};

document.getElementById("taskInput").onkeydown = function (e) {
    if (e.key === "Enter") {
        addTodo();
    }
};

render();