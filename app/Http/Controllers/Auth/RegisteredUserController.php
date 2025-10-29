<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register',[
            'municipalities' => \App\Models\Municipality::orderBy('name')->get(),
            'account_types' => UserTypeEnum::labels(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(UserStoreRequest $request): RedirectResponse
    {
       
        DB::beginTransaction();

        try {

            $user = User::create([
                'document' => $request->document,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'company_name' => $request->company_name,
                'municipality_id' => $request->municipality_id,
                'zip_code' => $request->zip_code,
                'account_type' => $request->account_type,
                'email' => $request->email,
                'username' => $request->email,
                'password' => Hash::make($request->password),
                'address_main' => $request->address_main,
                'address_secondary' => $request->address_secondary,
                'phone_number' => $request->phone_number,
                'cell_number' => $request->cell_number,
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            $user->assignRole($request->role);

            event(new Registered($user));

            // Auth::login($user);

            DB::commit();

            return redirect()->intended(route('dashboard', false));
            // return redirect()->route('admin.users.index')->with('success', 'Usuario creado con éxito.');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'No se pudo crear el usuario.'.$th->getMessage()]);
        }

    }
}
