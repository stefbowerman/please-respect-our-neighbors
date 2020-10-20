<template>
  <div class="page-title">
    <div class="container">
      <div class="row">
        <div class="primary-column">
          <div v-show="show">
            <transition :name="null" mode="out-in">
              <h1
                class="title"
                v-text="title"
                v-if="title && title.length"
                :key="title"
              />
            </transition>

            <transition :name="null" mode="out-in">
              <h3
                class="subtitle"
                v-text="subtitle"
                v-if="subtitle && subtitle.length"
                :key="subtitle"
              />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    show() {
      return this.title || this.subtitle
    },
    title() {
      return this.$store.state.header.title
    },
    subtitle() {
      return this.$store.state.header.subtitle
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