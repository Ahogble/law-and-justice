<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemberCase extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'member_id',
        'membership_application_id',
        'case_number',
        'title',
        'category',
        'jurisdiction',
        'opposing_party',
        'status',
        'hearing_date',
        'hearing_reason',
        'summary',
        'opened_at',
        'closed_at',
    ];

    protected $casts = [
        'hearing_date' => 'date',
        'opened_at' => 'date',
        'closed_at' => 'date',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'id');
    }

    public function application()
    {
        return $this->belongsTo(MembershipApplication::class, 'membership_application_id', 'id');
    }

    public function documents()
    {
        return $this->hasMany(MemberCaseDocument::class, 'member_case_id', 'id')->orderBy('created_at', 'desc');
    }

    public function events()
    {
        return $this->hasMany(MemberCaseEvent::class, 'member_case_id', 'id')->orderBy('event_date', 'desc');
    }
}
