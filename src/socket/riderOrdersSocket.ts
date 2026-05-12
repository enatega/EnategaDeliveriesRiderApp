import { io, type ManagerOptions, type Socket, type SocketOptions } from 'socket.io-client';
import { apiConfig } from '../api/apiConfig';

type SocketOptionsInput = Partial<ManagerOptions & SocketOptions>;

export type RiderOrderStatusUpdatedPayload = {
  orderId: string;
  status: string;
  riderStatus: string | null;
  riderId: string | null;
  updatedAt: string;
};

export type RiderStatusUpdatedPayload = {
  orderId: string;
  riderStatus: string | null;
  riderId: string | null;
  riderName: string | null;
  updatedAt: string;
};

type RiderSocketSession = {
  token: string | null;
  userId: string | null;
};

function normalizeUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function buildSocketUrl() {
  const baseUrl = normalizeUrl(process.env.EXPO_PUBLIC_SOCKET_URL ?? apiConfig.baseUrl);
  return `${baseUrl}/deliveries`;
}

class RiderOrdersSocketClient {
  private socket: Socket | null = null;
  private token: string | null = null;
  private userId: string | null = null;

  private buildAuth(token: string | null) {
    return token ? { token } : {};
  }

  private emitAddUser(socket: Socket) {
    if (!this.userId) return;
    socket.emit('add-user', this.userId);
  }

  private ensureSocket(options?: SocketOptionsInput) {
    if (this.socket) {
      this.socket.auth = this.buildAuth(this.token);
      return this.socket;
    }

    this.socket = io(buildSocketUrl(), {
      autoConnect: false,
      path: process.env.EXPO_PUBLIC_SOCKET_PATH ?? '/socket.io',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 10_000,
      randomizationFactor: 0.5,
      timeout: 20_000,
      auth: this.buildAuth(this.token),
      ...options,
    });

    this.socket.on('connect', () => {
      this.emitAddUser(this.socket as Socket);
    });

    return this.socket;
  }

  connect(options?: SocketOptionsInput) {
    const socket = this.ensureSocket(options);

    if (!this.token) return socket;

    if (!socket.connected) {
      socket.connect();
    }

    return socket;
  }

  disconnect() {
    if (!this.socket?.connected) return;
    this.socket.disconnect();
  }

  updateSession(session: RiderSocketSession) {
    const tokenChanged = this.token !== session.token;
    this.token = session.token;
    this.userId = session.userId;

    if (!this.socket) return;

    this.socket.auth = this.buildAuth(this.token);

    if (!this.token) {
      this.disconnect();
      return;
    }

    if (tokenChanged && this.socket.connected) {
      this.socket.disconnect().connect();
      return;
    }

    if (this.socket.connected) {
      this.emitAddUser(this.socket);
    }
  }

  subscribeOrderStatusUpdated(handler: (payload: RiderOrderStatusUpdatedPayload) => void) {
    const socket = this.ensureSocket();
    socket.on('order-status-updated', handler);

    return () => {
      socket.off('order-status-updated', handler);
    };
  }

  subscribeRiderStatusUpdated(handler: (payload: RiderStatusUpdatedPayload) => void) {
    const socket = this.ensureSocket();
    socket.on('rider-status-updated', handler);

    return () => {
      socket.off('rider-status-updated', handler);
    };
  }
}

export const riderOrdersSocketClient = new RiderOrdersSocketClient();
