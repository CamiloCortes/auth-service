require('dotenv').config();
const express = require('express');
const cors = require('cors');
const redisClient = require('./config/redisClient');
const traceMiddleware = require('./middlewares/traceMiddleware');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
app.use(traceMiddleware);
app.use(cors({ origin: process.env.FRONT_ALLOWED_ORIGIN }));
app.use(express.json());
const PORT = process.env.PORT || 3001;

app.use('/auth', authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Auth Service corriendo en puerto ${PORT}`);
});