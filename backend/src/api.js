const express = require('express');
const connectDB = require('./database/db');
const cors = require('cors');

const app = express();
const port = 8000;

connectDB();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authenticationRoute');
const report = require('./routes/reportRoute');

app.use('/auth', authRoutes);
app.use('/report', report);

app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});