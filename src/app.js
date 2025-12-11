const express = require('express');
const logger = require('./middleware/logger');
const todosRouter = require('./routes/todos');

const app = express();

// Middleware для обработки JSON
app.use(express.json());

// Middleware для обработки URL-encoded данных
app.use(express.urlencoded({ extended: true }));

// Кастомный middleware для логирования
app.use(logger);

// Раздача статических файлов
app.use(express.static('public'));

// Основной маршрут
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// Маршруты для задач
app.use('/api/todos', todosRouter);

// Обработка 404 ошибок
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка ошибок сервера
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

module.exports = app;