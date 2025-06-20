import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Record',
        schema: UserSchema,
      },
    ]),
  ],
})
export class DataModule {}
