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
              <!-- @TODO - This should be an h1?  or we need to insert an SEO component in the layout -->
              <nuxt-link to="/">
                <span>Please Respect Our Neighbors Inc.</span>
              </nuxt-link><br />              
              <nuxt-link to="/projects">
                <span>Accumulated Projects</span>
              </nuxt-link>
              <nuxt-link to="/info">
                <span>Office Info</span>
              </nuxt-link>
              <nuxt-link to="/partners">
                <span>Current Partners</span>
              </nuxt-link>
              <nuxt-link to="/exhibited-project">
                <span>Exhibited Project</span>
              </nuxt-link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  position: fixed;
  z-index: $zindex-header;
  top: 72px;
  left: 0;
  right: 0;
  text-align: center;

  @include theme-text;

  @include bp-up(lg) {
    top: 50px;
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

.links {
  a {
    display: inline-block;
    margin: 0 16px 20px;

    span {
      border: 1px solid transparent;
    }

    &:hover span {
      border-color: var(--text-color);
    }
  }
}
</style>