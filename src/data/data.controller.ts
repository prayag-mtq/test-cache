import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Controller('data')
export class DataController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Get('nocache')
  async getWithoutCache() {
    const start = Date.now();

    const getData = await this.userModel.find().exec();

    const end = Date.now();

    const duration = end - start;

    return {
      message: 'Fetched without cache',
      count: getData.length,
      timeMs: duration,
    };
  }
}
