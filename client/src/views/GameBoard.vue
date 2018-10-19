<template>
  <section class="game-board">
    <div class="leftBar">

          <div class="profilecard"> 
            <table class="ui celled table" style="background-color:rgba(255, 255, 255, 0.2);">
              <tr>
                <th>ava</th>
                <th>Player </th>
                <th>Position </th>
              </tr>
              <tr v-for="player in players" :key="player.name">
                <td> <img :src="player.avatar" alt=""> </td>
                <td> {{player.name}} </td>
                <td> {{player.position}} </td>
              </tr>
            </table>
          </div>
    </div>
    <div id="boardcontainer">
      <div v-if="show" v-for="tile in tiles" :key="tile">
        <tile :tile="tile" :players="players" :diceresult="diceResult"></tile>
      </div>
    </div>
    <div class="sidenav">
      <button id="rolldicebtn" @click="rollDice" v-if="isMyturn">Roll Dice!</button>
      <button type="button" v-if="isWinner" @click="backToLobby">Back to Lobby</button>
    <div>
    <br>
    <center> <h1 style="font-size:70px;"> {{ diceResult}}</h1></center>
        
    </div>
    </div>

  </section>
</template>

<script>
import tile from '../components/Tile'
import axios from 'axios'
import firebaseApp from '../assets/config'

const db = firebaseApp.database()

