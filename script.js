// // Select DOM elements
// const todoInput = document.getElementById('todo-input');
// const addBtn = document.getElementById('add-btn');
// const todoList = document.getElementById('todo-list');
// const clearBtn = document.getElementById('clear-btn');
// const modeToggle = document.getElementById('mode-toggle');

// let todos = JSON.parse(localStorage.getItem('todos')) || [];
// let isDarkMode = false;

// renderTodos();

// // Toggle light/dark mode
// modeToggle.addEventListener('click', () => {
//   isDarkMode = !isDarkMode;
//   document.body.style.backgroundColor = isDarkMode ? '#18191a' : '#f0f2f5';
//   document.body.style.color = isDarkMode ? '#ffffff' : '#000000';
//   modeToggle.textContent = isDarkMode ? '🌙 Dark Mode' : '🌞 Light Mode';
// });

// // Add new task
// addBtn.addEventListener('click', () => {
//   const task = todoInput.value.trim();
//   if (task) {
//     todos.push({ text: task, completed: false });
//     saveTodos();
//     renderTodos();
//     todoInput.value = '';
//   }
// });

// // Mark task as completed or uncompleted
// function toggleComplete(index) {
//   todos[index].completed = !todos[index].completed;
//   saveTodos();
//   renderTodos();
// }

// // Delete task
// function deleteTodo(index) {
//   todos.splice(index, 1);
//   saveTodos();
//   renderTodos();
// }

// // Edit task
// function editTodo(index) {
//   const newText = prompt('Edit task:', todos[index].text);
//   if (newText !== null && newText.trim() !== '') {
//     todos[index].text = newText.trim();
//     saveTodos();
//     renderTodos();
//   }
// }

// // Render task list
// function renderTodos() {
//   todoList.innerHTML = '';

//   if (todos.length === 0) {
//     todoList.innerHTML = '<p style="text-align:center;">Your list is empty! 😎</p>';
//     return;
//   }

//   todos.forEach((todo, index) => {
//     const li = document.createElement('li');
//     li.className = 'todo-item';

//     const checkbox = document.createElement('input');
//     checkbox.type = 'checkbox';
//     checkbox.className = 'todo-checkbox';
//     checkbox.checked = todo.completed;
//     checkbox.addEventListener('change', () => toggleComplete(index));

//     const span = document.createElement('span');
//     span.innerText = todo.text;
//     span.className = 'task-text';
//     if (todo.completed) span.classList.add('completed');

//     const editBtn = document.createElement('button');
//     editBtn.className = 'edit-btn';
//     editBtn.innerHTML = '&#9998;'; // Pencil icon
//     editBtn.title = 'Edit Task';
//     editBtn.addEventListener('click', () => editTodo(index));

//     const deleteBtn = document.createElement('button');
//     deleteBtn.className = 'edit-btn';
//     deleteBtn.innerHTML = '&times;';
//     deleteBtn.title = 'Delete Task';
//     deleteBtn.style.color = '#dc3545';
//     deleteBtn.addEventListener('click', () => deleteTodo(index));

//     li.appendChild(checkbox);
//     li.appendChild(span);
//     li.appendChild(editBtn);
//     li.appendChild(deleteBtn);

//     todoList.appendChild(li);
//   });
// }

// // Save todos to local storage
// function saveTodos() {
//   localStorage.setItem('todos', JSON.stringify(todos));
// }

// // Add task on pressing Enter
// todoInput.addEventListener('keypress', (e) => {
//   if (e.key === 'Enter') addBtn.click();
// });

// // Clear all tasks
// clearBtn.addEventListener('click', () => {
//   todos = [];
//   saveTodos();
//   renderTodos();
// });

// Initialize variables to refer to DOM elements  
// Initialize variables to refer to DOM elements  
const taskList = document.getElementById('task-list');  
const modeBtn = document.getElementById('mode-toggle');  
const exportBtn = document.getElementById('export-btn');  
const importBtn = document.getElementById('import-btn');  
const clearBtn = document.getElementById('clear-all');  

const taskNameInput = document.getElementById('task-name');  
const taskPrioritySelect = document.getElementById('task-priority');  
const taskDueInput = document.getElementById('task-due');  
const taskTagsInput = document.getElementById('task-tags');  
const addTaskBtn = document.getElementById('add-task');  

const importFileInput = document.getElementById('import-file');  

// Load existing tasks from local storage or initialize empty array  
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];  
let isDarkMode = false;  

// Render the task list on page load  
renderTasks();  

// Toggle between dark and light themes  
modeBtn.addEventListener('click', () => {  
  isDarkMode = !isDarkMode;  
  document.body.style.backgroundColor = isDarkMode ? '#18191a' : '#f0f2f5';  
  document.body.style.color = isDarkMode ? '#fff' : '#000';  
  modeBtn.textContent = isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode';  
});  

// Add new task on button click or pressing Enter  
addTaskBtn.addEventListener('click', addTask);  
taskNameInput.addEventListener('keypress', (e) => {  
  if (e.key === 'Enter') addTask();  
});  

