import { Module, OnModuleInit } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    DataModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/testdb',
        connectionFactory: (connection) => {
          connection.on('connected', () => console.log('🟩 Mongo connected'));
          connection.on('error', (err) =>
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
