export const state = () => ({
  list: [],
  viewList: [],
  count: 0,
  errorFlg: false,
  errorMessage: ''
})

export const mutations = {
  setList: (state, list) => (state.list = list),
  setViewList: (state, viewList) => (state.viewList = viewList),
  setCount: (state, count) => (state.count = count),
  setErrorFlg: (state, flg) => (state.errorFlg = flg),
  setErrorMessage: (state, message) => (state.errorMessage = message)
}

export const actions = {
  async getList ({ commit }, date) {
    const list = await this.$axios.$get('/api/task/')

    const viewList = list.filter(
      task => task.start_date === date
    )

    commit('setList', list)
    commit('setViewList', viewList)
    commit('setCount', viewList.length)
  },
  async deleteTask ({ dispatch, commit }, { id, date }) {
    try {
      await this.$axios.$delete(`/api/task/${id}/`)
      dispatch('getList', date)
    } catch (error) {
      console.log('エラー発生：')
      console.log(error.response)
      commit('setErrorFlg', true)
      commit('setErrorMessage', 'データ削除時にエラーが発生しました。')
    }
  },
  async registTask ({ dispatch, commit }, { newTask, date }) {
    // タイトルがない場合は"no title"を設定
    newTask.title = newTask.title === '' ? 'no title' : newTask.title

    let response = ''
    try {
      response = await this.$axios.$post('/api/task/', newTask) // eslint-disable-line

      if (response.start_date === date) {
        dispatch('getList', date)
      }
    } catch (error) {
      console.log('エラー発生：')
      console.log(error.response)
      commit('setErrorFlg', true)
      commit('setErrorMessage', 'データ登録時にエラーが発生しました。')
    }
  }
}
