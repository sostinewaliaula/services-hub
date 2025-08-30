import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3001;

app.use(express.json());

const servicesPath = path.join(__dirname, 'src', 'services.json');

app.get('/api/services', async (req, res) => {
  try {
    const data = await fs.readFile(servicesPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).send('Error reading services');
  }
});

app.post('/api/services', async (req, res) => {
  try {
    await fs.writeFile(servicesPath, JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Error saving services');
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
