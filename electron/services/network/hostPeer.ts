import net from 'net';
import pump from 'pump';
import { Muxer, type MuxerStream } from './muxer';
import type { Connection } from './types';

export function handleHostPeerConnection(params: {
  connection: Connection;
  lanPort: number;
  onLog: (msg: string) => void;
  onGameConnectionOpened?: () => void;
  onGameConnectionClosed?: (transferredBytes: number) => void;
}) {
  const { connection, lanPort, onLog, onGameConnectionClosed, onGameConnectionOpened } = params;

  onLog('[Network] Peer connected! Multiplexer ready.');
  const muxer = new Muxer(connection, (error) => onLog(`[Network] Tunnel protocol rejected: ${error.message}`));

  // Handle incoming streams from client (player joining).
  muxer.on('stream', (stream: MuxerStream) => {
    onLog(`[Network] Incoming connection Stream ${stream.sessionId}`);

    const socket = net.connect(lanPort, 'localhost');
    let opened = false;
    socket.once('connect', () => {
      opened = true;
      onGameConnectionOpened?.();
    });
    pump(stream, socket, stream, (_err?: Error) => {
      // Silence stream errors; disconnects are expected
      if (opened) onGameConnectionClosed?.(socket.bytesRead + socket.bytesWritten);
      socket.destroy();
    });
  });

  muxer.once('close', () => {
    onLog('[Network] Peer disconnected.');
  });
}
