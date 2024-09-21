// app/api/socket/route.js

import { NextResponse } from 'next/server';
import { Server } from 'ws';

let wss;

export function GET(req) {
  if (!wss) {
    const res = new NextResponse();
    wss = new Server({ noServer: true });
    
    res.socket.server.ws = (socket, req) => {
      wss.handleUpgrade(req, socket, Buffer.alloc(0), (ws) => {
        wss.emit('connection', ws, req);
      });
    };

    wss.on('connection', (ws) => {
      console.log('New WebSocket connection');
      
      ws.on('message', (message) => {
        console.log('Received:', message);
      });

      ws.on('close', () => {
        console.log('WebSocket disconnected');
      });
    });

    console.log('WebSocket server initialized');
  }

  return new NextResponse('WebSocket server is running.');
}