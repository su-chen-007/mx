<template>

    <!-- 第一个粒子背景效果 -->
    <vue-particles id="tsparticles1" @particles-loaded="particlesLoaded" />

    <!-- 第二个粒子背景效果 -->
    <vue-particles
        id="tsparticles2"
        @particles-loaded="particlesLoaded"
        :options="particleOptions"
    />

</template>

<script setup lang="ts">
defineOptions({
  name:"ParticleBackground",
})
const particleOptions = {
  background: {
    color: {
      value: 'rgba(3,3,3,0.72)'
    }
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push'
      },
      onHover: {
        enable: true,
        mode: 'repulse'
      },
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40
      },
      push: {
        quantity: 4
      },
      repulse: {
        distance: 200,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      value: '#ffffff'
    },
    links: {
      color: '#ffffff',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: 'bounce',
      random: false,
      speed: 6,
      straight: false
    },
    number: {
      density: {
        enable: true,
      },
      value: 80
    },
    opacity: {
      value: 0.5
    },
    shape: {
      type: 'circle'
    },
    size: {
      value: { min: 1, max: 5 }
    }
  },
  detectRetina: true
};

const particlesLoaded = async (container: any) => {
  console.log("Particles container loaded", container);
};
</script>

<style lang='scss' scoped>
</style>