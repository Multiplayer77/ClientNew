<template>
  <div class="ui centered grid">
    <div class="ui sixteen wide column ">
      <p style="text-align: center; font-size:40px; font-weight:bold; margin-bottom: 0px; margin-top:10px;">Lobby</p>
    </div>
      <div class="ui ten wide column">
        <div class="ui" style="margin-top:0px;">
          <div class="ui dividing header">
            <h3><i class="ui users icon"></i>List Room</h3>
          </div>
          <div class="ui four cards">
            <div class="card" v-for="(room, index) in listRooms">
              
              <div class="content">
                <div class="header">{{ room.name }}</div>
                <div class="meta">RM: {{ room.host }}</div>
              </div>
              <div class="extra content">
                <span class="right floated">
                  {{ room.status }}
                </span>
                <span>
                  <i class="users green icon"></i>
                  {{ Object.values(room.player).length }} person
                </span>
              </div>
              <div class="ui mini green bottom attached button" @click="joinRoom(room.id)">
                <i class="add icon"></i>
                Join Room
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ui four wide column">
        <div class="ui grid">
          <div class="ui sixteen wide column">
            <div class="ui fluid action input">
              <input type="text" placeholder="Room Title" v-model="titleRoom">
              <div class="ui icon green button" @click="createRoom">Create room</div>
            </div>
          </div>
        </div>
        <div class="ui segment"> 
          <div class="ui dividing header">
            <h3><i class="ui world icon"></i>Chat global</h3>
          </div>
          <div class="ui form">
            <div id="chats" style="height: 450px; justify-self:end;">
              <div class="ui floating mini message" v-for="chat in listChat">
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
  name: 'lobby',
  components: {},
  data() {
    return {
      messageChat: '',
      listChat: '',
      listRooms: [],
      removeList: '',

      titleRoom: '',

      triggerModel: false
    }
  },
  watch: {
    // listChat() {
    //   let audioChat = new Audio(require('../assets/wav/Blop-Mark_DiAngelo-79054334.wav'))
    //   audioChat.play()
    // },
    removeList() {
      for (let i = 0; i < this.removeList.length; i++) {
        db.ref(`/db/globalChat/` + this.removeList[i]).remove()
      }
    }
  },
  created() {
    let token = localStorage.getItem('token')
    let name = localStorage.getItem('name')
    if (token && name) {
      this.refreshLobby()
    } else {
      this.$router.push('home')
    }
  },
  methods: {
    refreshLobby() {
      db.ref('/db/globalChat').on('value', snapshot => {
        if (snapshot.val()) {
          this.listChat = Object.values(snapshot.val())
            .reverse()
            .slice(0, 9)
            .reverse()
          this.removeList = Object.keys(snapshot.val())
            .reverse()
            .slice(9)
        }
      })

      db.ref('/db/rooms').on('value', snapshot => {
        if (snapshot.val()) {
          this.listRooms = Object.values(snapshot.val()).slice(1)
        }
      })
    },
    joinRoom(roomId) {
      let availablePlace = ''
      db.ref('/db/rooms/' + roomId).once('value', snapshot => {
        if (!snapshot.val().player.p2) {
          db.ref(`/db/rooms/` + roomId + `/player/p2`).set({
            id: localStorage.getItem('token'),
            name: localStorage.getItem('name'),
            avatar: `https://rickandmortyapi.com/api/character/avatar/${Math.floor(
              Math.random() * 500
            )}.jpeg`,
            ready: false
          })
          localStorage.setItem('roomId', roomId)
          this.$router.push('room')
        } else if (!snapshot.val().player.p3) {
          db.ref(`/db/rooms/` + roomId + `/player/p3`).set({
            id: localStorage.getItem('token'),
            name: localStorage.getItem('name'),
            avatar: `https://rickandmortyapi.com/api/character/avatar/${Math.floor(
              Math.random() * 500
            )}.jpeg`,
            ready: false
          })
          localStorage.setItem('roomId', roomId)
          this.$router.push('room')
        } else if (!snapshot.val().player.p4) {
          db.ref(`/db/rooms/` + roomId + `/player/p4`).set({
            id: localStorage.getItem('token'),
            name: localStorage.getItem('name'),
            avatar: `https://rickandmortyapi.com/api/character/avatar/${Math.floor(
              Math.random() * 500
            )}.jpeg`,
            ready: false
          })
          localStorage.setItem('roomId', roomId)
          this.$router.push('room')
        }
      })
    },
    randomNum() {
      let numberRandom = Math.floor(Math.random() * 500)
      return numberRandom
    },
    createRoom() {
      if (this.titleRoom !== '') {
        let name = localStorage.getItem('name')
        let token = localStorage.getItem('token')
        let newKey = db
          .ref()
          .child(`/db/rooms/`)
          .push().key

        db.ref(`/db/rooms/` + newKey).set({
          id: newKey,
          host: name,
          chat: {
            bot: {
              name: 'bot',
              message: 'chat room'
            }
          },
          name: this.titleRoom,
          player: {
            p1: {
              id: token,
              name: name,
              avatar: `https://rickandmortyapi.com/api/character/avatar/${Math.floor(
                Math.random() * 500
              )}.jpeg`,
              ready: false
            }
          },
          status: 'waiting'
        })
        localStorage.setItem('roomId', newKey)
        this.titleRoom = ''
        this.$router.push('room')
      }
    },
    submitChat() {
      console.log('masuk')
      let id = localStorage.getItem('token')
      try {
        db.ref(`/db/globalChat/`).push({
          name: localStorage.getItem('name'),
          message: this.messageChat
        })
      } catch (error) {
        console.log(error)
      }
      this.messageChat = ''
      console.log('haha')
    }
  }
}
</script>

<style>

</style>
