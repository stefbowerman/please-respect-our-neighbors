<template>
  <div class="background">
    <!-- @TODO - May need to turn the gradient into it's own component so we can re-use it on the mobile menu -->
    <div :class="gradientClasses" :style="gradientStyles" />
  </div>
</template>

<script>
import { animate, linear } from "popmotion"

const themeColorPalettes = {
  LIGHT: { top: '#FFFFFF', bottom: '#D8D8D8'},
  DARK:  { top: '#393939', bottom: '#000000'},
  RED:   { top: '#FD5858', bottom: '#FD5858'}
}

export default {
  data() {
    return {
      gradientTopColor: null,
      gradientBottomColor: null
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
    gradientStyles() {
      const styles = {}

      if (this.gradientBottomColor && this.gradientTopColor) {
        styles.backgroundImage = `linear-gradient(0deg, ${this.gradientBottomColor}, ${this.gradientTopColor})`
      }
     
      return styles
    }
  },
  watch: {
    '$store.state.theme'(newTheme, oldTheme) {
      const themeColors = themeColorPalettes[newTheme.toUpperCase()] || themeColorPalettes.LIGHT

      if (this.gradientTopColor === null) {
        this.gradientTopColor = themeColors.top
      }
      else {
        // Tween to the top color
        animate({
          from: this.gradientTopColor,
          to: themeColors.top,
          duration: 1300,
          ease: linear,
          onUpdate: (color) => {
            this.gradientTopColor = color
          }
        })
      }

      if (this.gradientBottomColor === null) {
        this.gradientBottomColor = themeColors.bottom
      }
      else {
        // Tween to the bottom color
        animate({
          from: this.gradientBottomColor,
          to: themeColors.bottom,
          duration: 1300,
          ease: linear,
          onUpdate: (color) => {
            this.gradientBottomColor = color
          }
        })        
      }
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
  transition: opacity 1s ease-in-out;

  &.visible {
    opacity: 1;
  }

  .route-index &,
  .route-info &,
  .route-exhibited-project & {
    background-image: linear-gradient(0deg, $light-gradient-bottom, $light-gradient-top);
  }

  .route-projects & {
    background-image: linear-gradient(0deg, $dark-gradient-bottom, $dark-gradient-top);
  }
}
</style>