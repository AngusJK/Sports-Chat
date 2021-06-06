const express = require('express');

const app = express();
const PORT = 3000;
const server = app.listen(PORT, () => {console.log(`Listening on port ${PORT}...`)});

app.use(express.static('public'));

