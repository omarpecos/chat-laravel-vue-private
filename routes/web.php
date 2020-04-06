<?php


Route::get('/', function () {
    return view('welcome');
});

Route::get('/chat','ChatController@chat');
Route::post('/send','ChatController@send');

/*Route::get('check',function(){
    return session('chat');
});*/

Route::get('getOldMessage','ChatController@getOldMessage');
Route::post('saveToSession','ChatController@saveToSession');
Route::get('deleteSession','ChatController@deleteSession');


Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
