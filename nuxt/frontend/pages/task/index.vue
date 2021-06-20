<template>
  <div class="row">
    <div class="col">
      <b-alert v-model="errorFlg" variant="danger" dismissible>
        {{ errorMessage }}
      </b-alert>
      <div class="row task-regist mb-4">
        <input
          id="task-title"
          v-model="newTask.title"
          type="text"
          class="form-control col-sm-4"
          placeholder="タスクのタイトル">
        <b-button @click="registTask(newTask)" variant="success" class="col-sm-2 mx-2 my-sm-0">
          新しい作業を開始する
        </b-button>
      </div>
      <div class="task-search">
        <div class="row mb-4">
          <input type="date" v-model="searchDate" class="col-sm-2 form-control">
          <b-button @click="getTasks()" variant="primary" class="mx-2">
            検索
          </b-button>
          {{ viewCount }} 件の履歴があります。
        </div>
        <div v-for="(task, index) in taskViewList" :key="task.id">
          <div class="mb-4">
            <!-- TaskCard Start-->
            <b-card
              :title="task.title"
              class="task-card">
              <b-card-body v-if="!task.isEdit">
                <p><b>詳細：</b></p>
                <p>{{ task.details }}</p>
                <p><b>開始日時：</b>{{ task.start_date }} {{ task.start_time }}</p>
                <p><b>終了日時：</b>{{ task.end_date }} {{ task.end_time }}</p>
              </b-card-body>
              <b-card-body v-else class="row">
                <div class="col-sm-12">
                  <label :for="`task-title-${index}`"><b>タイトル：</b></label>
                  <b-form-input
                    :id="`task-title-${index}`"
                    :value="task.title"
                    v-focus
                    placeholder="タスクのタイトルを記載してください。"></b-form-input>
                </div>
                <div class="col-sm-12">
                  <label :for="`task-detail-${index}`"><b>詳細：</b></label>
                  <b-form-textarea
                    :id="`task-detail-${index}}`"
                    :value="task.detail"
                    placeholder="タスクの詳細を記載してください。"
                    rows="3"
                    max-rows="8"></b-form-textarea>
                </div>
                <div class="col-sm-4">
                  <label :for="`task-startdate-${index}`"><b>開始日付：</b></label>
                  <b-form-datepicker
                    :id="`task-startdate-${index}`"
                    :value="task.start_date"
                    today-button
                    reset-button
                    close-button
                    locale="ja"></b-form-datepicker>
                </div>
                <div class="col-sm-4">
                  <label :for="`task-starttime-${index}`"><b>開始時間：</b></label>
                  <b-form-timepicker
                    :id="`task-starttime-${index}`"
                    :value="task.start_time"
                    now-button
                    reset-button
                    locale="ja"></b-form-timepicker>
                </div>
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                  <label :for="`task-enddate-${index}`"><b>終了日付：</b></label>
                  <b-form-datepicker
                    :id="`task-enddate-${index}`"
                    :value="task.end_date"
                    today-button
                    reset-button
                    close-button
                    locale="ja"></b-form-datepicker>
                </div>
                <div class="col-sm-4">
                  <label :for="`task-endtime-${index}`"><b>終了時間：</b></label>
                  <b-form-timepicker
                    :id="`task-endtime-${index}`"
                    :value="task.end_time"
                    now-button
                    reset-button
                    locale="ja"></b-form-timepicker>
                </div>
              </b-card-body>
              <b-button v-if="!task.isEdit" @click="task.isEdit = true" variant="outline-info">編集</b-button>
              <b-button v-if="task.isEdit" @click="task.isEdit = false" variant="outline-warning">キャンセル</b-button>
              <b-button v-if="task.isEdit" @click="updataTask(task.id)" variant="outline-success">更新</b-button>
              <b-button @click="deleteTask(task.id)" variant="outline-danger">削除</b-button>
            </b-card>
            <!-- TaskCard End -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// import TaskCard from '~/components/TaskCard.vue'

export default {
  name: 'task',
  data () {
    return {
      searchDate: moment(new Date()).format('YYYY-MM-DD'),
      newTask: {
        title: '',
        details: '',
        start_date: null,
        start_time: null,
        end_date: null,
        ent_time: null
      },
      taskList: [],
      taskViewList: [],
      viewCount: 0,
      errorFlg: false,
      errorMessage: ''
    }
  },
  methods: {
    async getTasks () {
      this.taskList = await this.$axios.$get('/api/task/')
      this.taskViewList = this.taskList.filter(
        task => task.start_date === this.searchDate
      )
      this.viewCount = this.taskViewList.length

      // 編集状態チェック用データを足す
      const addArray = _.cloneDeepWith(this.taskViewList, function (val) {
        if (typeof (val ?? '').id !== 'undefined') {
          val.isEdit = false
        }
      })
      this.taskViewList = addArray
    },
    async registTask () {
      // stateを初期化
      this.newTask.start_date = null
      this.newTask.start_time = null

      // タイトルが設定されていない場合は"no title"を設定
      this.newTask.title = !this.newTask.title ? 'no title' : this.newTask.title
      // 開始日時が設定されていない場合はシステム日時を設定
      const sysDatetime = new Date()
      this.newTask.start_date = !this.newTask.start_date ? moment(sysDatetime).format('YYYY-MM-DD') : this.newTask.start_date
      this.newTask.start_time = !this.newTask.start_time ? moment(sysDatetime).format('HH:mm:ss') : this.newTask.start_time

      try {
        // 新規タスクを登録
        const registResponse = await this.$axios.$post('/api/task/', this.newTask) // eslint-disable-line

        // 新規タスクの開始日時が登録前の最新タスクの開始日時より後、
        // かつ、より登録前の最新タスクの終了日時が設定されていない場合、
        // その終了日時に新規タスクの開始日時を設定する。
        const newTaskStart = this.newTask.start_date + this.newTask.start_time
        const beforeLatestTask = this.taskList[0]
        const beforeLatestTaskStart = beforeLatestTask.start_date + beforeLatestTask.start_time
        const beforeLatestTaskEnd = (beforeLatestTask.end_date ?? '') + (beforeLatestTask.end_time ?? '')
        if (newTaskStart >= beforeLatestTaskStart && !beforeLatestTaskEnd) {
          const updateResposnse = await this.$axios.$patch(`/api/task/${beforeLatestTask.id}/`, { // eslint-disable-line
            end_date: this.newTask.start_date,
            end_time: this.newTask.start_time
          })
        }
      } catch (error) {
        console.log('エラー発生：')
        console.log(error.response)
        this.errorFlg = true
        this.errorMessage = 'データ登録時にエラーが発生しました。'
      }

      // 表示中の日付が登録日と同じ場合、表示を更新
      if (this.newTask.start_date === this.searchDate) {
        this.getTasks()
      }
    },
    async deleteTask (id) {
      try {
        await this.$axios.$delete(`/api/task/${id}/`)
        this.getTasks()
      } catch (error) {
        console.log('エラー発生：')
        console.log(error.response)
        this.errorFlg = true
        this.errorMessage = 'データ削除時にエラーが発生しました。'
      }
    }
  },
  directives: {
    focus: {
      inserted (el) {
        el.focus()
      }
    }
  },
  created () {
    this.getTasks()
  }
}
</script>

<style>
.task-card {
    box-shadow: 0 1rem 1.5rem rgba(0,0,0,.6);
}
</style>
