import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("medium");

  const [dark, setDark] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
  }, [dark]);

  // ADD TASK
  const addTask = () => {
    if (!task.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task,
        done: false,
        priority,
        createdAt: new Date().toLocaleString(),
        completedAt: null,
      },
    ]);

    setTask("");
  };

  // TOGGLE DONE
  const toggleDone = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              done: !t.done,
              completedAt: !t.done ? new Date().toLocaleString() : null,
            }
          : t
      )
    );
  };

  // DELETE
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // EDIT
  const startEdit = (t) => {
    setEditingId(t.id);
    setEditText(t.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;

    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text: editText } : t
      )
    );

    setEditingId(null);
    setEditText("");
  };

  // FILTER + SEARCH
  const filteredTasks = tasks.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  const activeTasks = filteredTasks.filter((t) => !t.done);
  const completedTasks = filteredTasks.filter((t) => t.done);

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks.length / tasks.length) * 100);

  return (
    <div className="app">

      {/* HEADER */}
      <div className="header">

        <div className="titleBox">
          <h2>🗂 Task Manager</h2>
          <p>Organize your productivity</p>
        </div>

        <div className="statsBox">

          <div className="stat">
            <span>Total</span>
            <b>{tasks.length}</b>
          </div>

          <div className="stat">
            <span>Active</span>
            <b>{activeTasks.length}</b>
          </div>

          <div className="stat done">
            <span>Done</span>
            <b>{completedTasks.length}</b>
          </div>

          <div className="stat progress">
            <span>Progress</span>
            <b>{progress}%</b>
          </div>

          <button className="themeBtn" onClick={() => setDark(!dark)}>
            {dark ? "☀️" : "🌙"}
          </button>

        </div>

      </div>

      {/* SEARCH */}
      <input
        className="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
      />

      {/* INPUT */}
      <div className="inputBox">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add new task..."
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button onClick={addTask}>Add</button>
      </div>

      {/* BOARDS */}
      <div className="boards">

        {/* ACTIVE */}
        <div className="column">
          <h3>Active</h3>

          {activeTasks.map((t) => (
            <div className="card" key={t.id}>

              {editingId === t.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />

                  <div className="actions">
                    <button onClick={() => saveEdit(t.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    {t.text}
                    <span className={`badge ${t.priority}`}>
                      {t.priority}
                    </span>
                  </p>

                  <small className="date">
                    Created: {t.createdAt}
                  </small>

                  <div className="actions">
                    <button onClick={() => toggleDone(t.id)}>✓</button>
                    <button onClick={() => startEdit(t)}>Edit</button>
                    <button onClick={() => deleteTask(t.id)}>Delete</button>
                  </div>
                </>
              )}

            </div>
          ))}
        </div>

        {/* COMPLETED */}
        <div className="column">
          <h3>Completed</h3>

          {completedTasks.map((t) => (
            <div className="card done" key={t.id}>
              <p>{t.text}</p>

              <small className="date">
                Completed: {t.completedAt}
              </small>

              <div className="actions">
                <button onClick={() => toggleDone(t.id)}>↩</button>
                <button onClick={() => deleteTask(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;