// Кастомный middleware для логирования запросов
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  

  if (['POST', 'PUT'].includes(method)) {
    console.log('Тело запроса:', req.body);
  }

  if (Object.keys(req.query).length > 0) {
    console.log('Query-параметры:', req.query);
  }
  

  if (Object.keys(req.params).length > 0) {
    console.log('Параметры маршрута:', req.params);
  }
  
  next();
};

module.exports = logger;