# ⚡ MongoDB Performance Test - In-Memory Caching (NestJS)

This step demonstrates how to cache MongoDB responses using **NestJS's built-in in-memory cache manager**, and how it improves performance on repeated API calls.

---

## 📦 Tech Stack

- **NestJS**
- **MongoDB (Mongoose)**
- **@nestjs/cache-manager**
- **In-Memory Caching**

---

## 📁 Folder Structure

```
src/
├── app.module.ts               # Registers CacheModule + global interceptor
├── data/
│   ├── data.module.ts          # Mongoose + CacheModule
│   ├── data.controller.ts      # GET endpoint with @CacheInterceptor
│   └── schema/
│       └── user.schema.ts      # Mongoose schema
```

---

## 🧬 User Schema

📄 `src/data/schema/user.schema.ts`

```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  userId: number;

  @Prop()
  name: string;

  @Prop()
  timestamp: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

---

## 🚀 AppModule Setup

📄 `src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/testdb'),
    CacheModule.register(), // In-memory cache
    DataModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor, // Global cache
    },
  ],
})
export class AppModule {}
```

---

## 📦 Data Module with Cache Support

📄 `src/data/data.module.ts`

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { User, UserSchema } from './schema/user.schema';
import { DataController } from './data.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CacheModule.register(), // Required for controller-level caching
  ],
  controllers: [DataController],
})
export class DataModule {}
```

---

## 📡 Cached Endpoint Controller

📄 `src/data/data.controller.ts`

```ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('data')
export class DataController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Get('cache')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('user_data_in_memory')
  @CacheTTL(60) // seconds
  async getWithInMemoryCache() {
    const start = Date.now();
    const data = await this.userModel.find().exec();
    const end = Date.now();
    return {
      message: 'Fetched with in-memory cache',
      count: data.length,
      timeMs: end - start,
    };
  }
}
```

---

## ▶️ Run the App

```bash
npm run start:dev
```

---

## 🌐 Test the API

```
GET http://localhost:3000/data/cache
```

---

## ✅ Sample Output

### First request (no cache yet):

```json
{
  "message": "Fetched with in-memory cache",
  "count": 100000,
  "timeMs": 630
}
```

### Second request (instant cache hit):

```json
{
  "message": "Fetched with in-memory cache",
  "count": 100000,
  "timeMs": 3
}
```
