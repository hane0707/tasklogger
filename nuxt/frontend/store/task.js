// export const state = () => ({
//   list: [],
//   errorFlg: false,
//   errorMessage: ''
// })

// export const mutations = {
//   setList: (state, list) => (state.list = list),
//   setErrorFlg: (state, flg) => (state.errorFlg = flg),
//   setErrorMessage: (state, message) => (state.errorMessage = message)
// }

// export const actions = {
//   async getList ({ commit }) {
//     const list = await this.$axios.$get('/api/task/')

//     commit('setList', list)
//   },
//   async deleteTask ({ dispatch, commit }, { id, date }) {
//     try {
//       await this.$axios.$delete(`/api/task/${id}/`)
//       dispatch('getList', date)
//     } catch (error) {
//       console.log('エラー発生：')
//       console.log(error.response)
//       commit('setErrorFlg', true)
//       commit('setErrorMessage', 'データ削除時にエラーが発生しました。')
//     }
//   },
//   async registTask ({ dispatch, commit, state }, newTask) {
//     try {
//       // 新規タスクを登録
//       const registResponse = await this.$axios.$post('/api/task/', newTask) // eslint-disable-line

//       // 新規タスクの開始日時が登録前の最新タスクの開始日時より後、
//       // かつ、より登録前の最新タスクの終了日時が設定されていない場合、
//       // その終了日時に新規タスクの開始日時を設定する。
//       const newTaskStart = newTask.start_date + newTask.start_time
//       const beforeLatestTask = state.list[0]
//       const beforeLatestTaskStart = beforeLatestTask.start_date + beforeLatestTask.start_time
//       const beforeLatestTaskEnd = (beforeLatestTask.end_date ?? '') + (beforeLatestTask.end_time ?? '')
//       if (newTaskStart >= beforeLatestTaskStart && !beforeLatestTaskEnd) {
//         const updateResposnse = await this.$axios.$patch(`/api/task/${beforeLatestTask.id}/`, { // eslint-disable-line
//           end_date: newTask.start_date,
//           end_time: newTask.start_time
//         })
//       }

//       dispatch('getList')
//     } catch (error) {
//       console.log('エラー発生：')
//       console.log(error.response)
//       commit('setErrorFlg', true)
//       commit('setErrorMessage', 'データ登録時にエラーが発生しました。')
//     }
//   }
// }
