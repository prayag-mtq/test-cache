import { Controller, Get, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('data/redis')
export class DataController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get('cache')
  async getWithManualCache() {
    const start = Date.now();

    const cacheKey = 'user_data_manual_cache';
    let data = await this.cacheManager.get<User[]>(cacheKey);

    let fromCache = true;

    if (!data) {
      console.log('❗Fetching from DB...');
      data = await this.userModel.find().exec();
      await this.cacheManager.set(cacheKey, data, 6000);
      fromCache = false;
    }

    const end = Date.now();

    return {
      message: fromCache ? '🔁 Served from CACHE' : '❗Fetched from DB',
      count: data.length,
      timeMs: end - start,
      cachedAt: new Date().toISOString(),
    };
  }
}
