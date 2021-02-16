<template>
  <div class="page-title">
    <div class="container">
      <div class="row">
        <div class="primary-column">
          <element-highlighter
            :disabled="!highlighterEnabled"
          >
            <div>
              <h1
                class="title"
                v-text="title"
                v-if="title && title.length"
              />

              <h3
                class="subtitle"
                v-text="subtitle"
                v-if="subtitle && subtitle.length"
              />
            </div>
          </element-highlighter>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ElementHighlighter from '~/components/ElementHighlighter'

export default {
  components: {
    ElementHighlighter
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    highlighterEnabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      height: 0
    }
  },
  mounted() {
    this.setHeight()
    window.addEventListener('resize', this.setHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setHeight)
  },
  methods: {
    setHeight() {
      const { height } = this.$el.getBoundingClientRect()
      
      this.height = height
    }
  },
  watch: {
    height(newHeight, oldHeight) {
      newHeight !== oldHeight && this.$emit('height-change', newHeight)
    },
    title() {
      this.$nextTick(() => this.setHeight())
    },
    subtitle() {
      this.$nextTick(() => this.setHeight())
    }
  }
}
</script>

<style lang="scss" scoped>
.page-title {
  text-align: center;
  padding-top: 72px;

  @include bp-up(lg) {
    padding-top: 50px;
    z-index: $zindex-page-title;
  }
}

.title,
.subtitle {
  font-weight: $font-weight-normal;
}

.title {
  @include text-title;
  margin-left: auto;
  margin-right: auto;
  max-width: 20em;
}

.subtitle {
  @include text-subtitle;
  margin: 2px 0 0; 
}
</style>