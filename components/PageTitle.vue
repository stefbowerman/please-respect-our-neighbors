<template>
  <div class="page-title">
    <div class="container">
      <div class="row">
        <div class="primary-column">
          <element-highlighter
            :disabled="highlighterDisabled"
          >
            <div v-show="show">
              <h1
                class="title"
                v-text="title"
                v-if="title && title.length"
                :key="title"
              />

              <h3
                class="subtitle"
                v-text="subtitle"
                v-if="subtitle && subtitle.length"
                :key="subtitle"
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
  mounted() {
    this.commitHeight()
    window.addEventListener('resize', this.commitHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.commitHeight)
  },
  computed: {   
    show() {
      return this.title || this.subtitle
    },
    highlighterDisabled() {
      return this.$route.name !== 'info' // Only show on the info route
    },
    title() {
      return this.$store.state.pageTitle.title
    },
    subtitle() {
      return this.$store.state.pageTitle.subtitle
    }
  },
  methods: {
    commitHeight() {
      const rect = this.$el.getBoundingClientRect()
      const h = rect.height + (rect.top > 0 ? rect.top : 0) // Need this incase the page title is relative and scrolls with the page...
      this.$store.commit('SET_PAGE_TITLE_HEIGHT', h)
    }
  },
  watch: {
    '$store.state.pageTitle.title'() {
      this.$nextTick(() => this.commitHeight())
    },
    '$store.state.pageTitle.subtitle'() {
      this.$nextTick(() => this.commitHeight())
    }
  }
}
</script>

<style lang="scss" scoped>
.page-title {
  position: sticky;
  z-index: 1;
  top: 72px;
  left: 0;
  right: 0;
  text-align: center;

  @include theme-text;

  @include bp-up(lg) {
    top: 50px;
    z-index: $zindex-page-title;
  }

  .route-info &,
  .route-partners &,
  .route-projects & {
    position: relative;
    z-index: 1;
    top: auto;
    margin-top: 72px;

    @include bp-up(lg) {
      margin-top: 50px;
    }
  }

  .route-exhibited-project & {
    position: fixed;
  }
}

.title {
  @include text-title;
  margin-left: auto;
  margin-right: auto;
  max-width: 20em;

  @include bp-up(lg) {
    .route-projects & {
      font-size: clamp(27px, calc(4px + 3.3vw), 70px);
    }
    .route-partners & {
      font-size: clamp(27px, calc(4px + 4.2vw), 80px);
    }
  }
}

.subtitle {
  @include text-subtitle;
  font-weight: $font-weight-medium;
  margin: 2px 0 0;

  @include bp-up(lg) {
    .route-projects & {
      // Same as text-subtitle but just make sure the lower value is smaller on this route to match the title
      font-size: clamp(15px, calc(5px + 2.25vw), 46px);
    }

    .route-partners & {
      // Same as text-subtitle but just make sure the lower value is smaller on this route to match the title
      font-size: clamp(15px, calc(5px + 2.15vw), 46px);
    }    
  }  
}
</style>