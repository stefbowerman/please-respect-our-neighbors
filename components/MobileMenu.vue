<template>
  <transition
    name="fade"
  >  
    <div class="mobile-menu" v-show="show">
      <div class="dialog">
        <div class="body">
          <nav>
            <nuxt-link
              :event="null"
              @click.native.prevent="linkClick('/exhibited-project/')"
              to="/exhibited-project"
            >
              Exhibited Project
            </nuxt-link>
            <nuxt-link
              :event="null"
              @click.native.prevent="linkClick('/partners/')"
              to="/partners"
            >
              Current partners
            </nuxt-link>
            <nuxt-link
              :event="null"
              @click.native.prevent="linkClick('/info/')"
              to="/info"
            >
              Office Info
            </nuxt-link>
            <nuxt-link
              :event="null"
              @click.native.prevent="linkClick('/projects/')"
              to="/projects"
            >
              Accumulated Projects
            </nuxt-link>
          </nav>
        </div>
      </div>

      <span class="close" @click="close">Close</span>
      <Background />
    </div>
  </transition>
</template>

<script>
import Background from '~/components/Background'

export default {
  components: {
    Background
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show(val) {
      this.$store.commit('SET_MOBILE_MENU_OPEN', !!val)
    }
  },  
  methods: {
    close() {
      this.$emit('close')
    },
    linkClick(path) {
      console.log(path)
      this.$emit('link-click', path)
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-menu {
  @include fill(fixed);
  z-index: $zindex-mobile-menu;
}

.dialog {
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
}

.close {
  position: fixed;
  top: 29px;
  right: 27px;
  font-size: 18px; // @TODO - Var this
  font-family: $font-family-secondary;
  font-weight: $font-weight-bold;
  @include theme-text;
  cursor: pointer;
}

nav {
  padding: 0 50px;
  font-size: 47px;
  line-height: 1;
  text-align: center;
  font-weight: $font-weight-bold;
  font-family: $font-family-secondary;

  a {
    display: block;

    & + a {
      margin-top: 45px;
    }
  }
}
</style>