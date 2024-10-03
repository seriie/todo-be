const express = require('express');
const router = express.Router();
const { TASK_PATH } = require('../config')

let todos = [];

// Get all todos
router.get('/', (req, res) => {
  res.json(todos);
});

// Add a new todo
router.post('/', (req, res) => {
  const { text } = req.body;
  const newTodo = { id: todos.length, text, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
  console.log('new todo: ' + JSON.stringify(newTodo))
});

// Delete a todo by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo.id !== parseInt(id, 10));
  res.status(204).end();
});

// Toggle a todo's completion status
router.put('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const todo = todos.find(todo => todo.id === parseInt(id, 10));
  if (todo) {
    console.log(todo);
    todo.completed = !todo.completed;
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});
console.log('todo: ', todos);
module.exports = router;
