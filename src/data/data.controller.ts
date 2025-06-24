import { Controller, Get, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('data')
export class DataController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get('cache')
  async getWithManualCache() {
    const startTime = process.hrtime.bigint();

    const cacheKey = 'user_data_manual_cache';
    let data = await this.cacheManager.get<User[]>(cacheKey);

    let fromCache = true;
    let dbFetchTime = 0;

    if (!data) {
      console.log('❗Fetching from DB...');

      const dbStart = process.hrtime.bigint();
      data = await this.userModel.find().exec();
      const dbEnd = process.hrtime.bigint();

      dbFetchTime = Number(dbEnd - dbStart) / 1_000_000; // Convert to milliseconds

      await this.cacheManager.set(cacheKey, data, 60000); // cache for 60s
      fromCache = false;
    }

    const endTime = process.hrtime.bigint();
    const totalTimeMs = Number(endTime - startTime) / 1_000_000;

    return {
      message: fromCache ? '🔁 Served from CACHE' : '❗Fetched from DB',
      count: data.length,
      timeMs: Number(totalTimeMs.toFixed(3)),
      ...(dbFetchTime > 0 && { dbFetchTimeMs: Number(dbFetchTime.toFixed(3)) }),
      cachedAt: new Date().toISOString(),
    };
  }
}
