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

router.get('/', getAllTodos);

router.get('/day/:day', getTodosByDay);

router.get('/:id', getTodoById);

router.post('/', createTodo);

router.put('/:id', updateTodo);

router.patch('/:id/toggle', toggleTodo);

router.delete('/:id', deleteTodo);

module.exports = router;