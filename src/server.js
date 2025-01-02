const { GoogleGenerativeAI } = require('@google/generative-ai');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const apiKey = process.env.API_KEY;
const treinamento = process.env.TREINAMENTO;

const genAI = new GoogleGenerativeAI(apiKey);

app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

app.post('/ask', async (req, res) => {
    const userMessage = req.body.message;
    const userMessagesHistory = req.body.history;
    
    console.log(userMessagesHistory);

    try {

        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.1,
          },
          systemInstruction: treinamento
        });
        const chat = model.startChat({
            history: userMessagesHistory
        });

        const result = await chat.sendMessage(userMessage);
        const botMessage = result.response.text();

        console.log(botMessage);
        
        res.json({ reply: botMessage });
        
    } catch (error) {
        console.error('Erro ao se comunicar com a API:', error);
        res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});

module.exports = app;
