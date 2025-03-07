'use client'
import React, { useEffect, useState } from 'react';
import socket from '../socket';
import { Channel } from 'phoenix';
import DashboardView from './emails/dashboard-view';
import { logRealtime } from '../lib/utils';

type Props = {
  socketToken: string
  user: {
    id: string
  }
}

export default function Emails({ socketToken, user }: Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const name = `emails:all`;
    if (!socket) {
      console.error("Socket not provided");
      return;
    }
    const ch = socket.channel(name, {
      token: socketToken
    });
    ch.onError((error) => {
      setIsConnected(false);
      setChannel(null);
      logRealtime("Error joining channel", { name, error });
    });
    ch.onClose(() => {
      logRealtime("Channel closed");
      setChannel(null);
      setIsConnected(false);
    });
    ch.join()
      .receive("ok", (resp: { categories: string[] }) => {
        setIsConnected(true);
        setChannel(ch);
        logRealtime("Joined channel", { name, resp });
      })
      .receive("error", (resp) => {
        setIsConnected(false);
        setChannel(null);
        logRealtime("Failed to join channel", { name, resp });
      });
    return () => {
      ch.leave();
    };
  }, []);
  return (
    <DashboardView />
  )
}
