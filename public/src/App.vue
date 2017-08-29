<template>
  <div id="app">
    <img src="./assets/logo.png">
    <form action="" @submit.prevent="submit">
      <input type="text" v-model="form.values.url" placeholder="введите url для сокращения" name="url">
      <input type="text" v-model="form.values.short" placeholder="введите желаемое окончание ссылки" name="url">
      <button type="submit">сократить ссылку {{form.errors.url}}</button>
    </form>
    
  </div>
</template>

<script> 
import axios from 'axios'

import  config from './config_app'

axios.defaults['withCredentials'] = true;
let lo= console.log
function checkUrl(url){
  let re=/^((http|ftp|https):\/\/)([-a-zA-Z0-9@:%._\+~#=]{2,256}[a-z]{2,6}\b)([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
  let state=re.test(url);
  return state;
}

export default {
  name: 'app',
  data(){
    return {
      form:{
        values:{
          url:'https://github.com/vuejs/vue-cli',
          short:''
        },
        errors:{
          url:false,
        }
      }
    }
  },
  methods:{
    submit(e){
      let {url:urlStr,short}=this.form.values;
      let check=checkUrl(urlStr)
      this.form.errors.url=!check;
      if(!check){
        return;
      }
      let {url,method}=config.urls.submit
      if(!(method in axios)){
        throw Error('метод запроса не найден')
      }
      axios[method](url,{form:{url:urlStr,short}}).then(result=>{
        lo(result.data)
      }).cath(err=>{
        lo(err)
      })
    }

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
