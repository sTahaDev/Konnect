const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JSON dosyalarının bulunduğu klasör
const DATABASE_PATH = './database';

// WEB SOCKET
// Sunucu oluşturma
const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket sunucusu 8080 portunda çalışıyor.');

wss.on('connection', (ws) => {
    console.log('Bir istemci bağlandı.');

    // Mesaj alındığında
    ws.on('message', (message) => {
        console.log('Mesaj alındı:', message.toString());
        // Mesajı istemciye geri gönderme
        ws.send(`Aldım: ${message}`);
    });

    // Bağlantı kapandığında
    ws.on('close', () => {
        console.log('Bağlantı kapandı.');
    });
});

// Yardımcı fonksiyonlar
async function readJsonFile(filename) {
    try {
        const filePath = path.join(DATABASE_PATH, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Dosya yoksa boş bir array döndür
            return [];
        }
        throw error;
    }
}

async function writeJsonFile(filename, data) {
    const filePath = path.join(DATABASE_PATH, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 4));
}

// Tüm kayıtları getir
app.get('/api/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        const data = await readJsonFile(`${collection}.json`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ID'ye göre tek kayıt getir
app.get('/api/:collection/:id', async (req, res) => {
    try {
        const { collection, id } = req.params;
        const data = await readJsonFile(`${collection}.json`);
        const item = data.find(item => item.id === parseInt(id));
        
        if (!item) {
            return res.status(404).json({ error: 'Kayıt bulunamadı' });
        }
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Yeni kayıt ekle
app.post('/api/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        const data = await readJsonFile(`${collection}.json`);
        
        // Yeni ID oluştur
        const maxId = data.reduce((max, item) => Math.max(max, item.id || 0), 0);
        const newItem = { id: maxId + 1, ...req.body };
        
        data.push(newItem);
        await writeJsonFile(`${collection}.json`, data);
        
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Kayıt güncelle
app.put('/api/:collection/:id', async (req, res) => {
    try {
        const { collection, id } = req.params;
        const data = await readJsonFile(`${collection}.json`);
        
        const index = data.findIndex(item => item.id === parseInt(id));
        if (index === -1) {
            return res.status(404).json({ error: 'Kayıt bulunamadı' });
        }
        
        data[index] = { ...data[index], ...req.body, id: parseInt(id) };
        await writeJsonFile(`${collection}.json`, data);
        
        res.json(data[index]);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send("updateScreen-"+ id);
                
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Kayıt sil
app.delete('/api/:collection/:id', async (req, res) => {
    try {
        const { collection, id } = req.params;
        const data = await readJsonFile(`${collection}.json`);
        
        const filteredData = data.filter(item => item.id !== parseInt(id));
        
        if (filteredData.length === data.length) {
            return res.status(404).json({ error: 'Kayıt bulunamadı' });
        }
        
        await writeJsonFile(`${collection}.json`, filteredData);
        res.json({ message: 'Kayıt başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} adresinde çalışıyor`);
}); 





