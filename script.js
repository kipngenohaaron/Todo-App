// Select DOM elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const clearBtn = document.getElementById('clear-btn');
const modeToggle = document.getElementById('mode-toggle');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let isDarkMode = false;

renderTodos();

// Toggle light/dark mode
modeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.style.backgroundColor = isDarkMode ? '#18191a' : '#f0f2f5';
  document.body.style.color = isDarkMode ? '#ffffff' : '#000000';
  modeToggle.textContent = isDarkMode ? '🌙 Dark Mode' : '🌞 Light Mode';
});

// Add new task
addBtn.addEventListener('click', () => {
  const task = todoInput.value.trim();
  if (task) {
    todos.push({ text: task, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
  }
});

// Mark task as completed or uncompleted
function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

// Delete task
function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

// Edit task
function editTodo(index) {
  const newText = prompt('Edit task:', todos[index].text);
  if (newText !== null && newText.trim() !== '') {
    todos[index].text = newText.trim();
    saveTodos();
    renderTodos();
  }
}

// Render task list
function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = '<p style="text-align:center;">Your list is empty! 😎</p>';
    return;
  }

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleComplete(index));

    const span = document.createElement('span');
    span.innerText = todo.text;
    span.className = 'task-text';
    if (todo.completed) span.classList.add('completed');

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '&#9998;'; // Pencil icon
    editBtn.title = 'Edit Task';
    editBtn.addEventListener('click', () => editTodo(index));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'edit-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = 'Delete Task';
    deleteBtn.style.color = '#dc3545';
    deleteBtn.addEventListener('click', () => deleteTodo(index));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
  });
}

// Save todos to local storage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Add task on pressing Enter
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

// Clear all tasks
clearBtn.addEventListener('click', () => {
  todos = [];
  saveTodos();
  renderTodos();
});