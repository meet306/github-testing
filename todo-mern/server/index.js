require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-mern')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));

// Routes
app.use('/api/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
