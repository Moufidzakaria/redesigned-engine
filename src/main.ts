import express from 'express';
import { PlaywrightCrawler } from 'crawlee';
import { MongoClient } from 'mongodb';
import { createClient } from 'redis';

const app = express();
const port = 3000;

async function main() {
    // --- MongoDB ---
    const mongoUri = process.env.MONGO_URL || 'mongodb://mongodb:27017/scrapingDB';
    const mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    const db = mongoClient.db('scrapingDB');
    const collection = db.collection('products');
    console.log('✅ MongoDB connecté');

    // --- Redis ---
    const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
    redisClient.on('error', (err) => console.log('Redis Error', err));
    await redisClient.connect();
    console.log('✅ Redis connecté');

    // --- Endpoint scrape ---
    app.get('/scrape', async (_req, res) => {
        const crawler = new PlaywrightCrawler({
            async requestHandler({ request, page, enqueueLinks, log }) {
                log.info(`Scraping ${request.url}`);

                const products = await page.$$eval('article.prd', (items) => {
                    return items.map((item) => {
                        const titleEl = item.querySelector('h3') || item.querySelector('a.core');
                        const title = titleEl?.textContent?.trim() || null;

                        let price: string | null = null;
                        const priceSelectors = ['span.-b.-ubpt.-tal.-fs24.-prxs', 'span[data-price]', 'div.prc'];
                        for (const sel of priceSelectors) {
                            const el = item.querySelector(sel);
                            if (el?.textContent?.trim()) { 
                                price = el.textContent.trim(); 
                                break; 
                            }
                        }

                        const imgEl = item.querySelector('img');
                        const image = imgEl?.getAttribute('data-src') || imgEl?.getAttribute('src') || null;

                        const linkEl = item.querySelector('a.core');
                        const url = linkEl?.getAttribute('href') || null;

                        return { title, price, image, url };
                    });
                });

                for (const product of products) {
                    if (product.url) {
                        await collection.updateOne(
                            { url: product.url },
                            { $set: product },
                            { upsert: true }
                        );
                        await redisClient.setEx(product.url, 24 * 60 * 60, JSON.stringify(product));
                    }
                }

                await enqueueLinks({ selector: 'a.pg' });
            },
            maxRequestsPerCrawl: 50,
            headless: true,
        });

        await crawler.run(['https://www.jumia.ma/pc-portables/']);
        res.send('Scraping terminé et sauvegardé dans MongoDB + Redis !');
    });

    // --- Endpoint get products ---
    app.get('/products', async (_req, res) => {
        try {
            const cached = await redisClient.get('allProducts');
            if (cached) return res.json(JSON.parse(cached));

            const products = await collection.find({}).toArray();
            await redisClient.setEx('allProducts', 60 * 60, JSON.stringify(products));
            return res.json(products);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

main().catch(console.error);
