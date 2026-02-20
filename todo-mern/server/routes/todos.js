const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create todo
router.post('/', async (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update todo
router.put('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        if (req.body.text != null) {
            todo.text = req.body.text;
        }
        if (req.body.completed != null) {
            todo.completed = req.body.completed;
        }

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete todo
router.delete('/:id', async (req, res) => {
    try {
         const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid ID format' });
        }

        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
