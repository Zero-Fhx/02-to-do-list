// Estructura de las tareas

let tasks = [];
let nextId = 1;

function createTask(title) {
  return {
    id: nextId++,
    title: title,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function addTask(title) {
  if (!title.trim()) return;
  const newTask = createTask(title);
  tasks.push(newTask);
  renderTasks();
}

function completeTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task && !task.completed) {
    task.completed = true;
    task.updatedAt = new Date();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
}

function renderTasks() {
  const pendingList = document.getElementById("tasks");
  const completedList = document.getElementById("completed-tasks");

  // Limpiar listas
  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-card";

    const content = document.createElement("div");
    content.className = "task-content";

    const textContainer = document.createElement("div");
    textContainer.className = "task-text-container";

    const text = document.createElement("p");
    text.className = "task-text";
    text.textContent = task.title;
    textContainer.appendChild(text);

    const buttons = document.createElement("div");
    buttons.className = "buttons";

    // Botón eliminar
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-task";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.onclick = () => deleteTask(task.id);
    buttons.appendChild(deleteBtn);

    const date = document.createElement("span");
    date.className = "task-date";

    // Botón completar (solo si no está completada)
    if (!task.completed) {
      const completeBtn = document.createElement("button");
      completeBtn.className = "complete-task";
      completeBtn.textContent = "Completar";
      completeBtn.onclick = () => completeTask(task.id);
      buttons.insertBefore(completeBtn, deleteBtn);

      // Fecha de creación
      date.className = "task-date";
      date.textContent = `Creada el: ${task.createdAt.toLocaleDateString()} ${task.createdAt.toLocaleTimeString()}`;
    } else {
      date.className = "task-date";
      date.textContent = `Completada el: ${task.updatedAt.toLocaleDateString()} ${task.updatedAt.toLocaleTimeString()}`;
    }

    textContainer.appendChild(date);
    content.appendChild(textContainer);
    content.appendChild(buttons);
    li.appendChild(content);

    if (task.completed) {
      completedList.appendChild(li);
    } else {
      pendingList.appendChild(li);
    }
  });

  // Si no hay tareas, mostrar mensaje
  if (pendingList.children.length === 0) {
    const noTasksMessage = document.createElement("p");
    noTasksMessage.className = "no-tasks-message";
    noTasksMessage.textContent = "No hay tareas pendientes.";
    pendingList.appendChild(noTasksMessage);
  }

  if (completedList.children.length === 0) {
    const noCompletedMessage = document.createElement("p");
    noCompletedMessage.className = "no-tasks-message";
    noCompletedMessage.textContent = "No hay tareas completadas.";
    completedList.appendChild(noCompletedMessage);
  }

  // Guardar tareas en localStorage
  saveTasks();
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("task-input");
  const addBtn = document.getElementById("add-task-btn");

  addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (input.value.trim()) {
      addTask(input.value);
      input.value = "";
    }
  });

  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addTask(input.value);
      input.value = "";
    }
  });

  loadTasks();
});

// TODO: This don't work, all methods about tasks don't work
// Métodos localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");

  if (!storedTasks) {
    // Si no hay tareas guardadas, inicializar con un array vacío
    tasks = [];
    nextId = 1;
    renderTasks();
    return;
  }

  if (storedTasks) {
    const parsed = JSON.parse(storedTasks);
    tasks = parsed.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
    nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    renderTasks();
  }
}

console.log(JSON.parse(localStorage.getItem("tasks")));
