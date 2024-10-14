// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const port = 3000;
require('dotenv').config()

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Route to handle ChatGPT API request
app.post('/chat', async (req, res) => {
    let userInput = req.body.message;  // Message sent by the user
    const massage = `${userInput} give me the responce in a paragraph format and don't include any headings, give response without loosing any information, act as a Fitness chatbot`
    try {
        const fetch = (await import('node-fetch')).default; // Use dynamic import for fetch
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{"role": "user", "content": massage}]
            })
        });

        const data = await response.json();
        const chatResponse = data.choices[0].message.content;
        res.json({ response: chatResponse });

    } catch (error) {
        console.error("Error communicating with ChatGPT API:", error);
        res.status(500).json({ error: "Failed to get a response from ChatGPT" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
