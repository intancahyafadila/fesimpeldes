const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection string dengan password yang benar
const uri = "mongodb+srv://intancahyafadila59:ebDIcFvBg532mFxX@cluster0.mve4tmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// MongoDB ping function
async function pingMongoDB() {
    try {
        console.log('Attempting to connect to MongoDB...');
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");

        return { success: true, message: "Successfully connected to MongoDB!" };
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        return { success: false, message: error.message };
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

// Helper function to get database connection
async function getDatabase() {
    await client.connect();
    return client.db("pengaduan"); // Database name
}

// API endpoint untuk ping MongoDB
app.post('/api/ping-mongo', async (req, res) => {
    try {
        console.log('🔄 Received ping request...');
        const result = await pingMongoDB();

        if (result.success) {
            res.json({
                status: 'connected',
                message: result.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: result.message,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

// CRUD Endpoints untuk Pengaduan

// 1. CREATE - Membuat pengaduan baru
app.post('/api/pengaduan', async (req, res) => {
    try {
        const { userId, title, description } = req.body;

        if (!userId || !title || !description) {
            return res.status(400).json({
                error: 'Missing required fields: userId, title, description'
            });
        }

        const db = await getDatabase();
        const collection = db.collection('pengaduan');

        const newPengaduan = {
            userId: new ObjectId(userId),
            title,
            description,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(newPengaduan);

        res.status(201).json({
            message: 'Pengaduan berhasil dibuat',
            pengaduanId: result.insertedId,
            data: { ...newPengaduan, _id: result.insertedId }
        });

    } catch (error) {
        console.error('Error creating pengaduan:', error);
        res.status(500).json({ error: 'Failed to create pengaduan' });
    } finally {
        await client.close();
    }
});

// 2. READ - Mendapatkan semua pengaduan
app.get('/api/pengaduan', async (req, res) => {
    try {
        const { userId, status, page = 1, limit = 10 } = req.query;

        const db = await getDatabase();
        const collection = db.collection('pengaduan');

        // Build filter
        const filter = {};
        if (userId) filter.userId = new ObjectId(userId);
        if (status) filter.status = status;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const pengaduan = await collection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        const total = await collection.countDocuments(filter);

        res.json({
            data: pengaduan,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Error fetching pengaduan:', error);
        res.status(500).json({ error: 'Failed to fetch pengaduan' });
    } finally {
        await client.close();
    }
});

// 3. READ - Mendapatkan pengaduan berdasarkan ID
app.get('/api/pengaduan/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid pengaduan ID' });
        }

        const db = await getDatabase();
        const collection = db.collection('pengaduan');

        const pengaduan = await collection.findOne({ _id: new ObjectId(id) });

        if (!pengaduan) {
            return res.status(404).json({ error: 'Pengaduan not found' });
        }

        res.json({ data: pengaduan });

    } catch (error) {
        console.error('Error fetching pengaduan by ID:', error);
        res.status(500).json({ error: 'Failed to fetch pengaduan' });
    } finally {
        await client.close();
    }
});

// 4. UPDATE - Mengupdate pengaduan
app.put('/api/pengaduan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid pengaduan ID' });
        }

        const db = await getDatabase();
        const collection = db.collection('pengaduan');

        const updateData = {
            updatedAt: new Date()
        };

        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (status && ['open', 'in-progress', 'closed'].includes(status)) {
            updateData.status = status;
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Pengaduan not found' });
        }

        const updatedPengaduan = await collection.findOne({ _id: new ObjectId(id) });

        res.json({
            message: 'Pengaduan berhasil diupdate',
            data: updatedPengaduan
        });

    } catch (error) {
        console.error('Error updating pengaduan:', error);
        res.status(500).json({ error: 'Failed to update pengaduan' });
    } finally {
        await client.close();
    }
});

// 5. DELETE - Menghapus pengaduan
app.delete('/api/pengaduan/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid pengaduan ID' });
        }

        const db = await getDatabase();
        const collection = db.collection('pengaduan');

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Pengaduan not found' });
        }

        res.json({ message: 'Pengaduan berhasil dihapus' });

    } catch (error) {
        console.error('Error deleting pengaduan:', error);
        res.status(500).json({ error: 'Failed to delete pengaduan' });
    } finally {
        await client.close();
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        server: 'running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 MongoDB ping endpoint: http://localhost:${PORT}/api/ping-mongo`);
    console.log(`📋 Pengaduan CRUD endpoints:`);
    console.log(`   POST   /api/pengaduan`);
    console.log(`   GET    /api/pengaduan`);
    console.log(`   GET    /api/pengaduan/:id`);
    console.log(`   PUT    /api/pengaduan/:id`);
    console.log(`   DELETE /api/pengaduan/:id`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await client.close();
    process.exit(0);
}); 