<template>
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
</template>

<style lang="scss" scoped>
nav {
  position: fixed;
  z-index: 100;
  top: 55px;
  right: 30px;
  font-family: $font-family-secondary;
  text-align: center;
}

.links {
  max-width: 775px;

  a {
    display: inline-block;
    margin: 0 16px 20px;
  }
}
</style>
