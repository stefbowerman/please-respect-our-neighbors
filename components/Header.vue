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
              <header-link to="/" text="Please Respect Our Neighbors Inc." />
              <div class="break" />
              <header-link to="/projects" text="Accumulated Projects" />
              <header-link to="/info" text="Office Info" />
              <header-link to="/partners" text="Current Partners" />
              <header-link to="/exhibited" text="Exhibited Project" />
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
  pointer-events: none; // Since we only use the secondary column for content, make sure you can use the mouse *through* the rest of the header; apply pointer-events to the nav element

  @include bp-up(lg) {
    top: 40px;
  }
}

nav {
  font-family: $font-family-secondary;
  font-weight: $font-weight-bold;
  pointer-events: auto;

  display: none;

  @include bp-up(lg) {
    display: block;
  }
}

.links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.break {
  flex: 0 0 100%;
}
</style>