import { API_URL } from '@/services';
import { getToken } from '@/utils/auth';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type EventCallback = (...args: any[]) => void;

export function useSocket(url: string = API_URL) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(url, {
        transports: ['websocket'],
        auth: {
          token: 'Bearer ' + getToken(),
        },
      });

      socketRef.current.on('connect', () => {
        console.log('Conectado ao WebSocket:', socketRef.current?.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Desconectado do WebSocket');
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [url]);

  const on = (event: string, callback: EventCallback) => {
    socketRef.current?.on(event, callback);
  };

  const off = (event: string, callback?: EventCallback) => {
    if (callback) {
      socketRef.current?.off(event, callback);
    } else {
      socketRef.current?.removeAllListeners(event);
    }
  };

  const emit = (event: string, data: any) => {
    socketRef.current?.emit(event, data);
  };

  const isConnected = () => {
    return !!socketRef.current?.connected;
  };

  return { on, off, emit, isConnected };
}
