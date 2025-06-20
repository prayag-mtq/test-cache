# 🚀 MongoDB Performance Test - No Caching (NestJS)

This step benchmarks raw data retrieval from MongoDB using NestJS **without any caching**.

---

## 📦 Tech Stack

- **NestJS**
- **MongoDB (via Mongoose)**
- **TypeScript**

---

## 📁 Project Structure

```
src/
├── app.module.ts               # Main app module
├── data/
│   ├── data.module.ts          # Mongoose + Controller module
│   ├── data.controller.ts      # Endpoint for raw MongoDB fetch
│   └── schema/
│       └── user.schema.ts      # Mongoose User schema
seeder.ts                       # Data seeder (100K users)
```

---

## 🧬 User Schema

### 📄 `src/data/schema/user.schema.ts`

```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class user extends Document {
  @Prop()
  userId: number;

  @Prop()
  name: string;

  @Prop()
  timestamp: Date;
}

export const UserSchema = SchemaFactory.createForClass(user);
```

---

## 🔧 App Setup

### 📄 `src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/testdb'),
    DataModule,
  ],
})
export class AppModule {}
```

---

### 📄 `src/data/data.module.ts`

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataController } from './data.controller';
import { user, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: UserSchema }]),
  ],
  controllers: [DataController],
})
export class DataModule {}
```

---

### 📄 `src/data/data.controller.ts`

```ts
import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from './schema/user.schema';

@Controller('data')
export class DataController {
  constructor(
    @InjectModel(user.name) private readonly userModel: Model<user>,
  ) {}

  @Get('nocache')
  async getWithoutCache() {
    const start = Date.now();
    const data = await this.userModel.find().exec();
    const end = Date.now();

    return {
      message: 'Fetched without cache',
      count: data.length,
      timeMs: end - start,
    };
  }
}
```

---

## 🧪 Seeding Data

Ensure MongoDB has large data:

```bash
npx ts-node seeder.ts
```

Seeds 100,000 users into `testdb`.

---

## 🚀 Run Project

```bash
npm run start:dev
```

Then visit:

```
GET http://localhost:3000/data/nocache
```

### ✅ Output

```json
{
  "message": "Fetched without cache",
  "count": 100000,
  "timeMs": 1627
}
```
