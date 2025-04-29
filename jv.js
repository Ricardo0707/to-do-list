document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const filterButtons = document.querySelectorAll(".filter");
    const toggleThemeBtn = document.getElementById("toggle-theme");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let theme = localStorage.getItem("theme") || "light";

    if (theme === "dark") {
        document.body.classList.add("darkmode");
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks(filter = "all") {
        taskList.innerHTML = "";

        tasks.forEach((task, index) => {
            if (filter === "pending" && task.completed) return;
            if (filter === "completed" && !task.completed) return;

            const li = document.createElement("li");
            if (task.completed) {
                li.classList.add("completed");
            }

            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div>
                    <button class="edit" data-index="${index}">✏️</button>
                    <button class="delete" data-index="${index}">🗑️</button>
                </div>
            `;

            li.addEventListener("click", (e) => {
                if (e.target.classList.contains("delete")) {
                    tasks.splice(index, 1);
                } else if (e.target.classList.contains("edit")) {
                    const newText = prompt("Editar tarefa:", task.text);
                    if (newText) tasks[index].text = newText;
                } else {
                    tasks[index].completed = !tasks[index].completed;
                }
                saveTasks();
                renderTasks(filter);
            });

            taskList.appendChild(li);
        });
    }

    addTaskBtn.addEventListener("click", () => {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = "";
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            renderTasks(button.dataset.filter);
        });
    });

    toggleThemeBtn.addEventListener("click", () => {
        document.body.classList.toggle("darkmode");
        theme = document.body.classList.contains("darkmode") ? "dark" : "light";
        localStorage.setItem("theme", theme);
    });

    renderTasks();
});
