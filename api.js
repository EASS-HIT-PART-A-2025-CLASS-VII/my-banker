const express = require('express');
const app = express();
const port = 8000;

// Route for the root path
app.get('/', (req, res) => {
    res.status(200).send('Server is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
