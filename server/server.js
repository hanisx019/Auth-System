import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import MongoDB from './config/mongodb.js';
import authRoutes from './routes/userAuthRoutes.js'
import userRoute from './routes/userRoutes.js';
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));


app.get('/', (req, res) => res.send('Welcome to the express server!'));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);


app.listen(PORT, () => console.log(`
==========================================
🚀 Server is live!
🌐 http://localhost:${PORT}
==========================================
`));
