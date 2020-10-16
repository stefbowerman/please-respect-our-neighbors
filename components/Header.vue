<template>
  <header>
    <div class="container">
      <div class="row">
        <div class="primary-column">
          <!-- -->
        </div>

        <div class="secondary-column">
          <nav>
            <div class="links">
              <header-link to="/" text="Please Respect Our Neighbors Inc."/>
              <br />
              <header-link to="/projects" text="Accumulated Projects"/>
              <header-link to="/info" text="Office Info"/>
              <header-link to="/partners" text="Current Partners"/>
              <header-link to="/exhibited-project" text="Exhibited Project"/>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import HeaderLink from '~/components/HeaderLink'

export default {
  components: {
    HeaderLink
  }
}
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  z-index: $zindex-header;
  top: 62px;
  left: 0;
  right: 0;
  text-align: center;

  @include theme-text;

  @include bp-up(lg) {
    top: 40px;
  }
}

nav {
  font-family: $font-family-secondary;
  font-weight: $font-weight-bold;

  display: none;

  @include bp-up(lg) {
    display: block;
  }
}
</style>