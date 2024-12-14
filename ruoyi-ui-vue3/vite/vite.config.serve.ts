import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: "VITE_", //环境变量默认前缀
  server: {
    // 服务器主机名，默认是 localhost
    host: "localhost",
    // 是否开启自动打开浏览器
    open: true,
    port:11111,
    proxy: {
      "^/dev-api": {
        target: `http://1.15.104.93:8080`,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '\/' + process.env.VUE_APP_BASE_API)
        rewrite: (path) => path.replace(/^\/dev-api/,''),
      },
    },
  },
});
