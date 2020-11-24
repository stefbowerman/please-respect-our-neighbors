<template>
  <div :class="classes">
    <div
      class="block__interaction"
      ref="block"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
      @mousemove="onMousemove"      
    >
      <h3 class="block__title" v-text="title" />
      <div class="block__content" v-html="content"></div>

      <div
        class="block__box"
        :style="boxStyle"
        v-show="hovered"
      />      
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'
import _kebabCase from 'lodash/kebabCase'

export default {
  props: {
    type: {
      type: String,
    },
    title: {
      type: String
    },
    content: {
      stype: String
    }
  },
  data() {
    return {
      hovered: false,
      hoveredEl: null,

      boxTop: 0,
      boxLeft: 0,
      boxWidth: 0
    }
  },
  watch: {
    hoveredEl(newEl, oldEl) {
      if (newEl && newEl !== this.$refs.block) {
        this.boxTop = newEl.offsetTop
        this.boxLeft = newEl.offsetLeft
        this.boxWidth = newEl.offsetWidth
        this.boxHeight = newEl.offsetHeight
      }
    }
  },
  computed: {
    classes() {
      const t = _kebabCase(this.type).replace('-block', '')

      return [
        'block',
        ( t && `block--${t}` )
      ]
    },
    boxStyle() {
      return {
        top: `${this.boxTop}px`,
        left: `${this.boxLeft}px`,
        width: `${this.boxWidth}px`,
        height: `${this.boxHeight}px`
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

<style lang="scss" scoped>
.block {
  font-weight: $font-weight-medium;
  text-align: center;
  word-break: break-word;

  &--description,
  &--text,
  &--links {
    @include text-big;

    @include bp-down(md) {
      font-size: 18px;
      line-height: 22px;
    }
  }

  &--contact {
    // @TODO - Make this scale?
    @include text-large;

    @include bp-down(md) {
      font-size: 13px;
      line-height: 17px;
    }

    /deep/ p + p {
      margin-top: 16px;

      @include bp-up(lg) {
        margin-top: 58px;
        margin-top: 3vw;
      }
    }
  }

  &--text {
    /deep/ p + p {
      margin-top: 22px;

      @include bp-up(lg) {
        margin-top: 49px;
        margin-top: 2.5vw;
      }
    }
  }

  &--links {
    .block__title {
      @include bp-up(lg) {
        margin-bottom: 48px;
        margin-bottom: 2.5vw;
      }
    }
    
    /deep/ a {
      text-decoration: underline;
    }  
  }
}

.block__interaction {
  position: relative;
  z-index: 1;
}

.block__title {
  margin-bottom: 3px;
  @include text-huge;

  @include bp-down(md) {
    font-size: 27px;
    line-height: 25px;
  }
}

.block__content {

}

// Bordered box that highlights on hover
// Need to finalize the styling
.block__box {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  border: 1px solid black;
  background-color: white;
  transition: all 0.2s cubic-bezier(0.43, 0.27, 0.14, 0.82);
  pointer-events: none;
}
</style>