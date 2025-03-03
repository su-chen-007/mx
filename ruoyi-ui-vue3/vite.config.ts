import { fileURLToPath, URL } from "node:url";
import createVitePlugins from "./vite/plugins";
import serveConfig from "./vite/vite.config.serve";
import buildConfig from "./vite/vite.config.serve";
import { defineConfig, loadEnv } from "vite";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV } = env;
  const config = command === "build" ? buildConfig : serveConfig;
  return {
    plugins: [
      createVitePlugins(VITE_APP_ENV, command === "build"),
      viteCommonjs(), // 添加 viteCommonjs 插件
      vueJsx(), // 添加 vueJsx 插件
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    ...config,
  };
});
