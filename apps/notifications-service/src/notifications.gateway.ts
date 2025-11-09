import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private socketToUser = new Map<string, string>();
  private userToSockets = new Map<string, Set<string>>();
  private jwt = new JwtService({
    secret: process.env.JWT_SECRET || 'sW0rdF15h',
  });

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token || client.handshake.query?.token;
    let userId: string | undefined;
    if (typeof token === 'string' && token.length > 0) {
      try {
        const payload: any = this.jwt.verify(token);
        userId = payload.sub;
      } catch (e) {
        console.log('JWT inválido:', e);
      }
    }

    if (!userId) {
      try {
        client.emit('unauthorized', { reason: 'invalid_token' });
      } catch {}
      client.disconnect(true);
      return;
    }

    this.socketToUser.set(client.id, userId);
    if (!this.userToSockets.has(userId))
      this.userToSockets.set(userId, new Set());
    this.userToSockets.get(userId)!.add(client.id);
    try {
      console.log(`[ws] connect: socket=${client.id} user=${userId}`);
    } catch {}
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketToUser.get(client.id);
    if (userId) {
      const set = this.userToSockets.get(userId);
      if (set) {
        set.delete(client.id);
        if (set.size === 0) this.userToSockets.delete(userId);
      }
      this.socketToUser.delete(client.id);
    }
    try {
      console.log(
        `[ws] disconnect: socket=${client.id} user=${userId ?? 'unknown'}`,
      );
    } catch {}
  }

  notifyUser(userId: string, payload: any) {
    const sockets = this.userToSockets.get(userId);
    if (!sockets) return;
    for (const socketId of sockets) {
      this.server.to(socketId).emit('notification', payload);
    }
  }
}
