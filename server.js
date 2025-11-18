const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/src', express.static('src'));

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
