<template>
  <div>
    <h1>Accumulated Projects</h1>
    <h4>Collected Works 2018 - 2020</h4>
    <ul v-for="project in projects">
      <li>
        <div>
          <h4 v-text="$prismic.asText(project.title)" />
          <div v-html="$prismic.asHtml(project.description)" />
          <nuxt-link :to="`/projects/${project.uid}`">Go To Project</nuxt-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    projects: []
  },
  async asyncData({ $prismic, error }) {
    const data = await $prismic.api.query(
      $prismic.predicates.at('document.type', 'project', { orderings: '[my.project.date asc]'})
    )

    const projects = data.results.map(project => {
      return {
        ...project.data,
        uid: project.uid
      }
    })

    // Sort oldest -> newest
    projects.sort((a, b) => new Date(a.date) >= new Date(b.date) ? -1 : 1) 

    return {
      projects
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin: 50px 0;
  }
}
</style>