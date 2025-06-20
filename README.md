# 🧪 NestJS MongoDB Seeder

This project demonstrates how to seed a large dataset (e.g., 100,000 fake users) into a MongoDB database using NestJS, Mongoose, and Faker.js.

---

## 📦 Technologies Used

- **NestJS**
- **MongoDB** (via Mongoose)
- **Faker** (`@faker-js/faker`)
- **TypeScript**
- **ts-node**

---

## 📁 File Structure

```
test-cache/
├── src/
│   ├── data/
│   │   └── schema/
│   │       └── user.schema.ts
│   └── seeder/
│       ├── seeder.module.ts
│       └── seeder.service.ts
|       ├── seeder.ts
├── package.json
├── tsconfig.json
```

---

## ⚙️ Setup Instructions

### 1. 🧱 Install Dependencies

```bash
npm install
```

If you use `faker`:

```bash
npm install @faker-js/faker
```

For `ts-node` usage (if not installed):

```bash
npm install ts-node --save-dev
```

---

### 2. 🛠️ MongoDB Setup (Optional via Docker)

If you don’t have MongoDB running locally, create a `docker-compose.yml`:

```yaml
version: '3'
services:
  mongo:
    image: mongo:6
    ports:
      - 27017:27017
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Run it:

```bash
docker-compose up -d
```

---

### 3. 🧬 Schema

Located at `src/data/schema/user.schema.ts`

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

export const UserSchema = SchemaFactory.createForClass(user);
```

---

## 🎯 How to Seed Data

### 🔹 Run Seeder

```bash
npx ts-node seeder.ts
```

Or add this to `package.json`:

```json
"scripts": {
  "seed": "ts-node seeder.ts"
}
```

Then run:

```bash
npm run seed
```

---

### 🧪 What it does

- Clears existing users:

  ```
  🧹 Cleared user collection.
  ```

- Seeds 100,000 users with:

  - `userId`: incremental
  - `name`: random full name
  - `timestamp`: recent random date

```bash
⏱ Insert Time: 2.2s
🎯 Seeded 100000 users.
```

---

## 🧠 Tips & Customization

- Change seed count in `seeder.ts`:

  ```ts
  await seeder.seed(100000); // modify as needed
  ```

- Add CLI support for `count` if needed.

- Ensure MongoDB is running before executing.

---

## ❓ Common Issues

- **"Cannot find module" error**: use relative imports like `../data/...`, not `src/...`
- **Mongo not running**: make sure your Docker container or Mongo service is up (`localhost:27017`)

---

## ✅ Sample Output

```bash
🧹 Cleared user collection.
⏱ Insert Time: 2.269s
🎯 Seeded 100000 users.
```
