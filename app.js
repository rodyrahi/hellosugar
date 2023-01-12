const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { title: "My Express App" });
});

app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
