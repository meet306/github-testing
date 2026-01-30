import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
// this is for testing perspose for my new n8n project
function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/todos';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await axios.post(API_URL, { text: input });
      setTodos([res.data, ...todos]);
      setInput('');
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTodos(todos.map(todo => todo._id === id ? res.data : todo));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-container">
        <h1 style={{
          fontSize: '2.5em',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #646cff, #ff0080)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ✨ Task Master
        </h1>

        <form onSubmit={addTodo} style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button type="submit">Add Task</button>
        </form>

        <div className="todo-list">
          {loading ? (
            <p>Loading tasks...</p>
          ) : todos.length === 0 ? (
            <p style={{ opacity: 0.6 }}>No tasks yet. Add one above! 🚀</p>
          ) : (
            todos.map(todo => (
              <div key={todo._id} className="todo-item">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo._id, todo.completed)}
                />
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo._id)}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
