export default function onData(socket) {
  socket.on('data', (data) => {
    console.log(data.toString());
  });
}
