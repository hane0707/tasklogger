<template>
  <div class="row">
    <div class="col">
      <div class="row mb-4">
        <input
          id="task-title"
          v-model="newTask.title"
          type="text"
          class="form-control col-sm-4"
          placeholder="タスクのタイトル">
        <button @click="registTask(newTask, searchDate)" class="btn btn-success col-sm-2 mx-2 my-sm-0">新しい作業を開始する</button>
        </div>
      <div class="row mb-4">
        <input type="date" v-model="searchDate" class="col-sm-2 form-control">
        <button @click="getList(searchDate)" class="btn btn-primary mx-2">検索</button>
        {{ count }} 件の履歴があります。
      </div>
      <div v-for="task in viewList" :key="task.id">
        <div class="mb-4">
          <!-- TaskCard Start-->
          <div class="card task-card">
            <div class="card-body">
              <p><b>タイトル：</b>{{ task.title }}</p>
              <div>
                <p><b>詳細：</b></p>
                <p class="ml-4">{{ task.details }}</p>
              </div>
              <p><b>開始日時：</b>{{ task.start_date }} {{ task.start_time }}</p>
              <p><b>終了日時：</b>{{ task.end_date }} {{ task.end_time }}</p>
              <nuxt-link :to="`/tasks/${task.id}/edit/`" class="btn btn-sm btn-outline-primary">
                編集
              </nuxt-link>
              <button @click="deleteTask(task.id, searchDate)" class="btn btn-sm btn-outline-danger">削除</button>
            </div>
          </div>
          <!-- TaskCard End -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
// import TaskCard from '~/components/TaskCard.vue'

export default {
  name: 'tasks',
  data () {
    return {
      searchDate: moment(new Date()).format('YYYY-MM-DD'),
      newTask: {
        title: '',
        details: '',
        start_date: moment(new Date()).format('YYYY-MM-DD'),
        start_time: moment(new Date()).format('HH:mm:ss'),
        end_date: null,
        ent_time: null
      }
    }
  },
  methods: {
    ...mapActions({
      getList: 'tasks/getList'
      // registTask: 'tasks/registTask'
    }),
    registTask (newTask, date) {
      this.$store.dispatch('tasks/registTask', { newTask, date })
      newTask.title = ''
    },
    deleteTask (id, date) {
      // 複数の引数を1つのオブジェクトとしてしか渡せないため、mapActionsを使わない
      this.$store.dispatch('tasks/deleteTask', { id, date })
    }
  },
  mounted () {
    this.getList(this.searchDate)
  },
  computed: {
    ...mapState({
      list: state => state.tasks.list,
      viewList: state => state.tasks.viewList,
      count: state => state.tasks.count
    })
  },
  filters: {
    substrHM (date) {
      return date.substr(0, 5)
    }
  }
}
</script>

<style>
.task-card {
    box-shadow: 0 1rem 1.5rem rgba(0,0,0,.6);
}
</style>
