<template>
  <div :class="classes">
    <h3 class="block__title" v-text="title" />
    <div class="block__content" v-html="content"></div>

    <div class="block__box" />
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
  computed: {
    classes() {
      const t = _kebabCase(this.type).replace('-block', '')

      return [
        'block',
        ( t && `block--${t}` )
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
  position: relative;
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

.block__title,
.block__content {
  position: relative;
  z-index: 1; // Push above the box
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
  top: -13px;
  left: 0;
  right: 0;
  border: 1px solid transparent;
  height: 0;
  transition: all 0.4s cubic-bezier(0.43, 0.27, 0.14, 0.82);

  .block:hover & {
    height: 105%;
    border-color: $black;
    background-color: $white;
  }
}
</style>