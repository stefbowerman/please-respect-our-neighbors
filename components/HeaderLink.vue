<template>
  <div :class="classes">
    <nuxt-link
      :to="to"
      @mouseenter.native="onMouseenter"
      @mouseleave.native="onMouseleave"
      @mousemove.native="onMousemove"
    >
      <div
        class="bounds"
        ref="bounds"
      >
        <div class="placement">
          <span
            class="text"
            v-text="text"
            :style="{ transform: textTransform }"
            ref="text" 
          />
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import _round from 'lodash/round'

export default {
  props: {
    to: {
      type: String
    },
    text: {
      type: String
    }
  },
  data() {
    return {
      hovered: false,
      transX: 0,
      transY: 0
    }
  },
  computed: {
    classes() {
      return [
        'header-link',
        { 'is-active': this.hovered }
      ]
    },
    textTransform() {
      if (this.transX === 0 && this.transY === 0) {
        return 'none'
      }
      else {
        return `translate(${this.transX}px, ${this.transY}px)`
      }
    }
  },
  watch: {
    // Reset on url change, otherwise we'll get a weird background color change from switching routes
    '$route.fullPath'(to, from) {
      this.reset()
    }
  },  
  methods: {
    reset() {
      this.hovered = false
      this.transX = 0
      this.transY = 0
    },
    onMouseenter() {
      this.hovered = true
    },
    onMouseleave() {
      this.reset()
    },
    onMousemove(e) {
      if (this.$store.state.isTouch || this.hovered === false) return

      const { left, top, height, width } = this.$refs.bounds.getBoundingClientRect()

      const x = e.clientX - left - width/2
      const y = e.clientY - top - height/2

      this.transX = _round(x, 2) * 0.25 // Reduce motion
      this.transY = _round(y, 2) * 0.15 // Reduce motion
    }
  }
}
</script>

<style lang="scss" scoped>
.header-link {
  display: inline-block;
  font-size: 16px;

  @include bp-up(lg) {
    font-size: clamp(16px, calc(16px + 0.23vw), #{$font-size-base});
  }

  @include bp-up(xxxl) {
    font-size: $font-size-base * 0.96;
  }

  body.no-cssclamp & {
    @include bp-up(lg) {
      font-size: 18px;
    }

    @include bp-up(xxl) {
      font-size: 19.4px;
    }

    @include bp-up(xxxl) {
      font-size: $font-size-base * 0.96;
    }
  }

  a {
    display: inline-block;
    padding: 10px 12px;

    @include bp-up(xxxl) {
      padding-left: 14px;
      padding-right: 14px;
    }
  }
}

.bounds {
  position: relative;
  overflow: hidden;

  .is-active & {
    background-color: var(--background-color-top);
  }
}

// Force the top and bottom to touch the text without messing with line height
.placement {
  margin-bottom: -7px;
  transform: translateY(-3px);
}

.text {
  display: inline-block;
  @include theme-text;
  transition-delay: 0.35s;
}
</style>