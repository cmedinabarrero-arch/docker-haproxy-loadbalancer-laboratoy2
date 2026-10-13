export default {
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api": "http://haproxy",
    },
  },
};
