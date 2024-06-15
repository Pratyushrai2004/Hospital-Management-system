const express = require('express');
const app = express();
require('dotenv').config()
const dbConfig = require("./config/dbConfig")
app.use(express.json());
const userRoutes = require("./routes/userRoutes")

app.use('/api/user', userRoutes);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`node server started at ${port}`))