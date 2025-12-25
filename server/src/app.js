const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('../src/routes/authRoutes');
const ticketRoutes = require('../src/routes/ticketRoutes');
const adminRoutes = require('../src/routes/adminRoutes');
const errorHandler = require('../src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// health check route
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "Inovite Support API is running" });
});

// TODO: later – mount auth, ticket, admin routes here
app.use("/api/auth", authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

module.exports = app;
