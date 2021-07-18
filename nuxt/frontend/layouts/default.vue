<template>
  <div>
    <!-- <template>
      <div>
        <TaskNavbar :newTaskTitle.sync="newTask.title" :onSubmit.sync="submitNewTask"></TaskNavbar>
      </div>
    </template> -->
    <main class="container">
      <Nuxt />
    </main>
  </div>
</template>

<script>
// import TaskNavbar from '~/components/TaskNavbar.vue'
export default {
  name: 'default'
  // ,
  // components: {
  //   TaskNavbar
  // }
}
</script>

<style>
body {
  background: #edeefd;
}
main {
  /* margin-top: 70px; */
  margin-top: 30px;
}
</style>
