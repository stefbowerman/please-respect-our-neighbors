<template>
  <simplebar
    :class="[
      'text-box',
      { 'is-locked': locked }
    ]"
    data-simplebar-auto-hide="false"
  >
    <div
      class="text-box-inner"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
      @mousemove="locked = false"
      @touchstart="locked = false"
    >
      <div
        v-if="formattedDate"
        v-html="formattedDate"
        class="text-box-date"
      />
      <div
        v-if="content"
        v-html="content"
        :class="contentClasses"
      />
    </div>      
  </simplebar>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'
import simplebar from 'simplebar-vue'

export default {
  components: {
    simplebar
  },
  props: {
    date: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: false
    },
    textSize: {
      type: String,
      required: false,
      validator(val) {
        // 'Large' is the default (it doesn't really do anything)
        return ['Small', 'Large'].includes(val)
      }
    }
  },
  data() {
    return {
      locked: true
    }
  },
  created() {
    this.mouseenterTimeout = null
  },
  computed: {
    formattedDate() {
      if (!this.date) return null
        
      const d = new Date(this.date)
      const day   = d.getDate().toString()
      const month = (d.getMonth() + 1).toString()
      const year  = d.getFullYear().toString()

      return `${day.length === 1 ? `0${day}` : day}<br />${month.length === 1 ? `0${month}` : month}<br />${year}`
    },
    contentClasses() {
      return [
        'text-box-content',
        (this.textSize && `size-${_kebabCase(this.textSize)}`)
      ]
    }
  },
  methods: {
    onMouseenter() {
      this.mouseenterTimeout = setTimeout(() => {
        this.locked = false
      }, 700)
    },
    onMouseleave() {
      clearTimeout(this.mouseenterTimeout)
      this.locked = true
    }
  }
}
</script>

<style lang="scss" scoped>
.text-box {
  height: 100%;
  transition: opacity 200ms ease-out;

  ::v-deep .simplebar-wrapper {
    margin-right: 17px !important;
    border: 1px solid var(--text-color);
    background-color: $off-white;
  }

  ::v-deep .simplebar-content-wrapper {
    overflow-x: hidden !important;

    &::-webkit-scrollbar {
      display: none;
    }    
  } 

  &.is-locked ::v-deep .simplebar-content-wrapper {
    overflow-y: hidden !important;
  }

  // Need this otherwise the text overflows on top of the border
  ::v-deep .simplebar-mask {
    top: 1px;
    bottom: 1px;
    right: 18px;
  }

  ::v-deep .simplebar-track {
    border: 1px solid var(--text-color);

    &.simplebar-horizontal {
      display: none;
    }
  }

  ::v-deep .simplebar-scrollbar {
    pointer-events: auto;
    background-color: var(--text-color);

    &.simplebar-hover {
      cursor: grab;
    }

    &:before {
      display: none;
    }
  }

  &.simplebar-dragging ::v-deep .simplebar-scrollbar {
    cursor: grabbing !important;
  }
}

.text-box-inner {
  padding: 41px;
  padding-left: 22px;

  @include bp-up(lg) {
    padding: 43px;
    padding-left: 100px;
    padding-bottom: 100px;    
  }
}

.text-box-scroll-bar {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 11px;
  background-color: black;

  @include bp-up(lg) {
    width: 7px;
  }
}
</style>