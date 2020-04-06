

require('./bootstrap');

window.Vue = require('vue');

// for auto scroll
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

//notifications
import Toaster from 'v-toaster'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, {timeout: 5000})

Vue.component('message', require('./components/message.vue').default);

// Enable pusher logging - don't include this in production
//Pusher.logToConsole = true;


const app = new Vue({
    el: '#app',
    data : {
        message : '',
        chat : {
            message : [],
            user:[],
            color :[],
            time:[]
        },
        typing : '',
        numberOfUsers : 0,
        userName : ''
    },

    watch:{
        message(){
            Echo.private('chat')
                .whisper('typing', {
                    name: this.userName,
                    msg : this.message
                });
        }
    },

    methods : {
        send(){
            if (this.message.length != 0){

               this.chat.message.push(this.message);
               this.chat.color.push('success');
               this.chat.user.push('you');
               this.chat.time.push(this.getTime());

               axios.post('send', {
                      message : this.message,
                       chat : this.chat
                    })
                    .then( response => {
                        //console.log(response);
                         //vacia el input
                         this.message = '';
                    })
                    .catch( error =>{
                        console.log("tus muelas");
                        console.log(error);
                    });
            }
        },

        getTime(){
            let time = new Date();

            return time.getHours()+':'+time.getMinutes();
        },

        getOldMessages(){
            axios.get('/getOldMessage')
                .then(response =>{
                    console.log(response);

                    if (response.data !=''){
                        this.chat = response.data;
                    }
                    
                })
                .catch(error =>{
                    console.log(error);
                });
        },

        deleteSession(){
            axios.get('/deleteSession')
            .then( response =>{
                this.chat.message = [];
                this.chat.user = [];
                this.chat.color = [];
                this.chat.time = [];

                this.$toaster.success('Historial de chats eliminado');
            });
        }
    },

   mounted() { 

        Echo.private('chat')
            .listen('ChatEvent', (e) => {
                
                this.chat.message.push(e.message);
                this.chat.user.push(e.user);
                this.chat.color.push('warning');
                this.chat.time.push(this.getTime());
                //console.log(e);

                axios.post('/saveToSession',{
                    chat : this.chat
                })
                .then(response =>{
                  
                })
                .catch(error =>{
                    console.log(error);
                });
               
            })

            .listenForWhisper('typing', (e) => {

                if (e.msg != ''){
                    this.typing = e.name +' está escribiendo...';
                }else{
                    this.typing = '';
                }
                
            });

        Echo.join(`chat`)
                .here((users) => {
                    this.numberOfUsers = users.length;
                    this.getOldMessages();
                        //console.log(users);
                    this.userName = $("#userName").val();
                        //console.log('USER : '+ this.userName);
                })
                .joining((user) => {
                    this.numberOfUsers += 1;
                        //console.log(user);
                    this.$toaster.success(user.name+' se ha unido a la sala');
                
                })
                .leaving((user) => {
                    this.numberOfUsers -= 1;
                   // console.log(user.name);
                   this.$toaster.warning(user.name+' ha abandonado la sala');
                });
    }
});
