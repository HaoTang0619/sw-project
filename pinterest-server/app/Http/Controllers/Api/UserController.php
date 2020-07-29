<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Post;
use Auth;
// use App\Models\PostDraft;
// use App\Models\Label;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Image;
use stdClass;

class UserController extends BaseController
{

    public function register(Request $request)
    {
        $isValid = RegisterController::validator($request);
        // var_dump($isValid->messages());
        if($isValid -> fails()){
            //do something ...
            //var_dump($isValid -> failed());
            return response()->json(['Message' => "Sign up fails!",'isSignUp' => false], 200);
        }
        else{
            // return "Sign up success !";
            $user = RegisterController::create($request);
            return response()->json(['Message' => "Sign up seccess!",'isSignUp' => true], 200);
        }
    }

    public function logIn(Request $request)
    {
        //return "Connected!";
        if(Auth::attempt(['email' => $request['email'], 'password' => $request['password']], true)){
            //var_dump(Auth::user()->name);
            return response()->json(['name' => Auth::user()->name, 'Message' => "Login success!", 'token' => Auth::user()->remember_token, 'isLogin' => true], 200);
        }
        else {
            return response()->json(['Message' => "Login fails!",'isLogin' => false], 200);
        }
    }

    public function logOut()
    {
        if(Auth::logout()){
            return response()->json(['Message' => "Logout success!",'isLogout' => true], 200);
        }
        else{
            return response()->json(['Message' => "Please try again!",'isLogout' => false], 200);
        }
    }

    public function authentication(Request $request)
    {
        $userToken = $request['accessToken'];
        if($userToken === null){
            return response()->json(['isValid' => false], 200);
        }
        $userInfo = DB::table('users')->where('remember_token', $userToken)->first();
        if($userInfo === null){
            return response()->json(['isValid' => false], 200);
        }
        else{
            return response()->json([
                'username' => $userInfo->name,
                'user_id' => $userInfo->id,
                'isValid' => true
            ], 200);
        }
    }
    
    public function userExist(Request $request)
    {
        $userInfo = DB::table('users')->where('name', $request['name'])->first();
        if($userInfo === null){
            return response()->json(['isValid' => false], 200);
        }
        else{
            return response()->json([
                'username' => $userInfo->name,
                'user_id' => $userInfo->id,
                'avatar_url' => $userInfo->avatar_url,
                'isValid' => true
            ], 200);
        }
    }
}
