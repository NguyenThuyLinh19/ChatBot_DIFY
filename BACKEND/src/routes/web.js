const express = require('express')
const router = express.Router()
const { getHomePage } = require('../controllers/homeController')
router.get('/', getHomePage)

router.get('/sp', (req, res) => {
    // res.send('Hello World')
    res.render('sample.ejs');
})

module.exports = router;