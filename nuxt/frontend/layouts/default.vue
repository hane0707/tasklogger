<template>
  <div>
    <template>
      <div>
        <TaskNavbar :newTaskTitle.sync="newTask.title" :onSubmit.sync="submitNewTask"></TaskNavbar>
      </div>
    </template>
    <main class="container">
      <Nuxt />
    </main>
  </div>
</template>

<script>
import TaskNavbar from '~/components/TaskNavbar.vue'

export default {
  name: 'default',
  components: {
    TaskNavbar
  },
  data () {
    return {
      newTask: {
        title: '',
        details: '',
        start_date: '',
        start_time: '',
        end_date: '',
        ent_time: ''
      }
    }
  },
  methods: {
    async submitNewTask () {
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formData = new FormData()
      for (const data in this.newTask) {
        formData.append(data, this.newTask[data])
      }
      console.log(formData)
      try {
        const response = await this.$axios.$post('/api/tasks/', formData, config) // eslint-disable-line
        // this.$router.push('/tasks/')
      } catch (e) {
        console.log(e)
      }
    }

  }
}
</script>

<style>
body {
  background-color: rgb(209, 204, 204);
}
main {
  margin-top: 70px;
}
</style>
