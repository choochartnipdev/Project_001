const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Endpoint: POST /api/items
 * Description: บันทึกข้อมูล item ลง Database
 */
app.post('/api/items', async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
      return res.status(400).json({ error: 'Name and Image URL are required' });
    }

    const { data, error } = await supabase
      .from('items')
      .insert([{ name, image_url: imageUrl }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Success', data });
  } catch (error) {
    console.error('Backend Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Endpoint: GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// สำหรับรันบน Local Development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
