<template>
  <div id="app">
    <img src="./assets/logo.png">
    <el-form label-position="left" class="form" :qrules="form.rules" label-width="240px" :model="form.values" ref="urlForm">
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
          <el-form-item v-if="form.userCheck.short" :label="domain+'/'" label-width="130px" prop="short">
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
          <el-button type="primary" @click="submit">Сократить</el-button>
          <!-- <button @click="submit">сократить ссылку {{form.errors.url}}</button> -->
        </el-col>
      </el-row>
    <el-card v-if="createUrl" class="box-card">
      <div>Ваша ссылка: {{createUrl}} </div>
      <div>
        <el-button  @click="openInNewTab(createUrl)">Перейти</el-button>
      </div>

    </el-card>
    </el-form>
  </div>
</template>

<script> 
import axios from 'axios'

import config from './config_app'

let lo = console.log

axios.defaults['withCredentials'] = true;
axios.interceptors.response.use((response) => {
  return response;
}, function(error) {

  return Promise.reject(error.response);
});

export default {
  name: 'app',
  data() {
    return {
      createUrl: false,
      domain:config.domain,
      form: {
        userCheck: {
          short: false,
          limit: false
        },
        values: {
          url: 'htt5ps://github.com/vuejs/vue-cli',
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
            { required: true, message: 'А какое окончание нужно?', rigger: 'blur' }
          ],
          limit: [
            { required: true, message: 'Так сколько раз нужно использовать?' },
            { required: true, message: 'Ну это не число.', pattern: /^\d+$/ }
          ],
        }
      }
    }
  },
  methods: {
    showError(title, msg) {
      this.$notify.error({
        title,
        message: msg
      });
    },
    openInNewTab(url) {
      var win = window.open(url, '_blank');
      win.focus();
    },
    showInfo(title, msg) {
      this.$notify.success({
        title,
        message: msg,
        type: 'success'
      });
    },
    submit(e) {
      this.$refs.urlForm.validate((valid) => {
        let { url, short, limit } = this.form.values;
        let userCheck = this.form.userCheck;
        limit = userCheck.limit ? limit : -1
        let { url: urlReq, method } = config.urls.submit

        if (!(method in axios)) {
          throw Error('метод запроса не найден')
        }
        axios.post(urlReq, { form: { url, short, limit } }).then(result => {
          let data = result.data;
          if (data.success == true) {
            let url = config.domain + data.response.url
            this.createUrl = url
          }

          this.showInfo('Успех', 'Ссылка создана')
        }).catch(err => {

          let msg = err.data.error.msg
          this.showError('Ошибка', err.data.error.msg)
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
.form{
  width: 980px;
  margin: auto
}
.box-card{
  margin-top: 20px
}
</style>
