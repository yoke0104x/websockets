// import io from 'socket.io-client';

// socket客户端实例
let socket = null;

// 建立连接
export let login = ()=>{
    socket = io('http://localhost:3000');
}

// 添加用户
export let addUser = username=>{
    socket.emit('add user', username);
}

// 发送消息
export let newMessage = message=>{
    socket.emit('new message', message);
}

// 正在输入
export let typing = ()=>{
    socket.emit('typing');
}

// 停止输入
export let stopTyping = ()=>{
    socket.emit('stop typing');
}

// 初始化监听
export let initSocket = obj=>{
    for (let key in obj){
        console.log('socket...', socket);
        socket.on(key, obj[key]);
    }
}