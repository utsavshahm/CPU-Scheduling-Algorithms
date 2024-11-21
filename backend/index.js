import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';
// import 'dotenv/config'

const app = express();
const PORT = 5000;


app.use(cors());
app.options('*', cors());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.use(express.json());

// Routes
app.use('/api/scheduler', routes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});