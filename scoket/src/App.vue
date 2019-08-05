<template>
  <ul class="pages">
    <li class="chat page"
        v-if="isLogin">
      <div class="chatArea">
        <ul class="messages">
          <div v-for="(item, index) in messages"
               :key="index">
            <li class="message"
                v-if="item.type==='message'">
              <span class="username"
                    :style="{color: randomColor()}">{{item.username}}</span>
              <span class="messageBody">{{item.message}}</span>
            </li>
            <li v-else-if="item.type==='log'"
                class="log">{{item.message}}</li>
            <li v-else>{{JSON.stringify(item)}}</li>
          </div>
        </ul>
      </div>
      <input class="inputMessage"
             v-model="message"
             @input="typing"
             placeholder="Type here..."
             @keydown.enter="sendMessage" />
    </li>
    <li class="login page"
        v-else>
      <div class="form">
        <h3 class="title">What's your nickname?</h3>
        <input v-model="userName"
               class="usernameInput"
               type="text"
               maxlength="14"
               @keydown.enter="setUserName" />
      </div>
    </li>
  </ul>
</template>

<script>
import * as utils from './utils/socket.js';
const COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];
export default {
  name: 'app',
  data () {
    return {
      isLogin: false,
      userName: '',
      messages: [],
      message: '',
      isTyping: false
    }
  },
  methods: {
    randomColor () {
      return COLORS[Math.floor(Math.random() * 11)]
    },
    setUserName () {
      if (this.userName) {
        utils.addUser(this.userName);
        this.isLogin = true;
        // 注册监听事件
        utils.initSocket({
          'new message': this.receiveMessage,
          'login': () => this.log('Welcome to Socket.IO Chat – '),
          'user joined': data => this.log(data.username + ' joined'),
          'user left': data => this.log(data.username + ' left'),
          'typing': this.receiveTyping,
          'stop typing': this.stopTyping
        })
      }
    },
    sendMessage () {
      // 告诉服务端停止输入
      utils.stopTyping();
      // 发送消息
      utils.newMessage({ username: this.userName, message: this.message });
      // 追加到消息列表
      this.messages.push({
        type: 'message',
        username: this.userName,
        message: this.message
      });
      // 把输入框制空
      this.message = '';
    },
    typing () {
      utils.typing();
    },
    receiveMessage (data) {
      this.messages.push({
        type: 'message',
        ...data.message
      })
    },
    log (message) {
      this.messages.push({
        type: 'log',
        message
      })
    },
    receiveTyping (data) {
      if (this.isTyping) {
        return;
      }
      this.messages.push({
        type: 'message',
        ...data,
        message: 'is typing'
      })
      this.isTyping = true;
    },
    stopTyping (data) {
      let index = this.messages.findIndex(item => item.username === data.username && item.message === 'is typing');
      this.messages.splice(index, 1);
      this.isTyping = false;
    }
  },
  created () {
    // 先建立socket连接
    utils.login();
  }
}
</script>

<style lang="scss">
/* Fix user-agent */
* {
  box-sizing: border-box;
}
html {
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}
html,
input {
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue",
    Helvetica, Arial, "Lucida Grande", sans-serif;
}
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
  word-wrap: break-word;
}
/* Pages */
.pages {
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
}
.page {
  height: 100%;
  position: absolute;
  width: 100%;
}
/* Login Page */
.login.page {
  background-color: #000;
}
.login.page .form {
  height: 100px;
  margin-top: -100px;
  position: absolute;
  text-align: center;
  top: 50%;
  width: 100%;
}
.login.page .form .usernameInput {
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #fff;
  outline: none;
  padding-bottom: 15px;
  text-align: center;
  width: 400px;
}
.login.page .title {
  font-size: 200%;
}
.login.page .usernameInput {
  font-size: 200%;
  letter-spacing: 3px;
}
.login.page .title,
.login.page .usernameInput {
  color: #fff;
  font-weight: 100;
}
/* Font */
.messages {
  font-size: 150%;
}
.inputMessage {
  font-size: 100%;
}
.log {
  color: gray;
  font-size: 70%;
  margin: 5px;
  text-align: center;
}
/* Messages */
.chatArea {
  height: 100%;
  padding-bottom: 60px;
}
.messages {
  height: 100%;
  margin: 0;
  overflow-y: scroll;
  padding: 10px 20px 10px 20px;
}
.message.typing .messageBody {
  color: gray;
}
.username {
  font-weight: 700;
  overflow: hidden;
  padding-right: 15px;
  text-align: right;
}
/* Input */
.inputMessage {
  border: 10px solid #000;
  bottom: 0;
  height: 60px;
  left: 0;
  outline: none;
  padding-left: 10px;
  position: absolute;
  right: 0;
  width: 100%;
}
</style>