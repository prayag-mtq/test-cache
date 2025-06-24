// app.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        host: 'localhost',
        port: 6379,
        ttl: 60,
      }),
    }),
    DataModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/testdb',
        connectionFactory: (connection) => {
          connection.on('connected', () => console.log('🟩 Mongo connected'));
          connection.on('error', (err: any) =>
            console.error('🟥 Mongo error:', err),
          );
          connection.on('disconnected', () =>
            console.warn('🟧 Mongo disconnected'),
          );
          return connection;
        },
      }),
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
    console.log(`📡 Mongoose state: ${states[this.connection.readyState]}`);
  }
}
