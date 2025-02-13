const path = require('path');
const express = require('express')

const configViewEngine = (app) => {
    //khai báo nơi lưu trữ template engine
    app.set('views', path.join('./src', 'views'));
    //định nghĩa template sử dụng 
    app.set('views engine', 'ejs');
    //config = cấu hình static files
    app.use(express.static(path.join('./src', 'public')))
}

module.exports = configViewEngine;