<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Chatroom;

class ChatroomController extends BaseController
{
    public function index(Request $request)
    {
        $user_id = intval($request['user_id']);
        $room = Chatroom::where('user_id1', $user_id)
              ->orderBy('updated_at', 'desc')->take(10)->get();

        foreach ($room as &$user) {
            $request->merge([
                'user_id' => $user['user_id2'],
            ]);
            $userInfo = app()->call('App\Http\Controllers\Api\UserController@index', [$request]);
            $user['username'] = $userInfo->original['name'];
            $user['avatar_url'] = $userInfo->original['avatar_url'];
            $user['online_time'] = $userInfo->original['online_time'];
        }

        return response()->json($room);
    }

    public function create(Request $request)
    {
        $user_id1 = intval($request['user_id1']);
        $user_id2 = intval($request['user_id2']);

        Schema::create('chat_' . $user_id1 . '_' . $user_id2, function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('from');
            $table->unsignedBigInteger('to');
            $table->string('message');
            $table->timestamps();
        });

        return response()->json(['table' => 'chat_' . $user_id1 . '_' . $user_id2]);
    }
    
    protected function update(Request $request)
    {
        $user_id1 = intval($request['user_id1']);
        $user_id2 = intval($request['user_id2']);
        
        $room = Chatroom::where('user_id1', $user_id1)->where('user_id2', $user_id2)->get();
        if (count($room) === 0) {
            if ($user_id1 <= $user_id2) {
                $this->create($request);
            }
            $room = new Chatroom();
            $room->user_id1 = $user_id1;
            $room->user_id2 = $user_id2;
        } else {
            $room = $room[0];
        }
        $room->last_message = $request['last_message'];
        $room->save();
    }
    
    public function store(Request $request)
    {
        $this->update($request);
        if ($request['user_id1'] !== $request['user_id2']) {
            // Swap
            $request->merge([
                'user_id1' => $request['user_id2'],
                'user_id2' => $request['user_id1'],
            ]);
            $this->update($request);
        }
        
        return response()->json(['message' => $request['last_message']]);
    }
}
