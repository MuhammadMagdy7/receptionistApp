
// lib/socket.js
import io from 'socket.io-client';

let socket;
let visitUpdatedCallback;
let visitAddedCallback;

export const initSocket = async () => {
  if (!socket) {
    await fetch('/api/socketio');
    socket = io();

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('visit:updated', (updatedVisit) => {
      console.log('Visit updated:', updatedVisit);
      if (visitUpdatedCallback) {
        visitUpdatedCallback(updatedVisit);
      }
    });

    socket.on('visit:added', (newVisit) => {
      console.log('New visit added:', newVisit);
      if (visitAddedCallback) {
        visitAddedCallback(newVisit);
      }
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized!');
  }
  return socket;
};

export const emitVisitUpdate = (id, status) => {
  if (socket) {
    socket.emit('visit:update', { id, status });
  }
};

export const emitAddVisit = (visitData) => {
  if (socket) {
    socket.emit('visit:add', visitData);
  }
};

export const emitHideVisit = (id) => {
  if (socket) {
    socket.emit('visit:hide', id);
  }
};

export const onVisitUpdated = (callback) => {
  visitUpdatedCallback = callback;
};

export const onVisitAdded = (callback) => {
  visitAddedCallback = callback;
};