const { useState, useEffect } = React;

function getDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
}

function getTaskClass(task) {
    if (task.done || !task.deadline) {
        return "";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(task.deadline + "T00:00:00");
    const days = (deadline - today) / 86400000;

    if (days < 0) {
        return "overdue";
    }

    if (days <= 1) {
        return "urgent";
    }

    return "";
}

function App() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");

        if (savedTasks) {
            return JSON.parse(savedTasks);
        }

        return [
            { id: 1, title: "Сделать задание", done: false, deadline: getDate(1) },
            { id: 2, title: "Сдать работу", done: false, deadline: getDate(-1) }
        ];
    });
    const [title, setTitle] = useState("");
    const [deadline, setDeadline] = useState(getDate(1));

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function addTask(event) {
        event.preventDefault();

        if (title.trim() === "") {
            return;
        }

        const task = {
            id: Date.now(),
            title: title,
            done: false,
            deadline: deadline
        };

        setTasks([...tasks, task]);
        setTitle("");
        setDeadline(getDate(1));
    }

    function toggleTask(id) {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                return { ...task, done: !task.done };
            }
            return task;
        }));
    }

    function removeTask(id) {
        setTasks(tasks.filter(task => task.id !== id));
    }

    return (
        <main>
            <h1>Todo-лист</h1>

            <form onSubmit={addTask}>
                <input
                    type="text"
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder="Новая задача"
                />
                <input
                    type="date"
                    value={deadline}
                    onChange={event => setDeadline(event.target.value)}
                />
                <button>Добавить</button>
            </form>

            {tasks.length === 0 ? (
                <p>Список пуст</p>
            ) : (
                <ul>
                    {tasks.map(task => (
                        <li key={task.id} className={getTaskClass(task)}>
                            <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => toggleTask(task.id)}
                            />
                            <div className="text">
                                <span className={task.done ? "done" : ""}>{task.title}</span>
                                <small>Дедлайн: {task.deadline}</small>
                            </div>
                            <button onClick={() => removeTask(task.id)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

