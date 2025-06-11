// Select DOM elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const clearBtn = document.getElementById('clear-btn');

// Load todos from local storage if available
let todos = JSON.parse(localStorage.getItem('todos')) || [];
renderTodos();

// Add new todo
addBtn.addEventListener('click', () => {
    const task = todoInput.value.trim();
    if (task) {
        todos.push(task);
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
});

// Add task on Enter key press
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

// Clear all todos
clearBtn.addEventListener('click', () => {
    todos = [];
    saveTodos();
    renderTodos();
});

// Function to render todos
function renderTodos() {
    // Clear existing list
    todoList.innerHTML = '';

    // If no todos, show message
    if (todos.length === 0) {
        todoList.innerHTML = '<p style="text-align:center;">No tasks yet!</p>';
        return;
    }

    // Create list items
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const span = document.createElement('span');
        span.innerText = todo;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';

        deleteBtn.addEventListener('click', () => {
            deleteTodo(index);
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// Function to delete individual todo
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

// Save todos to local storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}