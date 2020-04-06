<?php

namespace App\Http\Controllers;

use App\User;
use App\Events\ChatEvent;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

  public function chat(){
        return view('chat');
  }

  public function send(request $request){

     // return $request->all();
   
      $user = Auth::user();
      //event(new ChatEvent($request->message,$user));
      $this->saveToSession($request);
      broadcast(new ChatEvent($request->message,$user))->toOthers();

      return (['status' => 'success']);
  }

  public function saveToSession(request $request){
     session()->put('chat',$request->chat);
  }

  public function getOldMessage(){
     return session('chat');
  }

  public function deleteSession(){
      session()->forget('chat');
  }

//   public function send(){

//     $message = "Hello!";
    
//     $user = User::find(Auth::id());
//     event(new ChatEvent($message,$user));
// }
}
