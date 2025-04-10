const express = require('express');
const cors = require('cors');
const app = express();
const controller_bank = require('./routes/bank');

app.use(express.json());

app.use(cors());

app.use('/bank', controller_bank);

app.get('/', (req, res) => res.redirect('/bank'))

app.listen(5000, () => {
    try {
        console.log("Server is running on http://localhost:5000");
    } catch (error) {
        console.error(error);
    }
})