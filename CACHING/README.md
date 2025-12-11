

````markdown
#  Caching — Complete Guide

## 📌 Overview
Caching is one of the most important techniques to improve application **speed**, **scalability**, and **performance**.

This module covers:
- In-memory caching
- Redis basics
- Cache strategies (LRU, TTL, etc.)
- Session storage using Redis
- Common caching patterns

---

# ⚡ 1. What is Caching?

Caching stores frequently accessed data in a **fast storage layer** so the application does not repeatedly query the database.

### Benefits:
- Reduces database load  
- Improves response time  
- Handles high traffic efficiently  
- Saves cost by reducing DB queries  

---

# 🧠 2. In-Memory Caching (Local Cache)

In-memory caching stores data **inside the application memory (RAM)**.

Examples:
- Node.js `Map`
- `node-cache`
- `lru-cache`

### Pros:
- Extremely fast (microseconds)
- No network latency

### Cons:
- Data is lost when server restarts  
- Not shared across multiple servers  
- Not suitable for distributed systems  

### Example (Node.js LRU Cache)
```js
import LRU from "lru-cache";

const cache = new LRU({
  max: 100,
  ttl: 1000 * 60, // 1 minute
});

cache.set("user:1", { name: "John" });
console.log(cache.get("user:1"));
````

---

# 🏎️ 3. Redis Basics

Redis = **Remote Dictionary Server**
It is an in-memory, key-value store used for:

* Caching
* Session store
* Rate limiting
* Queues and pub/sub

### Why Redis?

* Extremely fast (in-memory)
* Supports TTL (expiration)
* Persistent if needed
* Works in distributed systems

### Basic commands:

```
SET key value
GET key
DEL key
EXPIRE key seconds
TTL key
```

### Node.js usage:

```js
import { createClient } from "redis";

const client = createClient();
await client.connect();

await client.set("username", "Sowmiya", { EX: 60 });
```

---

# 🧩 4. Cache Strategies (LRU, TTL, LFU)

## 4.1 LRU — Least Recently Used

Removes the **oldest unused** item when memory is full.

Used in:

* Browser caching
* Node.js `lru-cache`
* Redis LRU eviction policy

## 4.2 TTL — Time To Live

Data automatically expires after X seconds.

Example:

```sh
SET product:5 "data" EX 60
```

## 4.3 LFU — Least Frequently Used

Removes items used the least number of times.

Good for:

* APIs with predictable repeated access patterns

## 4.4 Write-Through Cache

Writes go to cache **and** database simultaneously.

## 4.5 Write-Back Cache

Writes go to cache first → DB updated later.

Faster but riskier.

---

# 🛠️ 5. Session Storage in Redis

Redis is widely used to store sessions because:

* It is fast
* Supports expiration
* Works in clusters

### Example (Express + Redis session)

```js
import session from "express-session";
import connectRedis from "connect-redis";
import { createClient } from "redis";

const client = createClient();
await client.connect();

const RedisStore = connectRedis(session);

app.use(
  session({
    store: new RedisStore({ client }),
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 },
  })
);
```

---

# 📦 6. Common Caching Patterns

## 6.1 Cache-aside (Lazy Loading)

Most common pattern.

Flow:

1. App checks cache
2. If not found → fetch from DB
3. Save to cache
4. Return result

### Example

```js
const cacheKey = "course:101";

let data = await redis.get(cacheKey);

if (!data) {
  data = await Course.findById(101);
  await redis.set(cacheKey, JSON.stringify(data), { EX: 300 });
}
```

---

## 6.2 Write-Through Cache

Data written to DB + cache simultaneously.

Pros:

* Cache always updated

Cons:

* Slower writes

---

## 6.3 Write-Back Cache

Data stored in cache first; DB updates later.

Used in:

* Heavy-write systems
* Analytics workloads

---

## 6.4 Read-Through Cache

Application reads ONLY through cache layer.
Cache provider loads data if missing.

Often used with managed caching systems.

---

## 6.5 Cache Invalidation Strategies

### 1. Time-based expiration (TTL)

Automatically clears old data.

### 2. Manual invalidation

```js
await redis.del("course:101");
```

### 3. Pattern invalidation

Delete everything related to "course:"

```
DEL course:*
```

### 4. Event-based invalidation

Example:

* If course is updated → delete cache
* If new lesson added → delete related cache

---

# 🧪 7. When NOT to Use a Cache

Avoid caching:

* Passwords or sensitive info
* Frequently changing data
* Extremely small datasets
* Non-repeat queries

---

# 🎯 Outcome

After completing this module, you will understand:

* How caching works and why it's necessary
* Difference between in-memory caching and Redis
* Cache eviction strategies (LRU, TTL, LFU)
* How to store sessions in Redis
* Most useful caching patterns for real apps
* How caching improves scalability and performance


