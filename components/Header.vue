<template>
  <header>
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

        <div class="secondary-column">
          <nav>
            <div style="margin: 0 0 20px;">
              <!-- @TODO - This should be an h1?  or we need to insert an SEO component in the layout -->
              <nuxt-link to="/">Please Respect Our Neighbors Inc.</nuxt-link>
            </div>
            <div class="links">
              <nuxt-link to="/projects">Accumulated Projects</nuxt-link>
              <nuxt-link to="/info">Office Info</nuxt-link>
              <nuxt-link to="/partners">Current Partners</nuxt-link>
              <nuxt-link to="/exhibited-project">Exhibited Project</nuxt-link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </header>
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
header {
  position: fixed;
  z-index: $zindex-header;
  top: 73px;
  left: 0;
  right: 0;
  text-align: center;

  @include theme-text;

  @include bp-up(lg) {
    top: 50px;
  }
}

.title {
  @include text-title;
}

.subtitle {
  @include text-subtitle;
  font-weight: normal;
  margin-top: 2px;
}

nav {
  font-family: $font-family-secondary;
  font-weight: $font-weight-bold;

  display: none;

  @include bp-up(lg) {
    display: block;
  }
}

.links {
  a {
    display: inline-block;
    margin: 0 16px 20px;
  }
}
</style>