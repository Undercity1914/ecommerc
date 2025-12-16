import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from './typeorm/entities/user';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_CONNECTION_NAME'),
      entities: [Users],
      synchronize: true,
    }),
    inject: [ConfigService],
  }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
