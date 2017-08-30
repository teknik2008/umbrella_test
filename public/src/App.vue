<template>
  <div id="app">
    <img src="./assets/logo.png">
    <!-- <form action="" @submit.prevent="submit">
            <input type="text" v-model="form.values.url" placeholder="введите url для сокращения">
            <input type="text" v-model="form.values.short" placeholder="введите желаемое окончание ссылки">
            <input type="text" v-model="form.values.limit" placeholder="количество переходов">
            <button type="submit">сократить ссылку {{form.errors.url}}</button>
            <el-button>Default Button</el-button>
          </form> -->
    <el-form label-position="left" :rules="form.rules" label-width="240px" :model="form.values" ref="urlForm">
      <el-form-item label="Укажите ссылку для сокращения" prop="url">
        <el-input v-model="form.values.url"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="Указать желаемое окончание">
            <el-switch v-model="form.userCheck.short" on-text="" off-text=""></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item v-if="form.userCheck.short" label="/" label-width="20px" prop="short">
            <el-input v-model="form.values.short"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="Указать количество переходов">
            <el-switch v-model="form.userCheck.limit" on-text="" off-text=""></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item v-if="form.userCheck.limit" label="" label-width="20px" prop="limit">
            <el-input v-model="form.values.limit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-button type="primary" @click="submit">Submit</el-button>
          <!-- <button @click="submit">сократить ссылку {{form.errors.url}}</button> -->
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script> 
import axios from 'axios'

import config from './config_app'

axios.defaults['withCredentials'] = true;
let lo = console.log

export default {
  name: 'app',
  data() {
    return {
      form: {
        userCheck: {
          short: false,
          limit: false
        },
        values: {
          url: 'https://github.com/vuejs/vue-cli',
          short: '',
          limit: 1,
        },
        errors: {
          url: false,
        },
        rules: {
          url: [{
            required: true,
            // pattern:/^((http|ftp|https):\/\/)([-a-zA-Z0-9@:%._\+~#=]{2,256}[a-z]{2,6}\b)([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
            message: 'Может укажите, что надо сократить',
            trigger: 'blur'
          }, {
            required: true,
            pattern: /^((http|ftp|https):\/\/)([-a-zA-Z0-9@:%._\+~#=]{2,256}[a-z]{2,6}\b)([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
            message: 'Что-то не похоже на ссылку',
            trigger: 'blur'
          },
          ],
          short: [
            { required: true, message: 'А какое окончание нужно?',rigger: 'blur'}
          ],
          limit: [
            { required: true, message: 'Так сколько раз нужно использовать?'},
            { required: true, message: 'Ну это не число.',pattern:/^\d+$/}
          ],
        }
      }
    }
  },
  methods: {
    submit(e) {
      this.$refs.urlForm.validate((valid) => {
        let { url, short, limit } = this.form.values;
        let userCheck = this.form.userCheck;
        let { url: urlReq, method } = config.urls.submit
        if (!(method in axios)) {
          throw Error('метод запроса не найден')
        }
        axios[method](urlReq, { form: { url, short, limit } }).then(result => {
            
        }).catch(err => {

        })
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
