const express = require('express');
const app = express();
const hbs = require('hbs');
const request = require('request');

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.set('views', './views');
app.use(express.static('public'));
app.use(express.static('dist'));
app.use(express.json());

app.get('/', function(request, response) {
  response.render('index.html');
});

app.get('/verify', (req, res) => {
  res.render('verify.html');
});

app.post('/result', (req, res) => {
  res.render('result.html');
});

exports['web-otp-demo'] = app;
