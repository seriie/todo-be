const express = require('express');
const router = express.Router();
const { TASK_PATH } = require('../config');
const fs = require('fs');

let todos = [];

// Load tasks from task.json when the server starts
fs.readFile(TASK_PATH, 'utf-8', (err, jsonData) => {
  if (err) {
    console.error('Error reading task file:', err);
  } else {
    try {
      todos = JSON.parse(jsonData); // Load tasks into memory
      console.log('Loaded todos from task.json:', todos);
    } catch (e) {
      console.error('Error parsing task data:', e);
    }
  }
});

// Get all todos
router.get('/', (req, res) => {
  res.json(todos);
});

// Add a new todo
router.post('/', (req, res) => {
  const { text } = req.body;
  const newTodo = { id: todos.length, text, completed: false };
  todos.push(newTodo);

  fs.readFile(TASK_PATH, 'utf-8', (err, jsonData) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).send('Internal server error');
    }

    let data = [];

    try {
      data = JSON.parse(jsonData);
    } catch (e) {
      console.error('Error parsing JSON data:', e);
    }

    data.push(newTodo);

    fs.writeFile(TASK_PATH, JSON.stringify(data, null, 2), 'utf-8', (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
        return res.status(500).send('Internal server error');
      }

      console.log('Todo has been saved to task.json');
      console.log('Saved Todo:', newTodo);
    });
  });

  res.status(201).json(newTodo);
  console.log('new todo: ' + JSON.stringify(newTodo));
});

// Delete a todo by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo.id !== parseInt(id, 10));

  // Write the updated todos to file
  fs.writeFile(TASK_PATH, JSON.stringify(todos, null, 2), 'utf-8', (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
      return res.status(500).send('Internal server error');
    }
    console.log('Updated todos saved to task.json');
  });

  res.status(204).end();
});

// Toggle a todo's completion status
router.put('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const todo = todos.find(todo => todo.id === parseInt(id, 10));
  if (todo) {
    todo.completed = !todo.completed;

    // Write the updated todos to file
    fs.writeFile(TASK_PATH, JSON.stringify(todos, null, 2), 'utf-8', (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
        return res.status(500).send('Internal server error');
      }
      console.log('Updated todos saved to task.json');
    });

    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

console.log('todo: ', todos);
module.exports = router;