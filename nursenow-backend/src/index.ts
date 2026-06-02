import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import paymentsRoutes from './routes/payments.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'NurseGo API is running smoothly' });
});

import https from 'https';

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Keep-Alive mechanism to prevent Render from sleeping and wiping SQLite DB
  const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_EXTERNAL_URL) {
    console.log(`Started Keep-Alive ping for ${RENDER_EXTERNAL_URL} every 10 minutes`);
    setInterval(() => {
      https.get(`${RENDER_EXTERNAL_URL}/health`, (res) => {
        console.log(`[Keep-Alive] Ping successful - Status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error('[Keep-Alive] Ping failed:', err.message);
      });
    }, 10 * 60 * 1000); // 10 minutes
  }
});
