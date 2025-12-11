// Кастомный middleware для логирования запросов
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Логирование тела запроса для POST/PUT запросов
  if (['POST', 'PUT'].includes(method)) {
    console.log('📦 Тело запроса:', req.body);
  }
  
  // Логирование query-параметров
  if (Object.keys(req.query).length > 0) {
    console.log('🔍 Query-параметры:', req.query);
  }
  
  // Логирование параметров маршрута
  if (Object.keys(req.params).length > 0) {
    console.log('📍 Параметры маршрута:', req.params);
  }
  
  next();
};

module.exports = logger;