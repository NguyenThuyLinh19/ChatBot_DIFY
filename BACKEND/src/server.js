require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/viewEngine')
const webRoutes = require('./routes/web')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME;

app.use(cors({
    origin: "http://localhost:3000", // Cổng frontend
    credentials: true, // Nếu frontend gửi cookie hoặc token
}))
//config template Engine
configViewEngine(app);

app.use(bodyParser.json());

//khai báo routes
app.use('/', webRoutes)
app.use('/api', userRoutes);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`);
})