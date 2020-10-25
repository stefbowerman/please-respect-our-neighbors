<template>
  <div class="page-title">
    <span
      v-if="false"
      style="position: fixed; top: 100px; left: 50px;"
      v-text="$store.state.pageTitle.height"
    />
    <div class="container">
      <div class="row">
        <div class="primary-column">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
    title() {
      return this.$store.state.pageTitle.title
    },
    subtitle() {
      return this.$store.state.pageTitle.subtitle
    }
  },
  methods: {
    commitHeight() {
      const h = this.$el.clientHeight + this.$el.getBoundingClientRect().top
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
  .route-partners & {
    position: relative;
  }
}

.title {
  @include text-title;
}

.subtitle {
  @include text-subtitle;
  font-weight: $font-weight-medium;
  margin: 2px 0 0;
}
</style>