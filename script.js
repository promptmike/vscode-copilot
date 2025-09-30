// Task Manager App Script

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}
function getFilteredTasks(tasks) {
  if (currentFilter === 'completed') return tasks.filter(t => t.completed);
  if (currentFilter === 'pending') return tasks.filter(t => !t.completed);
  return tasks;
}
function renderTasks() {
  const tasks = loadTasks();
  const filtered = getFilteredTasks(tasks);
  taskList.innerHTML = '';
  filtered.forEach((task, idx) => {
    // Find the real index in the full tasks array
    const realIdx = tasks.indexOf(task);
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');
    // Checkbox for completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task as completed');
    checkbox.addEventListener('change', () => {
      tasks[realIdx].completed = checkbox.checked;
      saveTasks(tasks);
      renderTasks();
    });
    // Label for task text
    const label = document.createElement('label');
    label.textContent = task.text;
    label.htmlFor = `task-${realIdx}`;
    // Delete button
    const actions = document.createElement('div');
    actions.className = 'actions';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.addEventListener('click', () => {
      tasks.splice(realIdx, 1);
      saveTasks(tasks);
      renderTasks();
    });
    actions.appendChild(deleteBtn);
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

taskForm.addEventListener('submit', e => {
    e.preventDefault();
    let text = taskInput.value;
    // Trim whitespace from both ends
    text = text.trim();
    // Prevent adding empty tasks
    if (!text) {
        taskInput.setAttribute('aria-invalid', 'true');
        taskInput.focus();
        return;
    }
    taskInput.removeAttribute('aria-invalid');
    const tasks = loadTasks();
    tasks.push({ text, completed: false });
    saveTasks(tasks);
    taskInput.value = '';
    renderTasks();
});

// Initial render
renderTasks();

// Dark mode toggle logic
const darkToggleBtn = document.getElementById('dark-mode-toggle');
const root = document.documentElement;

function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
    darkToggleBtn.textContent = '☀️';
    darkToggleBtn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    document.body.classList.remove('dark-mode');
    darkToggleBtn.textContent = '🌙';
    darkToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
  }
  localStorage.setItem('darkMode', enabled ? '1' : '0');
}

// Load dark mode preference
const darkPref = localStorage.getItem('darkMode') === '1';
setDarkMode(darkPref);

darkToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setDarkMode(!isDark);
});
