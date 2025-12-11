const express = require('express');
const router = express.Router();
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosByDay,
  toggleTodo
} = require('../controllers/todosController');

// GET /api/todos - получить все задачи (с фильтрацией через query)
router.get('/', getAllTodos);

// GET /api/todos/day/:day - получить задачи по дню недели
router.get('/day/:day', getTodosByDay);

// GET /api/todos/:id - получить задачу по ID
router.get('/:id', getTodoById);

// POST /api/todos - создать новую задачу
router.post('/', createTodo);

// PUT /api/todos/:id - обновить задачу
router.put('/:id', updateTodo);

// PATCH /api/todos/:id/toggle - переключить статус выполнения
router.patch('/:id/toggle', toggleTodo);

// DELETE /api/todos/:id - удалить задачу
router.delete('/:id', deleteTodo);

module.exports = router;