export default {
  name: 'game-board',
  props: [],
  created() {
    this.initGame()
  },
  data() {
    return {
      isWinner : false,
      diceResult: '',
      myPlayerNumber: '',
      totalPlayer: [],
      turnIndex: null,
      show: true,
      players: [],
      tiles: [
        100,
        99,
        98,
        97,
        96,
        95,
        94,
        93,
        92,
        91,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        80,
        79,
        78,
        77,
        76,
        75,
        74,
        73,
        72,
        71,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        60,
        59,
        58,
        57,
        56,
        55,
        54,
        53,
        52,
        51,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        40,
        39,
        38,
        37,
        36,
        35,
        34,
        33,
        32,
        31,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        20,
        19,
        18,
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ]
    }
  },
  computed: {
    isMyturn() {
      if(this.isWinner){
        if (this.myPlayerNumber === 'p1') {
          if (this.turnIndex === 0) {
          return false
          }
        }if (this.myPlayerNumber === 'p2') {
          if (this.turnIndex === 1) {
            return false
          }
        }if (this.myPlayerNumber === 'p3') {
          if (this.turnIndex === 2) {
            return false
          }
        }if (this.myPlayerNumber === 'p4') {
          if (this.turnIndex === 3) {
            return false
          }
        }
      }
      else {
        if (this.myPlayerNumber === 'p1') {
          if (this.turnIndex === 0) {
            return true
          } else {
            return false
          }
        } else if (this.myPlayerNumber === 'p2') {
          if (this.turnIndex === 1) {
            return true
          } else {
            return false
          }
        } else if (this.myPlayerNumber === 'p3') {
          if (this.turnIndex === 2) {
            return true
          } else {
            return false
          }
        } else if (this.myPlayerNumber === 'p4') {
          if (this.turnIndex === 3) {
            return true
          } else {
            return false
          }
        }
      }
    }
  },
  watch: {
    players() {
      this.gotAdvance()
      this.updateComponent()
    },
    turnIndex: function() {
      let roomId = localStorage.getItem('roomId')
      if (this.turnIndex === this.totalPlayer.length) {
        db.ref(`/db/rooms/` + roomId + `/currentTurn`).set(0)
      }
    },
  },
  components: {
    tile
  },
  methods: {
    winner() {
     this.isWinner = true
   },
   backToLobby(){
     console.log('balik ke lobby')
     this.$router.push('lobby')
   },
    initGame() {
      let token = localStorage.getItem('token')
      let roomId = localStorage.getItem('roomId')
      db.ref(`/db/rooms/` + roomId + `/player`).once('value', snapshot => {
        if (token === snapshot.val().p1.id) {
          this.myPlayerNumber = 'p1'
        } else if (token === snapshot.val().p2.id) {
          this.myPlayerNumber = 'p2'
        } else if (token === snapshot.val().p3.id) {
          this.myPlayerNumber = 'p3'
        } else if (token === snapshot.val().p4.id) {
          this.myPlayerNumber = 'p4'
        }
        db.ref(`/db/rooms/` + roomId + `/player`).on('value', snapshot => {
          this.players = Object.values(snapshot.val())
          for (let i = 0; i < this.players.length; i++) {}
        })
        this.initGameEngine()
      })
    },
    initGameEngine() {
      console.log('masuk init game')
      let roomId = localStorage.getItem('roomId')
      db.ref(`/db/rooms/` + roomId + `/player`).once('value', snapshot => {
        this.totalPlayer = Object.keys(snapshot.val())
        db.ref(`/db/rooms/` + roomId + `/currentTurn`).set(0)
        for (let i = 0; i < this.totalPlayer.length; i++) {
          db.ref(`/db/rooms/` + roomId + `/player/` + this.totalPlayer[i] + '/position').set(0)
        }
      })

      db.ref(`/db/rooms/` + roomId + `/currentTurn`).on('value', snapshot => {
        this.turnIndex = snapshot.val()
      })
    },
    updateComponent() {
      this.show = false

      this.$nextTick(function() {
        this.show = true
      })
      console.log('test')
    },
    rollDice() {
      let roomId = localStorage.getItem('roomId')
      axios({
        method: 'GET',
        url: 'http://roll.diceapi.com/json/d6'
      })
        .then(result => {
          let dice = result.data.dice[0].value
          db.ref(
            `/db/rooms/` + roomId + `/player/` + this.totalPlayer[this.turnIndex] + '/position'
          ).set(this.players[this.turnIndex].position + dice)
          let newTurnIndex = this.turnIndex + 1
          db.ref(`/db/rooms/` + roomId + `/currentTurn`).set(newTurnIndex)
          this.gotAdvance()
          this.updateComponent()
          this.diceResult = dice
        })
        .catch(err => {
          console.log(err)
        })
    },

    gotAdvance() {
      this.players.forEach((player, index) => {
        if (player.position > 100) {
          this.players[index].position = 100 - (this.players[index].position - 100)
        }
        switch (player.position) {
          case 2:
            this.players[index].position = 38
            break
          case 7:
            this.players[index].position = 14
            break
          case 8:
            this.players[index].position = 31
            break
          case 15:
           this.players[index].position = 26
           break
          case 16:
            this.players[index].position = 6
            break
          case 21:
            this.players[index].position = 42
            break
          case 28:
            this.players[index].position = 84
            break
          case 36:
            this.players[index].position = 44
            break
          case 46:
            this.players[index].position = 25
            break
          case 49:
            this.players[index].position = 11
            break
          case 51:
            this.players[index].position = 67
            break
          case 62:
            this.players[index].position = 19
            break
          case 64:
            this.players[index].position = 60
            break
          case 71:
            this.players[index].position = 91
            break
          case 74:
            this.players[index].position = 53
            break
          case 78:
            this.players[index].position = 98
            break
          case 89:
            this.players[index].position = 68
            break
          case 92:
            this.players[index].position = 88
            break
          case 87:
            this.players[index].position = 94
            break
          case 95:
            this.players[index].position = 75
            break
          case 99:
            this.players[index].position = 80
            break
          case 100:
            this.winner()
            break
        }
      })
    }
  }
}
</script>

<style scoped lang="css">
.game-board {
  box-sizing: border-box;
  display: grid;
  justify-items: center;
  grid-template-columns:2fr 4fr 2fr;
background-image: url('/walpapersnake1.png');
padding: 30px;
  
}
#boardcontainer {
  box-shadow: 0 0 30px rgb(241, 217, 0);
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  /* width: 650px;
  height: 650px; */
  grid-gap: 2px;
  align-items: center;
  box-sizing: border-box;
  background-image: url("/gameboard2.jpg");
}
.kotakkotak {
  box-sizing: border-box;
  height: 70px;
  width: 70px;
  background-color: rgb(219, 219, 219);
}
#rolldicebtn{
  background-color: darkorange;
  margin-top: 50px;
  width: 150px;
  height: 150px;
  border-radius: 100px;
  filter: drop-shadow(0 0 10px grey);
  font-size: 25px;
  transition: .2s;
}
#rolldicebtn:hover {
  margin-top: 30px;
   width: 180px;
  height: 180px;
  cursor: pointer;
}
.profilecard{
  display: grid;
}

td img {
  width: 100px;
  height: 100px;
  margin: -10px -10px -10px -10px; 
}
tr {
  font-family: Helvetica;
  font-size: 18px;
}
</style>
