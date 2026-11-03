<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemberCaseEvent extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'member_case_id',
        'event_date',
        'status',
        'next_hearing_date',
        'reason',
        'notes',
    ];

    protected $casts = [
        'event_date' => 'date',
        'next_hearing_date' => 'date',
    ];

    public function memberCase()
    {
        return $this->belongsTo(MemberCase::class, 'member_case_id', 'id');
    }
}
