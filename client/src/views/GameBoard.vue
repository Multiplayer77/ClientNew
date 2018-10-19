<template>
  <section class="game-board">

    
    <div id="boardcontainer">
      <div v-if="show" v-for="tile in tiles" :key="tile">
        <tile :tile="tile" :players="players" :diceresult="diceResult"></tile>
      </div>
    </div>
    
    <div class="sidenav">


      <button @click="rollDice">rolllll</button>

    </div>

  </section>
</template>

<script>
import tile from '../components/Tile'
import axios from 'axios'

export default {
  name: "game-board",
  props: [],
  created() {
    this.gotAdvance()
  },
  data() {
    return {
      diceResult : '',
      turnIndex : 0,
      show : true,
      players : [
        {name:'adit',position:1},
        {name:'dwi',position:2},
        {name:'gusti',position:3},
        {name:'frans',position:4}
      ],
      tiles : [
        100,99,98,97,96,95,94,93,92,91,
        81,82,83,84,85,86,87,88,89,90,
        80,79,78,77,76,75,74,73,72,71,
        61,62,63,64,65,66,67,68,69,70,
        60,59,58,57,56,55,54,53,52,51,
        41,42,43,44,45,46,47,48,49,50,
        40,39,38,37,36,35,34,33,32,31,
        21,22,23,24,25,26,27,28,29,30,
        20,19,18,17,16,15,14,13,12,11,
        1,2,3,4,5,6,7,8,9,10,
      ]
    };
  },
  watch: {
    turnIndex : function(){
      if(this.turnIndex === 4){
        this.turnIndex = 0
      }
    }
  },
  components : {
    tile
  },
  methods: {
    winner(){
      console.log('yeeee menang')
    },
    updateComponent(){    
     this.show = false;

    this.$nextTick(function(){
      this.show = true
    })
    console.log('test')

   },
    rollDice(){
        axios({
          method : 'GET',
          url : 'http://roll.diceapi.com/json/d6'
        })
        .then((result) => {
          let dice = result.data.dice[0].value
          this.players[this.turnIndex].position += dice
          this.turnIndex += 1
          this.gotAdvance()
          this.updateComponent()
          console.log(dice)

        }).catch((err) => {
          console.log(err);
        });

    },

    gotAdvance(){


      this.players.forEach((player,index)=>{
        if(player.position > 100){
          this.players[index].position = 100 - (this.players[index].position-100)
        }
        switch (player.position) {
          case 2: this.players[index].position = 38
          break;
          case 7: this.players[index].position = 14
          break;
          case 8: this.players[index].position = 31
          break;
          case 16: this.players[index].position = 6
          break;
          case 21: this.players[index].position = 42
          break;
          case 28: this.players[index].position = 84
          break;
          case 36: this.players[index].position = 44
          break;
          case 46: this.players[index].position = 25
          break;
          case 49: this.players[index].position = 11
          break;
          case 51: this.players[index].position = 67
          break;
          case 62: this.players[index].position = 19
          break;
          case 64: this.players[index].position = 60
          break;
          case 71: this.players[index].position = 91
          break;
          case 74: this.players[index].position = 53
          break;
          case 78: this.players[index].position = 98
          break;
          case 89: this.players[index].position = 68
          break;
          case 92: this.players[index].position = 88
          break;
          case 87: this.players[index].position = 94
          break;
          case 95: this.players[index].position = 75
          break;
          case 99: this.players[index].position = 80
          break;
          case 100: this.winner()
          break;
        }
        

      })

    }
  }
};
</script>

<style scoped lang="css">
.game-board {
  box-sizing: border-box;
  display: grid;
  justify-items: center;
  grid-template-columns: 4fr 2fr;

}
#boardcontainer {
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
</style>
