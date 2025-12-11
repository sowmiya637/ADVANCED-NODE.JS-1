import express from "express";
import session from "express-session";
import { createClient } from "redis";
import { LRUCache } from "lru-cache";
import { RedisStore } from "connect-redis";

// Redis Setup 
const redisClient = createClient();
redisClient.on("error", console.error);
await redisClient.connect();

//  Express Setup
const app = express();
app.use(express.json());

//  Session Storage in Redis 
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 }, // 1 hour
  })
);

//  In-memory LRU Cache 
const memoryCache = new LRUCache({
  max: 5,         // max 5 items
  ttl: 1000 * 60, // 1 minute
});

// Simulated Database 
const fakeDB = {
  1: { id: 1, name: "Laptop", price: 1500 },
  2: { id: 2, name: "Phone", price: 800 },
  3: { id: 3, name: "Headphones", price: 150 },
  4: { id: 4, name: "Monitor", price: 300 },
  5: { id: 5, name: "Keyboard", price: 50 },
};

//  Cache-aside Function 
async function getProduct(id) {
  //  Check in-memory cache
  let product = memoryCache.get(id);
  if (product) {
    console.log(" From Memory Cache");
    return product;
  }

  //  Check Redis cache
  product = await redisClient.get(`product_${id}`);
  if (product) {
    product = JSON.parse(product);
    console.log(" From Redis Cache");

    // Put back to memory cache
    memoryCache.set(id, product);

    // Show remaining Redis TTL
    const ttl = await redisClient.ttl(`product_${id}`);
    console.log(` Redis TTL for product_${id}: ${ttl}s`);
    return product;
  }

  //  Fetch from database (simulated)
  console.log(" From Database");
  product = fakeDB[id];
  if (!product) return null;

  //  Store in Redis (5 min TTL)
  await redisClient.set(`product_${id}`, JSON.stringify(product), { EX: 300 });

  //  Store in memory cache (1 min TTL)
  memoryCache.set(id, product);

  return product;
}

//  Routes 
app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await getProduct(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

app.get("/login/:user", (req, res) => {
  req.session.user = req.params.user;
  res.send(`User ${req.params.user} logged in, session stored in Redis`);
});

app.get("/me", (req, res) => {
  if (!req.session.user) return res.send("No user session");
  res.send(`Current session user: ${req.session.user}`);
});

//  Start Server 
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
