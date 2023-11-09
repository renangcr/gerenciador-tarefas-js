// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;
// Funções
const createButtonTodo = (classe,icone) => {
    const element = document.createElement('button');
    element.classList.add(classe);
    element.innerHTML = `<i class="fa-solid fa-${icone}"></i>`;

    return element;
};

const saveToDo = (text, done = 0, save = 1) => {
    const todo = document.createElement('div');
    todo.classList.add("todo");

    const taskToDo = document.createElement('h3');
    taskToDo.innerText = text;
    todo.appendChild(taskToDo);

    const finishBtn = createButtonTodo('finish-todo','check')
    todo.appendChild(finishBtn);

    const editBtn = createButtonTodo('edit-todo','pen');
    todo.appendChild(editBtn);

    const removeBtn = createButtonTodo('remove-todo','xmark')
    todo.appendChild(removeBtn);

    if(done){
        todo.classList.add("done");
    }

    if(save){
        saveToDoLocalStorage({text, done});
    }

    todoList.appendChild(todo);
    todoInput.value = '';
    todoInput.focus();
}

const toggleForms = () => {
    todoForm.classList.toggle('hide');
    editForm.classList.toggle('hide');
    todoList.classList.toggle('hide');
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll('.todo');

    todos.forEach(todo => {
        const editInput = todo.querySelector('h3');
        if(editInput.innerText === oldInputValue){
            editInput.innerText = text;

            updateToDoLocalStorage(oldInputValue, text);
        }
    });

    toggleForms();
}

const searchToDo = (text) => {
    const todos = document.querySelectorAll('.todo');

    todos.forEach(todo => {
        const titleToDo = todo.querySelector('h3').innerText.toLowerCase();

        todo.style.display = 'flex';
        
        if(!titleToDo.includes(text.toLowerCase())){
            todo.style.display = 'none';
        }
    });
}

const filterToDos = (selectValue) => {
    const todos = document.querySelectorAll('.todo');

    switch(selectValue){
        case "all" : 
            todos.forEach(todo => todo.style.display = 'flex');
        break;
        case "done":
            todos.forEach(todo => todo.classList.contains('done') ? (todo.style.display = 'flex') : todo.style.display = 'none');
        break;
        case 'todo':
            todos.forEach(todo => todo.classList.contains('done') ? (todo.style.display = 'none') : todo.style.display = 'flex');
        break;
        default:
        break;
    }
}

// Eventos
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputValue = todoInput.value.trim();

    if(!inputValue) return;

    saveToDo(inputValue);
});

document.addEventListener('click', (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");

    let todoTitle;

    if(parentEl && parentEl.querySelector('h3')){
        todoTitle = parentEl.querySelector('h3').innerText;
    }

    if(targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done");

        updateToDoStatusLocalStorage(todoTitle);
    }

    if(targetEl.classList.contains("remove-todo")){
        parentEl.remove();

        removeToDoLocalStorage(todoTitle);
    }

    if(targetEl.classList.contains("edit-todo")){
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

cancelEditBtn.addEventListener('click',(e) => {
    e.preventDefault();

    toggleForms();
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    editInputValue = editInput.value.trim();
    if(!editInputValue) return;

    updateTodo(editInputValue);
});

eraseBtn.addEventListener('click', (e) => {
    e.preventDefault();

    searchInput.value = '';

    searchInput.dispatchEvent(new Event('keyup'));
})

searchInput.addEventListener('keyup', (e) => {

    const searchInputValue = e.target.value;
    
    searchToDo(searchInputValue);
});

filterBtn.addEventListener('change', (e) => {
    const selectValue = e.target.value;

    filterToDos(selectValue);
})

// Local Storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
}

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach(todo => {
        saveToDo(todo.text,todo.done,0);
    })
}

const saveToDoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();

    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

const removeToDoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter(todo => todo.text !== todoText);

    localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

const updateToDoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    todos.map(todo => todo.text === todoText ? (todo.done = !todo.done) : null);

    localStorage.setItem("todos", JSON.stringify(todos));
}

const updateToDoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();

    todos.map(todo => todo.text === todoOldText ? (todo.text = todoNewText) : null);

    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos();