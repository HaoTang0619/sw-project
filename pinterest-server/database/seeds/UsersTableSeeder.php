<?php

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'admin',
            'email' => 'cms@funpodium.net',
            'password' => Hash::make('admin'),
            'roles' => '1',
            'created_at' => date("Y-m-d H:i:s"),
            'user_id' => '1',
            // 'api_token' => Str::random(80),
        ]);

        if (env('APP_ENV') == 'stage') {
            DB::table('users')->insert([
                'name' => 'xxx',
                'email' => 'xxx@funpodium.net',
                'password' => Hash::make('asdf1234'),
                'roles' => '1',
                'created_at' => date("Y-m-d H:i:s"),
                'user_id' => '2',
                // 'api_token' => Str::random(80),
            ]);
        }
    }
}