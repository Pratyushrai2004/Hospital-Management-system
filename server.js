const express = require('express');
const app = express();
require('dotenv').config()
const dbConfig = require("./config/dbConfig")
app.use(express.json());
const userRoutes = require("./routes/userRoutes")
const adminRoutes = require('./routes/adminRoutes')
const doctorRoutes = require("./routes/doctorsRoutes")
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`node server started at ${port}`))