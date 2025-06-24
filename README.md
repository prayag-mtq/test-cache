# ⚡ NestJS Caching Explained

Caching is a powerful way to improve performance and reduce load on databases and APIs. NestJS supports caching out of the box using its `@nestjs/cache-manager` module, which lets you store temporary data in memory or external services like Redis.

---

## 📦 Types of Caching in NestJS

NestJS supports two main caching strategies:

### 1️⃣ In-Memory Caching (default)

- Uses your app's memory (RAM)
- Built into `@nestjs/cache-manager`
- No extra setup required

### 2️⃣ Redis Caching (external)

- Uses a separate Redis server
- More scalable and production-ready
- Requires installing `ioredis` and `cache-manager-ioredis`

---

## 💡 What Does "In-Memory Cache" Mean?

- Stores cached data **inside your Node.js process memory**
- Fastest possible access (no network calls)
- **Lost when the app restarts**
- Each instance of your app has **its own separate cache**

### 🧠 Example

```ts
CacheModule.register({
  ttl: 60, // Cache for 60 seconds
});
```

> No `store` specified = in-memory cache by default

---

## 🟥 What Does "Redis Cache" Mean?

- Stores cached data in a **separate Redis server**
- Can be shared across **multiple app instances**
- Data can **persist** beyond app restarts (if configured)
- Slightly slower than in-memory (but still fast)

### 🔌 Example

```bash
npm install cache-manager-ioredis ioredis
```

```ts
import * as redisStore from 'cache-manager-ioredis';

CacheModule.register({
  store: redisStore,
  host: 'localhost',
  port: 6379,
  ttl: 60,
});
```

---

## ⚙️ How Caching Works in NestJS

1. You register `CacheModule` in your app.
2. You inject `CACHE_MANAGER` where needed.
3. You can manually cache with `cacheManager.get` `set`, or use automatic caching via decorators/interceptors.

### 🧱 Manual Example

```ts
const cached = await this.cacheManager.get('user_list');
if (!cached) {
  const users = await this.userService.findAll();
  await this.cacheManager.set('user_list', users, 60);
}
```

### ⚡ Auto Example

```ts
@UseInterceptors(CacheInterceptor)
@CacheKey('products')
@CacheTTL(120)
@Get()
findAllProducts() {
  return this.productService.findAll();
}
```

---

## ⚖️ In-Memory vs Redis: What's the Difference?

| Feature                | In-Memory Cache  | Redis Cache               |
| ---------------------- | ---------------- | ------------------------- |
| Where it's stored      | App memory (RAM) | External Redis server     |
| Shared across servers? | ❌ No            | ✅ Yes                    |
| Survives restarts?     | ❌ No            | ✅ Yes (if configured)    |
| Speed                  | ⚡ Fastest       | 🚀 Fast                   |
| Setup needed?          | ❌ None          | ✅ Redis server + config  |
| Best for               | Dev, simple apps | Production, scalable apps |

---

## 🧠 When Should You Use Each?

### ✅ Use **In-Memory** When:

- You're building a **small app or MVP**
- It's **single-instance**
- You want something quick & easy to test

### ✅ Use **Redis** When:

- You're building a **production app**
- You deploy multiple app instances
- You want cache to **persist** across restarts
- You need to **clear or share** cache across services

---

## 🧪 Summary

| Category            | In-Memory Cache        | Redis Cache             |
| ------------------- | ---------------------- | ----------------------- |
| Location            | Inside Node.js process | External server         |
| Speed               | ⚡ Ultra fast          | 🚀 Still very fast      |
| Shared across apps? | ❌ No                  | ✅ Yes                  |
| Persistence         | ❌ No                  | ✅ Yes (optional)       |
| Setup effort        | ✅ Very low            | 🛠️ Requires Redis setup |
| Production use?     | ❌ Not recommended     | ✅ Industry standard    |
