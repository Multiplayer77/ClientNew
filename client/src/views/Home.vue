<template>
  <div class="ui centered grid">
    <div class="ui four wide column" style="margin-top: 100px;">
      <p style="text-align: center; font-size:40px; font-weight:bold; margin-bottom: 0px;">Oray Jeung Taraje</p>
        <div class="ui form segment">
          <div class="field">
            <label>Nick name</label>
            <input type="text" v-model="nickName">
          </div>
          <div class="ui field">
            <button class="ui mini orange fluid button" @click="createUser">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from '../assets/config'

const db = firebaseApp.database()

export default {
  name: 'home',
  data() {
    return {
      nickName: ''
    }
  },
  components: {},
  created() {
    let token = localStorage.getItem('token')

    if (token) {
      db.ref(`/db/globalRoom/` + token).remove()
      localStorage.removeItem('token')
      localStorage.removeItem('name', this.nickName)
    }
  },
  methods: {
    createUser() {
      let newKey = db
        .ref()
        .child(`/db/globalRoom/`)
        .push().key

      db.ref(`/db/globalRoom/` + newKey).set({
        nickname: this.nickName
      })
      localStorage.setItem('token', newKey)
      localStorage.setItem('name', this.nickName)
      this.$router.push('lobby')
    }
  }
}
</script>
