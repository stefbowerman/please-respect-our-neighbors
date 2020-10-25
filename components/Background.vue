<template>
  <div class="background">
    <div class="gradient" :style="gradientStyles" />
  </div>
</template>

<script>
import { animate, linear, easeInOut } from 'popmotion'

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
  mounted() {
    const themeColors = themeColorPalettes[this.$store.state.theme.toUpperCase()]
    
    if (themeColors) {
      this.gradientTopColor = themeColors.top
      this.gradientBottomColor = themeColors.bottom
    }
  },
  computed: {
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
          duration: 800,
          ease: easeInOut, // linear,
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
          duration: 800,
          ease: easeInOut, // linear,
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
  @include fs-height;
  z-index: $zindex-background;
  background-color: var(--background-color);
  pointer-events: none;
}

.gradient {
  @include fill;

  .route-index &,
  .route-info &,
  .route-exhibited-project &,
  .route-exhibited-project-uid & {
    background-image: $light-gradient;
  }

  .route-projects &,
  .route-projects-uid & {
    background-image: $dark-gradient;
  }

  .route-partners & {
    background-image: $red-gradient;
  }
}
</style>