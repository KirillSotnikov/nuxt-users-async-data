<template>
  <div class="container">

    <app-errors v-if="loadErrors.length" :loadErrors="loadErrors"  />

    <span class="loading-indicator" v-if="!userList.length">Loading...</span>
    <app-users-list
      :users="userList"
      :openModal="openAlertModal"
    />

    <transition name="fade">
      <app-text-alert
        v-if="visibleAlert"
        :text="alertText"
        :closeModal="closeAlertModal"
      />
    </transition>

    <app-pagination
      :prevFunc="prevPage"
      :nextFunc="nextPage"
      :rowsPerPage="rowsPerPage"
      :handleChange="changeInput"
      :currentPage="page"
      :downloadMore="downloadMore"
    />

    <app-radio-filter
      :handleChange="handleChange"
      :setPage="setPage"
      :checkedValue="checkedValue"
    />
  </div>
</template>

<script>
import UsersList from '~/components/Users/List.vue'
import TextAlert from '~/components/Common/TextAlert.vue'
import Pagination from '~/components/Pagination'
import RadioFilter from '~/components/Filters/RadioFilter'
import Errors from '~/components/Common/Errors'

import Validator from '~/utils/Validator'

export default {
  components: {
    'app-users-list': UsersList,
    'app-text-alert': TextAlert,
    'app-pagination': Pagination,
    'app-radio-filter': RadioFilter,
    'app-errors': Errors
  },
  data () {
    return {
      visibleAlert: false,
      alertText: '',
      // page: 1,
      // rowsPerPage: 5,
      // checkedValue: 'any',
      download: 0
    }
  },
  async asyncData ({ $axios, store, route: { query } }) {
    let { page, rowsPerPage, gender } = query
    if (gender !== 'female' && gender !== 'male') {
      gender = 'any'
    }
    page = Number(page)
    rowsPerPage = Number(rowsPerPage)
    await store.dispatch('fetchUsers', { page, rowsPerPage: rowsPerPage * page, gender })
    let userList = await store.getters.getUsers
    userList = userList.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    return {
      userList,
      page,
      rowsPerPage,
      checkedValue: gender
    }
  },
  mounted () {
    const { page, rowsPerPage } = this.$route.query
    const pageValidator = new Validator(page, 'page')
    const pageResult = pageValidator.isEmpty().notZero().getResult()
    const pageErrors = pageResult.errors
    if (pageErrors.length) {
      this.$store.dispatch('addError', pageErrors)
    }
    const rowsValidator = new Validator(rowsPerPage, 'rowsPerPage')
    const rowsResult = rowsValidator.isEmpty().notZero().getResult()
    const rowsErrors = rowsResult.errors
    if (rowsErrors.length) {
      this.$store.dispatch('addError', rowsErrors)
    }
  },
  computed: {
    loadErrors () {
      return this.$store.getters.getErrors
    }
  },
  methods: {
    fetchUsers (payload) {
      this.$store.dispatch('fetchUsers', payload)
    },

    filterUsers (users, page = this.page, perPage = this.rowsPerPage) {
      const paginationUsers = users.slice((page - 1) * perPage, page * perPage)
      return paginationUsers
    },

    async getUsers () {
      const users = await this.$store.getters.getUsers
      return users
    },

    setUsers (users) {
      this.userList = users
    },

    closeAlertModal () {
      this.visibleAlert = false
    },

    openAlertModal (text) {
      this.visibleAlert = true
      this.setModalText(text)
    },

    setModalText (text) {
      this.alertText = text
    },

    prevPage () {
      if (this.page !== 1) {
        this.setPage(this.page - 1)
        this.handleChange('download', 0)
        this.setRouterQuery({ page: this.page, gender: this.checkedValue })
      }
    },

    setPage (value = 1) {
      this.handleChange('page', value)
    },

    setRouterQuery ({ page = this.page, rowsPerPage = this.rowsPerPage, download = 0, gender = 'any' }) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page,
          rowsPerPage,
          download,
          gender
        }
      })
    },

    nextPage () {
      this.setPage(this.page + 1)
      this.handleChange('download', 0)
      this.setRouterQuery({ page: this.page, gender: this.checkedValue })
    },

    downloadMore () {
      this.setPage(this.page + 1)
      this.handleChange('download', this.download + 1)
      this.setRouterQuery({ page: this.page, download: this.download, gender: this.checkedValue })
    },

    changeInput (name, value) {
      this.handleChange(name, value)
      this.setRouterQuery({ rowsPerPage: this.rowsPerPage, gender: this.checkedValue })
    },

    handleChange (name, value) {
      this[name] = value
    }
  },
  watch: {
    async '$route' ({ query }) {
      let { page, rowsPerPage } = query
      const { download, gender } = query
      page = Number(page)
      rowsPerPage = Number(rowsPerPage)

      let users = await this.getUsers()
      let perPage = rowsPerPage
      let onPage = page
      if (gender !== 'any') {
        users = users.filter(user => user.gender === gender)
      }
      if (download > 0) {
        perPage = rowsPerPage * (download + 1)
        onPage = page - download
      }
      const filteredData = await this.filterUsers(users, onPage, perPage)
      if (filteredData.length === perPage) {
        this.userList = filteredData
      } else {
        await this.$store.dispatch('fetchUsers', { page: onPage, rowsPerPage: perPage - filteredData.length, gender: gender !== 'any' ? gender : false })
        let userList = await this.getUsers()
        if (gender !== 'any') {
          userList = userList.filter(user => user.gender === gender)
        }
        const filterUsers = this.filterUsers(userList, onPage, perPage)
        this.setUsers(filterUsers)
      }
    },
    checkedValue (val) {
      this.setPage(1)
      this.setRouterQuery({ page: this.page, gender: this.checkedValue })
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

.loading-indicator{
  padding: 40px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
