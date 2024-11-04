export default function onError(server) {
  server.on('error', (err) => {
    console.error(err);
  });
}
