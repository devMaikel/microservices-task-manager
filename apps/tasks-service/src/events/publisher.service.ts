import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { connect, ChannelWrapper } from 'amqp-connection-manager';
import { Options } from 'amqplib';

@Injectable()
export class EventsPublisherService implements OnModuleDestroy {
  private connection = connect([
    process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
  ]);
  private channel: ChannelWrapper;

  constructor() {
    this.channel = this.connection.createChannel({ json: true });
    this.channel.addSetup(async (channel) => {
      await channel.assertExchange('events', 'topic', { durable: true });
    });
  }

  async publish(event: string, payload: any, options?: Options.Publish) {
    await this.channel.publish('events', event, payload, options);
  }

  async onModuleDestroy() {
    try {
      await this.channel.close();
      await this.connection.close();
    } catch (e) {}
  }
}