<?php
namespace App\Http\Controllers;
use App\Models\Profile;
use App\Models\User;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\Request;
class ProfileController extends Controller
{

    public function show($id)
{

    $profile = Profile::where('user_id', $id)->first();
    if (!$profile) {
        return response()->json(['message' => 'Profile not found'], 404);
    }

    return response()->json(
    [
        'id' => $profile->id,
        'user_id' => $profile->user_id,
        'name' => $profile->name,
        'email' => $profile->email,
        'created_at' => $profile->created_at


    ] ,
   );
}
public function update(ProfileUpdateRequest $request, $id)
{
    $profile = Profile::find($id);
    if (!$profile) {
        return response()->json(['message' => 'Profile not found'], 404);
    }


    $profile->update($request->validated());

    return response()->json($profile);
}
public function destroy($id)
{

    $profile = Profile::find($id);
    if (!$profile) {
        return response()->json(['message' => 'Профиль не найден'], 404);
    }
    $profile->delete();
    return response()->json([
        'message' => 'Профиль успешно удален'
    ], 200);
}

}