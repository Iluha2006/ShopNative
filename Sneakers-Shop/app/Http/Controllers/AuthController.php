<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function register(RegisterRequest $request)
    {


            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);


            if (!$user->profile) {
                $user->profile()->create([
                    'name' => $user->name,
                    'email' => $user->email,

                ]);
            }


            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'success' => true,
                'message' => 'Регистрация успешна',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,

                ],
                'token' => $token,

            ], 201);

    }

    public function login(LoginRequest $request)
    {


            $user = User::with('profile')->where('email', $request->email)->first();

            $token = $user->createToken('auth_token')->plainTextToken;


            if (!$user->profile) {
                $user->profile()->create([
                    'name' => $user->name,
                    'email' => $user->email,
                ]);
                $user->load('profile');
            }

            return response()->json([
                'success' => true,
                'message' => 'Вход выполнен успешно',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'profile' => $user->profile,
                ],
                'token' => $token,
            ]);


    }

    public function logout(Request $request)
    {


            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'success' => true,
                'message' => 'Выход выполнен успешно'
            ]);


    }
    public function user(Request $request)
    {
        try {
            $user = $request->user()->load('profile');
            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'profile' => $user->profile,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не аутентифицирован'
            ], 401);
        }
    }


}