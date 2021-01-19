<template>
  <div
    class="caption-switcher"
    :style="style"
  >
    <div
      v-for="(caption, k) in captions"
      :class="[
        'holder',
        { 'is-visible': k === activeIndex }
      ]"
      ref="captions"
    >
      <Caption
        :progress="progress"
        :caption-html="caption"
      />
    </div>
  </div>    
</template>

<script>
import Caption from '~/components/Caption'

export default {
  components: {
    Caption
  },
  props: {
    captions: {
      type: Array,
      default: () => []
    },
    progress: {
      type: String,
      default: ''
    },
    activeIndex: {
      type: Number
    }
  },
  data() {
    return {
      height: 0
    }
  },
  mounted() {
    this.$nextTick(this.setHeight)
  },
  computed: {
    style() {
      if (process.server) return {}

      return { height: `${this.height}px`}
    }
  },
  watch: {
    '$store.state.windowWidth': {
      handler: 'setHeight',
      immediate: true
    },
    height() {
      this.$emit('height-change', this.height)
    }
  },
  methods: {
    setHeight() {
      let h = 0

      if (this.$refs.captions) {
        const heights = this.$refs.captions.map(el => el.clientHeight)  
        h = Math.max(...heights)
      }
      
      this.height = h
    }
  }
}
</script>

<style lang="scss" scoped>
.caption-switcher {

}

.holder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  opacity: 0;
  pointer-events: none;

  &.is-visible {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>