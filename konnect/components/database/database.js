class Database {
    constructor(name) {
        this.name = name;
        this.ip = "localhost"
    }

    async get() {
        const res = await fetch(`http://${this.ip}:8000/api/${this.name}`);
        const data = await res.json();
        return data;
    }

    async getById(id) {
        const res = await fetch(`http://${this.ip}:8000/api/${this.name}/${id}`);
        const data = await res.json();
        return data;
    }

    async add(data) {
        try {
            const response = await fetch(`http://${this.ip}:8000/api/${this.name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP Hatası: ${response.status}`);
            }

            const addedData = await response.json();
            console.log('Yeni kullanıcı eklendi:', addedData);
        } catch (error) {
            console.error('Kullanıcı eklenirken hata:', error);
        }
    }

    async addById(id, data) {
        try {
            const response = await fetch(`http://${this.ip}:8000/api/${this.name}/${id}`, {
                method: 'PUT', // Güncellemeler için PUT kullanılıyor
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP Hatası: ${response.status}`);
            }

            const updatedData = await response.json();
            console.log('Kayıt güncellendi:', updatedData);
        } catch (error) {
            console.error('Kayıt güncellenirken hata:', error);
        }
    }




}

module.exports = Database;