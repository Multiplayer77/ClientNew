<template>
  <div class="ui centered grid">
    <div class="ui sixteen wide column" style="margin-top:20px">
      <h1 style="text-align:center;">Match Making</h1>
    </div>
    <div class="ui nine wide column">
      <div class="ui grid">
        <!-- p1 -->
        <div class="ui four wide column" v-if="p1">
          <div class="ui segment" :class="{green: mytoken === p1.id}">
            <h3 style="text-align:center;">Player 1</h3>
          </div>
          <div class="ui card">
            <div class="image">
              <img :src="p1.avatar">
            </div>
            <div class="content">
              <div class="ui mini fluid button" @click="changeAva('p1')" v-if="mytoken === p1.id">
                change Avatar
              </div>
              <div class="header" style="text-align:center; margin-top:30px;">{{p1.name}}</div>
            </div>
            <div class="ui bottom attached button" :class="{disabled: mytoken !== p1.id}" v-if="!p1.ready" @click="statusChanger('p1')">
                Not Ready
            </div>
            <div class="ui bottom green attached button" :class="{disabled: mytoken !== p1.id}" v-else @click="statusChanger('p1')">
              <i class="check icon"></i>
                Ready
            </div>
          </div>
        </div>
        <!-- p2 -->
        <div class="ui four wide column" v-if="p2">
          <div class="ui segment" :class="{green: mytoken === p2.id}">
            <h3 style="text-align:center;">Player 2</h3>
          </div>
          <div class="ui card">
            <div class="image">
              <img :src="p2.avatar">
            </div>
            <div class="content">
              <div class="ui mini fluid button" @click="changeAva('p2')"  v-if="mytoken === p2.id">
                change Avatar
              </div>
              <div class="header" style="text-align:center; margin-top:30px;">{{p2.name}}</div>
            </div>
            <div class="ui bottom attached button" :class="{disabled: mytoken !== p2.id}" v-if="!p2.ready" @click="statusChanger('p2')">
                Not Ready
            </div>
            <div class="ui bottom green attached button" :class="{disabled: mytoken !== p2.id}" v-else @click="statusChanger('p2')">
              <i class="check icon"></i>
                Ready
            </div>
          </div>
        </div>
        <!-- p3 -->
        <div class="ui four wide column" v-if="p3">
          <div class="ui segment" :class="{green: mytoken === p3.id}">
            <h3 style="text-align:center;">Player 3</h3>
          </div>
          <div class="ui card">
            <div class="image">
              <img :src="p3.avatar">
            </div>
            <div class="content">
              <div class="ui mini fluid button" @click="changeAva('p3')"  v-if="mytoken === p3.id">
                change Avatar
              </div>
              <div class="header" style="text-align:center; margin-top:30px;">{{p3.name}}</div>
            </div>
            <div class="ui bottom attached button" :class="{disabled: mytoken !== p3.id}" v-if="!p3.ready" @click="statusChanger('p3')">
                Not Ready
            </div>
            <div class="ui bottom green attached button" :class="{disabled: mytoken !== p3.id}" v-else @click="statusChanger('p3')">
              <i class="check icon"></i>
                Ready
            </div>
          </div>
        </div>
        <!-- p4 -->
        <div class="ui four wide column" v-if="p4">
          <div class="ui segment" :class="{green: mytoken === p4.id}">
            <h3 style="text-align:center;">Player 4</h3>
          </div>
          <div class="ui card">
            <div class="image">
              <img :src="p4.avatar">
            </div>
            <div class="content">
              <div class="ui mini fluid button" @click="changeAva('p4')" v-if="mytoken === p4.id">
                change Avatar
              </div>
              <div class="header" style="text-align:center; margin-top:30px;">{{p4.name}}</div>
            </div>
            <div class="ui bottom attached button" :class="{disabled: mytoken !== p4.id}" v-if="!p4.ready" @click="statusChanger('p4')">
                Not Ready
            </div>
            <div class="ui bottom green attached button" :class="{disabled: mytoken !== p4.id}" v-else @click="statusChanger('p4')">
              <i class="check icon"></i>
                Ready
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ui three wide column">
      <div class="ui   green fluid button" style="margin-bottom:15px;" @click=startGame :class="{disabled: !isPlayersReady}" v-if="mytoken === p1.id">Start game</div>
      <div class="ui mini red fluid button" @click=exitRoom :class="{disabled: isPlayersReady}">Exit room</div>
        <div class="ui segment"> 
          <div class="ui dividing header">
            <h3><i class="ui users icon"></i>Chat Room</h3>
          </div>
          <div class="ui form">
            <div id="chats" style="height: 400px; justify-self:end;">
              <div class="ui floating mini message" v-for="chat in Object.values(roomChat).reverse().slice(1,9).reverse() ">
                <p>{{ chat.name }}: {{ chat.message }}</p>
              </div>
            </div>
            <input type="text" placeholder="Type your message" @keyup.enter="submitChat" v-model="messageChat">
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import firebaseApp from '../assets/config'

