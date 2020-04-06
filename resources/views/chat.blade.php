<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real Time Chat</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="stylesheet" href="{{asset('css/app.css')}}">

    <style>
        .list-group{
            overflow-y : auto;
            height : 200px;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .list-group::-webkit-scrollbar {
        display: none;
        }

    </style>
</head>
<body>

<div class="container">
    <div class="row" id="app">

      <div class=" offset-4 col-4 offset-sm-1 col-sm-10">

      <li class="list-group-item active">Sala de Chat
        &nbsp;<span class="badge badge-pill badge-danger">@{{ numberOfUsers }}</span>
      </li>
            <ul class="list-group" v-chat-scroll>
                 
                <message
                    v-for="value,index in chat.message"
                    :key="value.index"
                    :color="chat.color[index]"
                    :user = "chat.user[index]"
                    :time="chat.time[index]"
                >
                    @{{value}}
                </message>
            
            </ul>

            <input type="text" v-model="message" @keyup.enter="send" class="form-control" placeholder="Escribe aquí tu mensaje...">
            <input type="hidden" id="userName" value="{{ Auth::user()->name }}" >
            <div class="badge badge-pill badge-primary">@{{ typing }}</div>   
                </br>
            <a href="" class="btn btn-warning btn-sm" @click.prevent="deleteSession">Borrar chats</a>
        </div>
    </div>
</div>

    <script src="{{asset('js/app.js')}}"></script>
</body>
</html>