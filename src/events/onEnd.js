export default function onEnd(socket) {
  socket.on('end', () => {
    console.log('Connection closed');
  });
}
