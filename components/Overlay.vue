<template>
  <transition
    name="fade"
    v-on:enter="enter"
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
      <span class="close" @click="close">Exit</span>
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
    keydownHandler(e) {
      if (this.show && e.keyCode == 27) {
        this.close()
      }
    },
    enter(el) {
      // Make sure we're always scrolled to the top
      this.$refs.dialog.scrollTop = 0
      this.$emit('enter')
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  z-index: $zindex-overlay;
  top: 0;
  left: 0;
  width: 100%;
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
  top: 77px;
  right: 130px;
  font-size: 46px; // @TODO - Var this
  @include theme-text;
  cursor: pointer;
}

.overlay-body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>