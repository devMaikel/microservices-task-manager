import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { RabbitMqConsumer } from './rabbitmq.consumer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'challenge_db',
      entities: [Notification],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsGateway, RabbitMqConsumer],
})
export class AppModule {}
