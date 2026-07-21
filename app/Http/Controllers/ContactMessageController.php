<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ContactMessageStoreRequest;
use App\Http\Requests\PropertyImprovementStoreRequest;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    // Ruta pública, accesible sin autenticación
    public function store(ContactMessageStoreRequest $request): RedirectResponse
    {
        $contactMessage = ContactMessage::create([
            ...$request->validated(),
            'user_id' => $request->user()?->id,
        ]);

        // Mail::to(config('services.contact.notify_email'))->send(new ContactMessageReceived($contactMessage));

        return back()->with('success', 'Your message has been sent. We will get back to you soon.');
    }

    // Sugerencia de mejora sobre una propiedad, enviada desde su vista de detalle
    public function storeImprovement(PropertyImprovementStoreRequest $request, Property $property): RedirectResponse
    {
        $user = $request->user();

        $contactMessage = ContactMessage::create([
            'type' => 'improvement',
            'property_id' => $property->id,
            'improvement_type' => $request->improvement_type,
            'name' => trim($user->first_name . ' ' . $user->last_name),
            'email' => $user->email,
            'subject' => 'Property Improvement — Property #' . $property->id,
            'message' => $request->message,
            'user_id' => $user->id,
        ]);

        // Mail::to(config('services.contact.notify_email'))->send(new ContactMessageReceived($contactMessage));

        return back()->with('success', 'Thanks! Your suggestion has been sent.');
    }

    // Historial (Admin), requiere autenticación
    public function index(Request $request): Response
    {
        // Gate::authorize(PermissionsEnum::ViewContactMessages);

        $query = ContactMessage::with(['user:id,first_name,last_name,email', 'property:id,street,unit_number'])->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($sub) use ($search) {
                $sub->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        $messages = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/contacts/index', [
            'messages' => $messages,
            'filters' => $request->only(['search', 'type']),
        ]);
    }
}
