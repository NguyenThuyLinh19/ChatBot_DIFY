const express = require('express');
const app = express();
const port = 3000;

// Middleware để xử lý dữ liệu JSON trong POST request
app.use(express.json());

//dinh nghia mot route co ban GET
app.get('/', (req, res) => {
    res.send('day la API cua THUYLYINK');
});

//dinh nghia mot route GET de tra ve du lien JSON
app.get('/api/data', (req, res) => {
    res.json({ message: 'Day la du lieu tu API' });
});

//dinh nghia mot route post de nhan va tra du lieu
app.post('/api/data', (req, res) => {
    const requestData = req.body;
    res.json({
        message: 'Du lieu da nhan',
        receivedData: requestData,
    });
});

app.listen(port, () => {
    console.log(`Server dang chay tai http://localhost:${port}`);
});