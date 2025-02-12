const express = require('express');
const path = require('path');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME;

//khai báo nơi lưu trữ template engine
app.set('views', path.join(__dirname, 'views'));
//định nghĩa template sử dụng 
app.set('views engine', 'ejs');

//config = cấu hình static files
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.send('Hello World & nodemon');
})

app.get('/sp', (req, res) => {
    // res.send('Hello World')
    res.render('sample.ejs');
})

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`);
})