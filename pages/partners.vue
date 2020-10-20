<template>
  <div class="container">
    <div class="wall">
      <partners-project
        v-for="(project, i) in projects"
        :key="`project-${i}`"
        :project="project"
        :activePartnerUID="activePartnerUID"
        @partner-click="onPartnerClick"
        @partner-mouseenter="onPartnerMouseenter"
        @partner-mouseleave="onPartnerMouseleave"
      />
    </div>
  </div>
</template>

<script>
import PartnersProject from '~/components/PartnersProject'

export default {
  components: {
    PartnersProject
  },
  data() {
    return {
      partners: [],
      activePartnerUID: null
    }
  },
  beforeCreate() {
    this.$store.commit('SET_THEME', 'red')
  },
  // Is there a way to do this with a mixin?  Mounted calls setTheme, beforeDestroy called unsetTheme?
  // Also, do the theme stuff beforeCreate?  How early can we run it?
  mounted() {
    this.$store.commit('SET_HEADER_TITLE', 'Current Partners')
    this.$store.commit('SET_HEADER_SUBTITLE', 'Including collective members')
  },
  methods: {
    onPartnerClick(partnerName) {
      console.log(`Clicked ${partnerName}`)
    },
    onPartnerMouseenter(partnerUID) {
      this.activePartnerUID = partnerUID
    },
    onPartnerMouseleave() {
      this.activePartnerUID = null
    }
  },
  head() {
    return {
      title: 'Partners', // @TODO - Pull this from store / API
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Our studio is built of core and collective members'
        }
      ]
    }
  },
  async asyncData({ $prismic, error, store }) {
    // store.state.projects.forEach(p => console.log(p))

    return {
      projects: store.state.projects
    }
  }
}
</script>

<style lang="scss" scoped>
.wall {
  padding-top: 200px;
  padding-bottom: 100px;

  @include text-big;
  font-weight: $font-weight-light;
  text-transform: none;

  @include bp-down(md) {
    font-size: 25px;
    line-height: (29px/25px);
  }

  @include bp-up(lg) {
    padding-top: 300px;
    padding-bottom: 200px;    
    padding-left: 20px;
    padding-right: 20px;    
  }
}
</style>