require('dotenv').config();
const express = require('express');
const path = require('path');
const congratsRoute = require('./routes/congrats');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/congrats', congratsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