const db = firebaseApp.database()

export default {
  name: 'room',
  data() {
    return {
      mytoken: localStorage.getItem('token'),
      myName: localStorage.getItem('name'),

      p1: '',
      p2: '',
      p3: '',
      p4: '',

      roomId: null,
      roomName: null,
      roomHost: null,
      roomChat: null,

      messageChat: '',

      roomStatus: 'waiting'
    }
  },
  computed: {
    isPlayersReady() {
      let players = [this.p1, this.p2, this.p3, this.p4]
      let status = false
      let isPlayerFilled = 0
      for (let i = 0; i < players.length; i++) {
        if (players[i]) {
          isPlayerFilled++
        }
      }
      if (isPlayerFilled >= 2) {
        for (let i = 0; i < players.length; i++) {
          if (players[i]) {
            if (players[i].ready) {
              status = true
            } else {
              status = false
              break
            }
          }
        }
      }
      return status
    }
  },
  created() {
    this.roomInit()
  },
  watch: {
    roomStatus() {
      if (this.roomStatus === 'onGame') {
        this.$router.push('gameboard')
      }
    },
    roomChat(newVal, oldVal) {
      if (newVal !== oldVal) {
        let audioChat = new Audio(require('../assets/wav/Blop-Mark_DiAngelo-79054334.wav'))
        audioChat.play()
      }
    },
    p1() {
      if (!this.p1) {
        this.closeRoom()
      }
    }
  },
  methods: {
    startGame() {
      db.ref(`/db/rooms/` + this.roomId + `/status`).set(`onGame`)
    },
    closeRoom() {
      localStorage.removeItem('roomId')
      this.$router.push('lobby')
    },
    exitRoom() {
      let token = localStorage.getItem('token')
      let roomId = localStorage.getItem('roomId')
      db.ref(`/db/rooms/` + roomId + `/player`).on('value', snapshot => {
        for (let i = 0; i < Object.keys(snapshot.val()).length; i++) {
          if (Object.values(snapshot.val())[i].id == token) {
            if (Object.keys(snapshot.val())[i] == 'p1') {
              localStorage.removeItem('roomId')
              db.ref(`/db/rooms/` + roomId).remove()
              this.roomInit()
            } else {
              db.ref(`/db/rooms/` + roomId + `/player/${Object.keys(snapshot.val())[i]}`).remove()
              localStorage.removeItem('roomId')
              this.$router.push('lobby')
            }
          }
        }
      })
    },
    statusChanger(target) {
      let val = ''
      if (target == 'p1') {
        val = !this.p1.ready
      } else if (target == 'p2') {
        val = !this.p2.ready
      } else if (target == 'p3') {
        val = !this.p3.ready
      } else if (target == 'p4') {
        val = !this.p4.ready
      }
      db.ref(`/db/rooms/` + this.roomId + `/player/${target}/ready`).set(val)
    },
    changeAva(target) {
      db.ref(`/db/rooms/` + this.roomId + `/player/${target}/avatar`).set(
        `https://rickandmortyapi.com/api/character/avatar/${Math.floor(Math.random() * 500)}.jpeg`
      )
    },
    submitChat() {
      let roomId = localStorage.getItem('roomId')
      db.ref(`/db/rooms/` + roomId + `/chat`).push({
        name: localStorage.getItem('name'),
        message: this.messageChat.slice(0, 40)
      })
      this.messageChat = ''
    },
    roomInit() {
      let token = localStorage.getItem('token')
      let name = localStorage.getItem('name')
      let roomId = localStorage.getItem('roomId')

      db.ref(`/db/rooms/` + roomId + `/player`).on('value', snapshot => {
        if (!snapshot.val()) {
          this.p1 = null
          this.p2 = null
          this.p3 = null
          this.p4 = null
        } else {
          this.p1 = snapshot.val().p1
          this.p2 = snapshot.val().p2
          this.p3 = snapshot.val().p3
          this.p4 = snapshot.val().p4
        }
      })

      db.ref(`/db/rooms/` + roomId).once('value', snapshot => {
        if (!snapshot.val()) {
          this.roomName = null
          this.roomId = null
          this.roomHost = null
        } else {
          this.roomName = snapshot.val().name
          this.roomId = snapshot.val().id
          this.roomHost = snapshot.val().host
        }
      })

      db.ref(`/db/rooms/` + roomId + `/chat`).on('value', snapshot => {
        if (!snapshot.val()) {
          this.roomChat = null
        } else {
          this.roomChat = snapshot.val()
        }
      })

      db.ref(`/db/rooms/` + roomId + `/status`).on('value', snapshot => {
        this.roomStatus = snapshot.val()
      })
    }
  }
}
</script>

<style>

</style>
