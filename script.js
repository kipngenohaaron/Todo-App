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

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let isDarkMode = false;

renderTasks();

modeBtn.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.style.backgroundColor = isDarkMode ? '#18191a' : '#f0f2f5';
  document.body.style.color = isDarkMode ? '#fff' : '#000';
  modeBtn.textContent = isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode';
});

addTaskBtn.addEventListener('click', addTask);
taskNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

clearBtn.addEventListener('click', () => {
  if (confirm('Clear all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.json';
  a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener('click', () => importFileInput.click());

importFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedTasks = JSON.parse(event.target.result);
      if (Array.isArray(importedTasks)) {
        tasks = importedTasks;
        saveTasks();
        renderTasks();
      } else {
        alert('Invalid task data.');
      }
    } catch {
      alert('Failed to read file.');
    }
  };
  reader.readAsText(file);
});

function addTask() {
  const name = taskNameInput.value.trim();
  if (!name) return;
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
  taskDueInput.value = '';
  taskTagsInput.value = '';
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';

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
    if (task.completed) nameSpan.style.textDecoration = 'line-through';

    const prioritySpan = document.createElement('span');
    prioritySpan.innerText = task.priority;
    prioritySpan.style.marginLeft = '10px';
    prioritySpan.style.padding = '2px 6px';
    prioritySpan.style.borderRadius = '8px';
    prioritySpan.style.fontSize = '12px';
    prioritySpan.style.backgroundColor =
      task.priority === 'High' ? '#dc3545' :
      task.priority === 'Medium' ? '#ffc107' : '#28a745';
    prioritySpan.style.color = '#fff';

    headerDiv.appendChild(checkbox);
    headerDiv.appendChild(nameSpan);
    headerDiv.appendChild(prioritySpan);

    const infoDiv = document.createElement('div');
    if (task.dueDate) {
      const dueSpan = document.createElement('span');
      dueSpan.innerText = `📅 ${task.dueDate}`;
      infoDiv.appendChild(dueSpan);
    }

    if (task.tags.length) {
      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'task-tags';
      task.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.innerText = tag;
        tagsDiv.appendChild(tagSpan);
      });
      infoDiv.appendChild(tagsDiv);
    }

    detailsDiv.appendChild(headerDiv);
    detailsDiv.appendChild(infoDiv);

    const btnDiv = document.createElement('div');

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = 'Delete Task';
    deleteBtn.addEventListener('click', () => deleteTask(index));

    btnDiv.appendChild(deleteBtn);

    li.appendChild(detailsDiv);
    li.appendChild(btnDiv);
    taskList.appendChild(li);
  });
}
