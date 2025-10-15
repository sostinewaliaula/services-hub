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
const categoriesPath = path.join(__dirname, 'src', 'categories.json');

// Services endpoints
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

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const data = await fs.readFile(categoriesPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).send('Error reading categories');
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    await fs.writeFile(categoriesPath, JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Error saving categories');
  }
});

app.post('/api/categories/add', async (req, res) => {
  try {
    const data = await fs.readFile(categoriesPath, 'utf8');
    const categories = JSON.parse(data);
    
    // Check if category ID already exists
    if (categories.find(cat => cat.id === req.body.id)) {
      return res.status(400).send('Category ID already exists');
    }
    
    categories.push(req.body);
    await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2));
    res.json(req.body);
  } catch (err) {
    res.status(500).send('Error adding category');
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const data = await fs.readFile(categoriesPath, 'utf8');
    const categories = JSON.parse(data);
    const index = categories.findIndex(cat => cat.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).send('Category not found');
    }
    
    // Check if new ID conflicts with existing categories (if ID is being changed)
    if (req.body.id !== req.params.id && categories.find(cat => cat.id === req.body.id)) {
      return res.status(400).send('Category ID already exists');
    }
    
    categories[index] = req.body;
    await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2));
    res.json(req.body);
  } catch (err) {
    res.status(500).send('Error updating category');
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const data = await fs.readFile(categoriesPath, 'utf8');
    const categories = JSON.parse(data);
    
    // Check if category is in use by services
    const servicesData = await fs.readFile(servicesPath, 'utf8');
    const services = JSON.parse(servicesData);
    const servicesUsingCategory = services.filter(service => service.category === req.params.id);
    
    if (servicesUsingCategory.length > 0) {
      return res.status(400).send(`Cannot delete category: ${servicesUsingCategory.length} service(s) are using this category`);
    }
    
    const filteredCategories = categories.filter(cat => cat.id !== req.params.id);
    
    if (filteredCategories.length === categories.length) {
      return res.status(404).send('Category not found');
    }
    
    await fs.writeFile(categoriesPath, JSON.stringify(filteredCategories, null, 2));
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Error deleting category');
  }
});

// Status check endpoint to avoid CORS issues
app.post('/api/check-status', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).send('URL is required');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      // Try multiple methods
      let response;
      
      // Method 1: Try HEAD request
      try {
        response = await fetch(url, { 
          method: 'HEAD', 
          signal: controller.signal,
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
      } catch (headError) {
        // Method 2: Try GET request
        response = await fetch(url, { 
          method: 'GET', 
          signal: controller.signal,
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
      }

      clearTimeout(timeout);
      
      const isOnline = response.ok;
      res.json({ 
        url, 
        status: isOnline ? 'online' : 'offline',
        statusCode: response.status,
        statusText: response.statusText
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      res.json({ 
        url, 
        status: 'offline',
        error: fetchError.message
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Status check failed' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
