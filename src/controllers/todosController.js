const fs = require('fs').promises;
const path = require('path');

// Путь к файлу с данными
const dataPath = path.join(__dirname, '../data/todos.json');

// Вспомогательная функция для чтения данных
const readData = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения данных:', error);
    return { todos: [] };
  }
};

// Вспомогательная функция для записи данных
const writeData = async (data) => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Ошибка записи данных:', error);
    throw error;
  }
};

// Получить все задачи
const getAllTodos = async (req, res) => {
  try {
    const data = await readData();
    
    // Фильтрация по дню недели (query параметр)
    if (req.query.day) {
      const filteredTodos = data.todos.filter(todo => 
        todo.day.toLowerCase() === req.query.day.toLowerCase()
      );
      return res.json(filteredTodos);
    }
    
    // Фильтрация по статусу выполнения
    if (req.query.completed !== undefined) {
      const isCompleted = req.query.completed === 'true';
      const filteredTodos = data.todos.filter(todo => 
        todo.completed === isCompleted
      );
      return res.json(filteredTodos);
    }
    
    // Фильтрация по приоритету
    if (req.query.priority) {
      const filteredTodos = data.todos.filter(todo => 
        todo.priority === req.query.priority
      );
      return res.json(filteredTodos);
    }
    
    // Если нет фильтров - возвращаем все задачи
    res.json(data.todos);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении задач' });
  }
};

// Получить задачу по ID
const getTodoById = async (req, res) => {
  try {
    const data = await readData();
    const todo = data.todos.find(t => t.id === parseInt(req.params.id));
    
    if (!todo) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении задачи' });
  }
};

// Создать новую задачу
const createTodo = async (req, res) => {
  try {
    const data = await readData();
    
    // Валидация
    const { day, task, time, priority } = req.body;
    if (!day || !task || !time) {
      return res.status(400).json({ 
        error: 'Поля day, task и time обязательны' 
      });
    }
    
    // Создание новой задачи
    const newTodo = {
      id: data.todos.length > 0 ? Math.max(...data.todos.map(t => t.id)) + 1 : 1,
      day,
      task,
      time,
      completed: false,
      priority: priority || 'medium',
      createdAt: new Date().toISOString()
    };
    
    data.todos.push(newTodo);
    await writeData(data);
    
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании задачи' });
  }
};

// Обновить задачу
const updateTodo = async (req, res) => {
  try {
    const data = await readData();
    const index = data.todos.findIndex(t => t.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    // Обновление полей
    const updatedTodo = {
      ...data.todos[index],
      ...req.body,
      id: data.todos[index].id // Защищаем ID от изменения
    };
    
    data.todos[index] = updatedTodo;
    await writeData(data);
    
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении задачи' });
  }
};

// Удалить задачу
const deleteTodo = async (req, res) => {
  try {
    const data = await readData();
    const index = data.todos.findIndex(t => t.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    const deletedTodo = data.todos[index];
    data.todos.splice(index, 1);
    await writeData(data);
    
    res.json({ 
      message: 'Задача удалена', 
      deletedTodo 
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении задачи' });
  }
};

// Получить задачи по дню недели
const getTodosByDay = async (req, res) => {
  try {
    const data = await readData();
    const day = req.params.day;
    
    const todos = data.todos.filter(todo => 
      todo.day.toLowerCase() === day.toLowerCase()
    );
    
    if (todos.length === 0) {
      return res.status(404).json({ 
        error: `Задачи на ${day} не найдены` 
      });
    }
    
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении задач по дню' });
  }
};

// Отметить задачу как выполненную/невыполненную
const toggleTodo = async (req, res) => {
  try {
    const data = await readData();
    const index = data.todos.findIndex(t => t.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    data.todos[index].completed = !data.todos[index].completed;
    await writeData(data);
    
    res.json(data.todos[index]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при изменении статуса задачи' });
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosByDay,
  toggleTodo
};