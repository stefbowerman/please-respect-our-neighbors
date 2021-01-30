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

  // @include bp-up(lg) {
  //   .route-projects &,
  //   .route-projects-uid &,
  //   .route-exhibited-project & {
  //     font-size: clamp(27px, calc(4px + 3.3vw), 70px);
  //   }
  //   .route-partners & {
  //     font-size: clamp(27px, calc(4px + 4.2vw), 80px);
  //   }
  // }
}

.subtitle {
  @include text-subtitle;
  margin: 2px 0 0;

  // @include bp-up(lg) {
  //   .route-projects &,
  //   .route-projects-uid &,
  //   .route-exhibited-project & {
  //     // Same as text-subtitle but just make sure the lower value is smaller on this route to match the title
  //     font-size: clamp(15px, calc(5px + 2.25vw), 46px);
  //   }

  //   .route-partners & {
  //     // Same as text-subtitle but just make sure the lower value is smaller on this route to match the title
  //     font-size: clamp(15px, calc(5px + 2.15vw), 46px);
  //   }    
  // }  
}
</style>