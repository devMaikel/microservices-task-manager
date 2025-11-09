import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from './notification.entity';
import { connect, ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class RabbitMqConsumer implements OnModuleInit {
  private connection = connect([
    process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
  ]);
  private channel: ChannelWrapper;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly gateway: NotificationsGateway,
  ) {
    this.channel = this.connection.createChannel({ json: true });
  }

  async onModuleInit() {
    await this.channel.addSetup(async (ch) => {
      await ch.assertExchange('events', 'topic', { durable: true });
      const q = await ch.assertQueue('notifications_events', {
        durable: true,
      });
      await ch.bindQueue(q.queue, 'events', 'task:created');
      await ch.bindQueue(q.queue, 'events', 'task:updated');
      await ch.bindQueue(q.queue, 'events', 'comment:new');
      await ch.consume(q.queue, (msg) => this.handleMessage(msg, ch), {
        noAck: false,
      });
    });
  }

  private async handleMessage(msg: any, ch: any) {
    try {
      const routingKey = msg.fields.routingKey as string;
      const content = JSON.parse(msg.content.toString());
      const recipients = this.resolveRecipients(content);

      for (const userId of recipients) {
        const note = this.notificationRepo.create({
          userId,
          type: routingKey,
          taskId: content.taskId ?? null,
          commentId: content.commentId ?? null,
          message: this.buildMessage(routingKey, content),
        });
        const saved = await this.notificationRepo.save(note);
        this.gateway.notifyUser(userId, saved);
      }

      ch.ack(msg);
    } catch (e) {
      ch.nack(msg, false, true);
    }
  }

  private resolveRecipients(content: any): string[] {
    const ids: Set<string> = new Set();
    if (Array.isArray(content.assignedUserIds)) {
      content.assignedUserIds.forEach((id: string) => ids.add(id));
    }
    if (content.creatorId) ids.add(content.creatorId);
    if (content.userId) ids.add(content.userId);
    return Array.from(ids);
  }

  private buildMessage(event: string, c: any): string {
    switch (event) {
      case 'task:created':
        return `Nova tarefa: ${c.title}`;
      case 'task:updated':
        return `Tarefa atualizada (${c.taskTitle}): ${Array.isArray(c.changes) ? c.changes.join(', ') : ''}`;
      case 'comment:new':
        return `Novo comentário na tarefa ${c.taskTitle}`;
      default:
        return 'Evento';
    }
  }
}
