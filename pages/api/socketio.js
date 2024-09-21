// pages/api/socketio.js

import { Server } from 'socket.io';
import Visit from '@/models/Visit';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Socket is initializing');
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', socket => {
    console.log(`New client connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    socket.on('visit:add', async (data) => {
      try {
        const { visitorName, visitorTitle, visitorOrganization, visitPurpose } = data;
        const newVisit = await Visit.create({
          visitorName,
          visitorTitle,
          visitorOrganization,
          visitPurpose
        });
        io.emit('visit:added', newVisit);
      } catch (error) {
        console.error('Error adding visit:', error);
      }
    });

    socket.on('visit:update', async (data) => {
      try {
        const updatedVisit = await Visit.findByIdAndUpdate(
          data.id, 
          { status: data.status },
          { new: true, runValidators: true }
        );
        io.emit('visit:updated', updatedVisit);
      } catch (error) {
        console.error('Error updating visit:', error);
      }
    });

    socket.on('visit:hide', async (id) => {
      try {
        const hiddenVisit = await Visit.findByIdAndUpdate(
          id,
          { isHidden: true },
          { new: true }
        );
        io.emit('visit:hidden', hiddenVisit._id);
      } catch (error) {
        console.error('Error hiding visit:', error);
      }
    });

  });

  console.log('Socket is initialized');
  res.end();
}