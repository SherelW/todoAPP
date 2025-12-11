const express = require('express');
const logger = require('./middleware/logger');
const todosRouter = require('./routes/todos');

const app = express();


app.use(express.json());


app.use(express.urlencoded({ extended: true }));


app.use(logger);


app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});


app.use('/api/todos', todosRouter);


app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

module.exports = app;