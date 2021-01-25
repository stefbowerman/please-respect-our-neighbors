<template>
  <transition
    name="overlay"
    v-on:enter="enter"
    v-on:after-enter="afterEnter"
    v-on:leave="leave"
    v-on:after-leave="afterLeave"
  >
    <div class="overlay" v-show="show">
      <div
        ref="dialog"
        class="dialog"
        role="dialog"
      >
        <div class="overlay-body">
          <slot name="body" />
        </div>
      </div>
      <transition
        name="overlay-close"
      >
        <div
          class="close"
          @click="close"
          v-show="show"
        >
          Exit Viewer
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    document && document.addEventListener('keydown', this.keydownHandler);
  },
  beforeDestroy() {
    document && document.removeEventListener('keydown', this.keydownHandler);
  },    
  watch: {
    show(val) {
      this.$store.commit('SET_OVERLAY_OPEN', !!val)
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    leftKey() {
      this.$emit('left-key')
    },
    rightKey() {
      this.$emit('right-key')
    },
    keydownHandler(e) {
      if (!this.show) return

      switch (e.keyCode) {
        case 27:
          this.close()
          break
        case 37:
          this.leftKey()
          break
        case 39:
          this.rightKey()
          break        
      }
    },
    enter(el) {
      // Make sure we're always scrolled to the top
      this.$refs.dialog.scrollTop = 0
      this.$emit('enter')
    },
    leave() {
      this.$emit('leave')
    },
    afterEnter() {
      this.$emit('after-enter')
    },
    afterLeave() {
      this.$emit('after-leave')
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  @include fill(fixed);
  z-index: $zindex-overlay;
  height: 100%;
  // height: var(--unit-100vh);

  background-color: transparentize($black, 0.11);
}

.dialog {
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.close {
  position: fixed;
  display: inline-block;
  z-index: 1;
  top: 67px;
  right: 1px;
  padding: 10px;
  font-size: 15px; // @TODO - Var this
  font-weight: $font-weight-light;
  cursor: pointer;

  @include bp-up(md) {
    top: 62px;
    right: 38px;
    font-size: 40px;
  }

  // Need this here so we can apply the transition to .close
  span {
    @include theme-text;
  }
}

.overlay-body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>