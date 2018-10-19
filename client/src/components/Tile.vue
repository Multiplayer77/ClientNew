 <template>
  <section class="tile">

    <div class="kotakkotak"> 
      <!-- <div class="tileNum">{{tile}}</div> -->
       
      <div v-if="tileValue" class="inclass" >
        <img src="/pion.png" alt="">
        <div class="nickname">{{tileValue.name}} </div>
          
      </div>
      
    </div>

  </section>
</template>

<script lang="js">
  export default  {
    name: 'tile',
    props: ['tile','players', 'diceresult'],
    mounted() {
      this.getTileValue()
    },
    data() {
      return {
        tileValue : ''
      }
    },
    methods: {
      getTileValue(){
        this.players.forEach(player=>{
          if(player.position == this.tile){
            this.tileValue = player
          }
        })
      }
    },
    computed: {

    }
}
</script>

<style scoped lang="css">
.tileNum{
  text-align: end;
  box-sizing: border-box;
}
.kotakkotak {
  height: 70px;
  width: 70px;
  /* background-color: rgb(219, 219, 219); */
  box-sizing: border-box;
}
.inclass {
  /* background-image: url("/pion.png"); */
}
img {
  z-index: 10;
  margin-left: -5px;
  margin-top: -8px;
  filter: drop-shadow(0px 0px 14px #2c2c2c)
}
.nickname {
  z-index: 11;
  margin-top:-50px ;
  filter: drop-shadow(0px 0px 14px #2c2c2c);
  font-size: 20px;
   font-weight: 900;
}
</style>
