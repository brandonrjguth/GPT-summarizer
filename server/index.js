const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = /*Your API Key Here*/;
const API_URL = 'https://api.openai.com/v1/chat/completions';

app.post('/gpt', async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt.maxTokens);

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt.prompt,
          },
        ],
        max_tokens: prompt.maxTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      }
    );

    const result = response.data.choices[0].message.content.trim();
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing the request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
