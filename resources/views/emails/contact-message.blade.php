<x-mail::message>
# {{ $contactMessage->type === 'improvement' ? 'New Property Improvement Suggestion' : 'New Contact Message' }}

**Name:** {{ $contactMessage->name }}

**Email:** {{ $contactMessage->email }}

@if($contactMessage->type === 'improvement')
**Property:** #{{ $contactMessage->property_id }}

**Type of Improvement:** {{ $contactMessage->improvement_type_label }}
@else
**Subject:** {{ $contactMessage->subject ?: '(no subject)' }}
@endif

<x-mail::panel>
{{ $contactMessage->message }}
</x-mail::panel>

Sent {{ $contactMessage->created_at->format('M j, Y g:i A') }}
@if($contactMessage->user)
by registered user {{ $contactMessage->user->first_name }} {{ $contactMessage->user->last_name }} ({{ $contactMessage->user->email }})
@else
by a guest visitor
@endif

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
