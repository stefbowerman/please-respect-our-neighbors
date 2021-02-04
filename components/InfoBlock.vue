<template>
  <div :class="classes">
    <element-highlighter>
      <h3
        v-if="title"
        class="block__title"
        >
        <!--  Add extra span for highlight effect-->
        <span v-text="title" />
      </h3>
      <div class="block__content">
        <mailing-list
          v-if="type === 'newsletter'"
          :action-url="$store.state.siteSettings.mailchimpFormUrl"
        />
        <div
          v-html="content"
        />
      </div>
    </element-highlighter>
  </div>
</template>

<script>
import _get from 'lodash/get'
import _kebabCase from 'lodash/kebabCase'

import ElementHighlighter from '~/components/ElementHighlighter'
import MailingList from '~/components/MailingList'

export default {
  components: {
    ElementHighlighter,
    MailingList
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

  &--contact {
    .block__content {
      @include bp-down(xs) {
        font-size: 13px;
        line-height: (16px/13px);
      }
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
  margin-bottom: 13px;
  @include text-title;

  @include bp-down(md) {
    font-size: 27px;
    line-height: 25px;
  }
}

.block__content {
  @include text-subtitle;  
}

.mailing-list {
  text-align: center;

  ::v-deep form {
    margin: 0.5em auto;
    width: 90%;

    @include bp-up(sm) {
      width: 80%;  
    }
  }

  ::v-deep input[type="email"] {
    text-align: center;
    text-transform: uppercase;

    @include bp-up(lg) {
      border-bottom-width: 3px;
    }
  }
}
</style>