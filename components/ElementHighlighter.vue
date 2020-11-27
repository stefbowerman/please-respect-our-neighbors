<template>
  <div
    class="element-highlighter"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
    @mousemove="onMousemove"
  >
    <slot />
  
    <div
      class="element-highlighter__box"
      :style="boxStyle"
      v-show="showBox"
    />
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hovered: false,
      hoveredEl: null,      
      boxTop: 0,
      boxLeft: 0,
      boxWidth: `100%`,
      boxHeight: 0
    }
  },
  watch: {
    hoveredEl(newEl, oldEl) {
      if (newEl && newEl !== this.$el) {
        this.boxTop = newEl.offsetTop
        this.boxLeft = newEl.offsetLeft
        this.boxWidth = newEl.offsetWidth
        this.boxHeight = newEl.offsetHeight
      }
    }
  },  
  computed: {
    showBox() {
      return this.hovered && !this.disabled
    },
    boxStyle() {
      return {
        top: `${this.boxTop}px`,
        left: `${this.boxLeft}px`,
        height: `${this.boxHeight}px`,
        width: (typeof this.boxWidth === "number" ? `${this.boxWidth}px` : this.boxWidth) // Allows 100 or '100%'
      }
    }    
  },
  methods: {
    onMouseenter(e) {
      this.hovered = true
      this.hoveredEl = e.target
    },
    onMouseleave(e) {
      this.hovered = false
      this.hoveredEl = null
    },
    onMousemove(e) {
      this.hoveredEl = e.target
    }
  }
}
</script>

<style lang="scss">
.element-highlighter {
  position: relative;
}

.element-highlighter__box {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  border: 1px solid $black;
  background-color: $white;
  transition: all 0.2s cubic-bezier(0.43, 0.27, 0.14, 0.82);
  pointer-events: none;
}
</style>