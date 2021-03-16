import express from 'express';
import routes from './routers/auth';
import 'dotenv/config';

const app = express();
const port = 5000;

app.use(express.json());

const authRoute = routes;

app.use('/api', authRoute);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.listen(port, () => console.log(`Express server running on port ${port}`));
