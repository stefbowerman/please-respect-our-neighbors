<template>
  <div class="background">
    <!-- @TODO - May need to turn the gradient into it's own component so we can re-use it on the mobile menu -->
    <div :class="gradientClasses" />
  </div>
</template>

<script>
// Watch $store.state.theme and update gradient variables (color & visibility) 
export default {
  data() {
    return {
      // gradientTopColor: ''
      // gradientBottomColor: ''
    }
  },
  computed: {
    showGradient() {
      let show = false

      switch (this.$route.name) {
          case "index":
          case "info":
          case "exhibited-project":
          case "projects":
              show = true
              break;
      }
      
      return show
    },
    gradientClasses() {
      return [
        'gradient',
        { 'visible': this.showGradient }
      ]
    },
    // gradientImageStyle() {
    //   return {
    //     backgroundImage: `linear-gradient(0deg, ${this.gradientBottomColor}, ${this.gradientTopColor})`;
    //   }
    // }
  },
  watch: {
    '$store.state.theme'(newTheme, oldTheme) {
      console.log(`Need to tween gradient values.  Switching from ${oldTheme} -> ${newTheme}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.background {
  @include fill(fixed);
  z-index: $zindex-background;
  height: var(--unit-100vh);
  background-color: var(--background-color);
  pointer-events: none;

  transition: background-color 1.3s linear;
}

.gradient {
  @include fill;

  opacity: 0;
  transition: opacity 0.5s ease-in-out;

  &.visible {
    opacity: 1;
  }

  .route-index &,
  .route-info &,
  .route-exhibited-project & {
    background-image: linear-gradient(0deg, #D8D8D8, $white);
  }

  .route-projects & {
    background-image: linear-gradient(180deg, #393939, $black);
  }
}
</style>