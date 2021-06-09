<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarCollapse"
      aria-controls="navbarCollapse"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <nuxt-link :to="`/`" class="nav-link">
            Top
          </nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link :to="`/tasks/`" class="nav-link">
            タスク一覧
          </nuxt-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TaskNavbar'
}
</script>
