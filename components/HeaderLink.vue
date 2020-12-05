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
  methods: {
    onMouseenter() {
      this.hovered = true
    },
    onMouseleave() {
      this.transX = 0
      this.transY = 0
      this.hovered = false
    },
    onMousemove(e) {
      if (this.$store.state.isTouch) return

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

  @include bp-up(xxl) {
    font-size: $font-size-base;
  }

  @include bp-up(md) {
    font-size: clamp(16px, calc(16px + 0.23vw), $font-size-base);
  }

  a {
    display: inline-block;
    padding: 9px 2px;

    @include bp-up(xxl) {
      padding-left: 6px;
      padding-right: 6px;
    }

    @include bp-up(xxxl) {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
}

.bounds {
  position: relative;
  border: 1px solid transparent;
  overflow: hidden;

  .is-active & {
    border-color: var(--text-color);
    background-color: var(--background-color);
    transition: background-color 500ms ease; // --background-color changes as you scroll
  }
}

// Force the top and bottom to touch the text without messing with line height
.placement {
  margin-bottom: -7px;
  transform: translateY(-3px);
}

.text {
  display: inline-block;
}
</style>