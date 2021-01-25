<template>
  <div :class="classes">
    <element-highlighter>
      <h3 class="block__title">
        <!--  Add extra span for highlight effect-->
        <span v-text="title" />
      </h3>
      <div class="block__content" v-html="content"></div> 
    </element-highlighter>
  </div>
</template>

<script>
import _get from 'lodash/get'
import _kebabCase from 'lodash/kebabCase'

import ElementHighlighter from '~/components/ElementHighlighter'

export default {
  components: {
    ElementHighlighter
  },  
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

    ::v-deep p + p {
      margin-top: 16px;

      @include bp-up(lg) {
        margin-top: 58px;
        margin-top: 3vw;
      }
    }
  }

  &--text {
    ::v-deep p + p {
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
    
    ::v-deep a {
      text-decoration: underline;
    }  
  }
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
</style>