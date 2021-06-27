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
        <b-button @click="registTask(newTask)" variant="success" class="mx-2 my-sm-0">
          すぐに作業を開始
        </b-button>
      </div>
      <div class="task-search">
        <div class="row mb-4">
          <input type="date" v-model="searchDate" class="col-sm-2 form-control">
          <b-button @click="getTasks()" variant="primary" class="mx-2">
            検索
          </b-button>
          <div><span class="align-middle">{{ viewCount }} 件の履歴があります。</span></div>
        </div>
        <div v-for="(task, index) in taskViewList" :key="task.id">
          <div class="mb-4">
            <!-- TaskCard Start-->
            <b-card class="task-card">
              <transition name="fade" v-if="editedMessageList[index].message">
                <div
                  class="alert"
                  :class="{
                    'alert-success': !editedMessageList[index].hasError,
                    'alert-danger': editedMessageList[index].hasError }">
                  {{ editedMessageList[index].message }}
                </div>
              </transition>
              <b-card-body v-if="!editCheckList[index]">
                <b-card-title>{{ task.title }}</b-card-title>
                <b-card-text>
                  <p><b>詳細：</b></p>
                  <p>{{ task.details }}</p>
                  <p><b>開始日時：</b>{{ task.start_date }} {{ task.start_time }}</p>
                  <p><b>終了日時：</b>{{ task.end_date }} {{ task.end_time }}</p>
                </b-card-text>
                <b-button v-if="!editCheckList[index]" @click="doEdit(index)" variant="outline-info">編集</b-button>
                <b-button @click="deleteTask(task.id, index)" variant="outline-danger">削除</b-button>
              </b-card-body>
              <b-card-body v-else>
                <form
                  :id="`task-${index}`"
                  @submit.prevent="updateTask(index)"
                  @reset.prevent="cancelEdit(index)"
                  class="row">
                  <b-form-group
                    label="タイトル："
                    :label-for="`task-title-${index}`"
                    class="col-sm-12">
                    <b-form-input
                      :id="`task-title-${index}`"
                      v-model="taskEditViewList[index].title"
                      v-focus
                      placeholder="タスクのタイトルを記載してください。"
                      maxlength=30
                      required></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="詳細："
                    :label-for="`task-details-${index}`"
                    class="col-sm-12">
                    <b-form-textarea
                      :id="`task-details-${index}`"
                      v-model="taskEditViewList[index].details"
                      v-focus
                      placeholder="タスクの詳細を記載してください。"
                      maxlength=1000
                      rows="3"
                      max-rows="8"></b-form-textarea>
                  </b-form-group>
                  <b-form-group
                    label="開始日付："
                    :label-for="`task-startdate-${index}`"
                    class="col-sm-4">
                    <b-form-datepicker
                      :id="`task-startdate-${index}`"
                      v-model="taskEditViewList[index].start_date"
                      today-button
                      reset-button
                      close-button
                      locale="ja"
                      required></b-form-datepicker>
                  </b-form-group>
                  <b-form-group
                    label="開始時間："
                    :label-for="`task-starttime-${index}`"
                    class="col-sm-4">
                    <b-form-timepicker
                      :id="`task-starttime-${index}`"
                      v-model="taskEditViewList[index].start_time"
                      now-button
                      reset-button
                      locale="ja"
                      required></b-form-timepicker>
                  </b-form-group>
                  <div class="col-sm-4"></div>
                   <b-form-group
                    label="終了日付："
                    :label-for="`task-enddate-${index}`"
                    class="col-sm-4">
                   <b-form-datepicker
                      :id="`task-enddate-${index}`"
                      v-model="taskEditViewList[index].end_date"
                      today-button
                      reset-button
                      close-button
                      locale="ja"></b-form-datepicker>
                  </b-form-group>
                  <b-form-group
                    label="終了時間："
                    :label-for="`task-endtime-${index}`"
                    class="col-sm-4">
                    <b-form-timepicker
                      :id="`task-endtime-${index}`"
                      v-model="taskEditViewList[index].end_time"
                      now-button
                      reset-button
                      locale="ja"></b-form-timepicker>
                  </b-form-group>
                  <div class="col-sm-12">
                    <b-button type="reset" variant="outline-warning">キャンセル</b-button>
                    <b-button type="submit" variant="outline-primary">更新</b-button>
                  </div>
                </form>
              </b-card-body>
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
  directives: {
    focus: {
      inserted (el) {
        el.focus()
      }
    }
  },
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
      taskEditViewList: [],
      viewCount: 0,
      editCheckList: [],
      editedMessageList: [],
      errorFlg: false,
      errorMessage: ''
    }
  },
  created () {
    this.getTasks()
  },
  methods: {
    async getTasks () {
      this.initMessages()
      this.taskList = await this.$axios.$get('/api/task/')
      this.taskViewList = this.taskList.filter(
        task => task.start_date === this.searchDate
      )

      this.viewCount = this.taskViewList.length
      for (let i = 0; i < this.taskViewList.length; i++) {
        this.editCheckList[i] = false
      }

      this.editedMessageList = []
      for (let i = 0; i < this.taskViewList.length; i++) {
        this.editedMessageList.push({ hasError: false, message: '' })
      }

      this.taskEditViewList = _.cloneDeepWith(this.taskViewList)
    },
    async registTask () {
      // 初期化
      this.initMessages()
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

      this.newTask.title = ''
    },
    async updateTask (index) {
      // 更新内容を設定
      const editedTask = this.taskEditViewList[index]
      const values = {
        title: editedTask.title,
        details: editedTask.details,
        start_date: editedTask.start_date,
        start_time: editedTask.start_time,
        end_date: editedTask.end_date,
        end_time: editedTask.end_time
      }

      try {
        await this.$axios.$patch(`/api/task/${this.taskViewList[index].id}/`, values)
        this.taskViewList[index] = await this.$axios.$get(`/api/task/${this.taskViewList[index].id}/`)
        this.$set(this.editCheckList, index, false)
        this.editedMessageList[index].hasError = false
        this.editedMessageList[index].message = 'updated!'
        setTimeout(() => {
          this.editedMessageList[index].message = ''
        }, 3000)
      } catch (error) {
        console.log('エラー発生：')
        console.log(error.response)
        this.$set(this.editedMessageList, index, { hasError: true, message: 'failed!' })
        // for (let i = 0; i < Object.keys(error.response.data).length; i++) {
        //   this.editedMessageList[index].message.push(error.response.data[i])
        // }
      }
    },
    async deleteTask (id, index) {
      try {
        await this.$axios.$delete(`/api/task/${id}/`)
        this.getTasks()
      } catch (error) {
        console.log('エラー発生：')
        console.log(error.response)
        this.$set(this.editedMessageList, index, { hasError: true, message: 'failed!' })
      }
    },
    doEdit (index) {
      this.$set(this.editCheckList, index, true)
      this.$set(this.editedMessageList, index, { hasError: false, message: '' })
    },
    cancelEdit (index) {
      this.$set(this.editCheckList, index, false)
      this.taskEditViewList[index] = _.cloneDeepWith(this.taskViewList[index]) // 編集前の状態に初期化
      this.$set(this.editedMessageList, index, { hasError: false, message: '' })
    },
    initMessages () {
      // 画面上部のエラーメッセージを初期化
      this.errorFlg = false
      this.errorMessage = ''

      // 各タスクに表示されているメッセージを初期化
      if (this.editedMessageList.length <= 0) { return }
      for (let i = 0; i < this.editedMessageList.length; i++) {
        this.$set(this.editedMessageList, i, { hasError: false, message: '' })
      }
    }
  }
}
</script>

<style>
.task-card {
  background: #d8f0d1;
  border-style: none;
  border-radius: 50px;
  box-shadow: 8px 8px 16px #c2d8bc, -8px -8px 16px #eeffe6;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .8s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
