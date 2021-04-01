import EventEmitter from 'events';
import { FC, createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WithChildren } from '../types/next-page';

interface OrbiterFn {
  listen: (topics: string[]) => void;
  unlisten: (topics: string[]) => void;
  events: EventEmitter;
}

export const OrbiterContext = createContext<OrbiterFn>({
  listen: (_) => {
    return;
  },
  unlisten: (_) => {
    return;
  },
  events: new EventEmitter(),
});

export const useOrbiter = () => useContext(OrbiterContext);

export const OrbiterProvider: FC<WithChildren> = ({ children }) => {
  const [offlineQueue, setOfflineQueue] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket>(null);
  const [events] = useState(new EventEmitter());

  useEffect(() => {
    if (!socket) return () => {};

    // On open listen to all the topics from when we listened offline
    socket.onopen = () => {
      if (offlineQueue.length === 0) return;
      listen(offlineQueue);
      setOfflineQueue([]);
    };

    socket.onmessage = ({ data }) => {
      const { data: d }: { type: string; data?: any } = JSON.parse(data);

      if (d && d.topic) events.emit(d.topic, d.message);
    };

    // Reconnect on disconnect
    socket.onclose = () => {
      setTimeout(() => {
        setSocket(null);
      }, Math.floor(Math.random() * (3e4 - 1e4) + 1e4));
    };

    // Send heartbeats
    const heartbeat = setInterval(() => {
      socket.send(JSON.stringify({ type: 'ping' }));
    }, Math.floor(Math.random() * (3e4 - 1e4) + 1e4));

    return () => {
      clearInterval(heartbeat);
    };
  }, [socket]);

  useEffect(() => {
    if (typeof window == 'undefined') return () => {};

    if (!socket) setSocket(new WebSocket('wss://orbiter.spaceflight.live'));

    return () => {
      if (socket) socket.close();
    };
  }, [socket]);

  const listen = useCallback(
    (topics: string[]): void => {
      if (socket && socket.readyState === socket.OPEN)
        socket.send(JSON.stringify({ type: 'listen', data: { topics } }));
      else setOfflineQueue([...offlineQueue, ...topics]);
    },
    [socket, offlineQueue],
  );

  const unlisten = useCallback(
    (topics: string[]): void => {
      if (socket && socket.readyState === socket.OPEN)
        socket.send(JSON.stringify({ type: 'unlisten', data: { topics } }));
    },
    [socket],
  );

  return (
    <OrbiterContext.Provider
      value={{
        events,
        listen,
        unlisten,
      }}
    >
      {children}
    </OrbiterContext.Provider>
  );
};
