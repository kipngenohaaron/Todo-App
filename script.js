const addBtn = document.getElementById('add-btn');

addBtn.addEventListener('click', () => {
  const task = todoInput.value.trim();
  if (task) {
    todos.push({ text: task, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
  }
});