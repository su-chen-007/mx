import type { App } from "vue";
// 粒子效果
import Particles from "@tsparticles/vue3";
import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
// import { loadSlim } from "@tsparticles/slim"; // if
const install = (Vue: App) => {
  Vue.use(Particles as any, {
    init: async (engine: any) => {
      await loadFull(engine); // you can load the full tsParticles library from "tsparticles" if you need it
      // await loadSlim(engine); // or you can load the slim version from "tsparticles-slim" if don't need Shapes or Animations
    },
  });
  // app.use(Particles, {
  //   init: async (engine) => {
  //     await loadSlim(engine); // or you can load the slim version from "@tsparticles/slim" if don't need Shapes or Animations
  //   },
  // });
  //   Vue.use(formCreate)
  //   Vue.use(fcDesigner)
};

export default install;