// Function to add a new task  
function addTask() {  
  const name = taskNameInput.value.trim();  
  if (!name) return; // Do not add empty task  
  const priority = taskPrioritySelect.value;  
  const dueDate = taskDueInput.value;  
  const tags = taskTagsInput.value.split(',').map(t => t.trim()).filter(t => t);  
  
  const task = {  
    id: Date.now(),  
    name,  
    priority,  
    dueDate,  
    tags,  
    completed: false  
  };  
  
  tasks.push(task);  
  saveTasks();  
  renderTasks();  
  
  taskNameInput.value = '';  
  taskTagsInput.value = '';  
  taskDueInput.value = '';  
}  

// Save tasks array to local storage  
function saveTasks() {  
  localStorage.setItem('tasks', JSON.stringify(tasks));  
}  

// Render the task list  
function renderTasks() {  
  taskList.innerHTML = '';  

  tasks.forEach((task, index) => {  
    const li = document.createElement('li');  
    li.className = 'task-item';  
    li.draggable = true;  
    li.dataset.index = index;  

    li.addEventListener('dragstart', (e) => {  
      e.dataTransfer.setData('text/plain', index);  
      li.classList.add('dragging');  
    });  
    li.addEventListener('dragend', () => {  
      li.classList.remove('dragging');  
    });  
    li.addEventListener('dragover', (e) => {  
      e.preventDefault();  
      const dragging = document.querySelector('.dragging');  
      if (dragging && dragging !== li) {  
        taskList.insertBefore(dragging, li.nextSibling);  
      }  
    });  
    li.addEventListener('drop', () => {  
      const fromIndex = parseInt(li.dataset.index);  
      reorderTasks(fromIndex);  
    });  

    const detailsDiv = document.createElement('div');  
    detailsDiv.className = 'task-details';  

    const headerDiv = document.createElement('div');  
    headerDiv.className = 'task-header';  

    const checkbox = document.createElement('input');  
    checkbox.type = 'checkbox';  
    checkbox.checked = task.completed;  
    checkbox.addEventListener('change', () => toggleComplete(index));  

    const nameSpan = document.createElement('span');  
    nameSpan.innerText = task.name;  
    nameSpan.style.fontWeight = 'bold';  
    if (task.completed) nameSpan.style.textDecoration = 'line-through';  

    const priorityBadge = document.createElement('span');  
    priorityBadge.innerText = task.priority;  
    priorityBadge.style.padding = '2px 6px';  
    priorityBadge.style.borderRadius = '8px';  
    priorityBadge.style.fontSize = '12px';  
    priorityBadge.style.backgroundColor =  
      task.priority === 'High'  
        ? '#dc3545'  
        : task.priority === 'Medium'  
        ? '#ffc107'  
        : '#28a745';  
    priorityBadge.style.color = '#fff';  

    headerDiv.appendChild(checkbox);  
    headerDiv.appendChild(nameSpan);  
    headerDiv.appendChild(priorityBadge);  

    const infoDiv = document.createElement('div');  
    infoDiv.className = 'task-info';  

    if (task.dueDate) {  
      const dueSpan = document.createElement('span');  
      dueSpan.innerHTML = '📅 ' + task.dueDate;  
      infoDiv.appendChild(dueSpan);  
    }  

    if (task.tags.length > 0) {  
      const tagsDiv = document.createElement('div');  
      tagsDiv.className = 'task-tags';  
      task.tags.forEach(tag => {  
        const span = document.createElement('span');  
        span.innerText = tag;  
        tagsDiv.appendChild(span);  
      });  
      infoDiv.appendChild(tagsDiv);  
    }  

    const btnDiv = document.createElement('div');  

    const editBtn = document.createElement('button');  
    editBtn.className = 'task-btn';  
    editBtn.innerHTML = '&#9998;';  
    editBtn.title = 'Edit Task';  
    editBtn.onclick = () => editTask(index);  

    const deleteBtn = document.createElement('button');  
    deleteBtn.className = 'task-btn';  
    deleteBtn.innerHTML = '&times;';  
    deleteBtn.title = 'Delete Task';  
    deleteBtn.onclick = () => deleteTask(index);  

    btnDiv.appendChild(editBtn);  
    btnDiv.appendChild(deleteBtn);  

    detailsDiv.appendChild(headerDiv);  
    detailsDiv.appendChild(infoDiv);  
    detailsDiv.appendChild(btnDiv);  
    li.appendChild(detailsDiv);  

    taskList.appendChild(li);  
  }); // End forEach
} // End renderTasks

// Placeholder for required functions  
function toggleComplete(index) {  
  tasks[index].completed = !tasks[index].completed;  
  saveTasks();  
  renderTasks();  
}  

function editTask(index) {  
  const task = tasks[index];  
  const newName = prompt('Edit task name:', task.name);  
  if (newName !== null) {  
    task.name = newName.trim();  
    saveTasks();  
    renderTasks();  
  }  
}  

function deleteTask(index) {  
  if (confirm('Are you sure you want to delete this task?')) {  
    tasks.splice(index, 1);  
    saveTasks();  
    renderTasks();  
  }  
}  

function reorderTasks(fromIndex) {  
  const items = Array.from(taskList.children);  
  const toIndex = items.findIndex(item => item.classList.contains('dragging'));  
  if (toIndex > -1 && fromIndex !== toIndex) {  
    const [movedTask] = tasks.splice(fromIndex, 1);  
    tasks.splice(toIndex, 0, movedTask);  
    saveTasks();  
    renderTasks();  
  }  
}
