import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { User } from '../data/schema/user.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async clear() {
    await this.userModel.deleteMany({});
    console.log('🧹 Cleared user collection.');
  }

  async seed(count: number) {
    const data = Array.from({ length: count }).map((_, i) => ({
      userId: i + 1,
      name: faker.person.fullName(),
      timestamp: faker.date.recent({ days: 30 }),
    }));

    console.time('⏱ Insert Time');
    await this.userModel.insertMany(data);
    console.timeEnd('⏱ Insert Time');

    console.log(`🎯 Seeded ${count} users.`);
  }
}
