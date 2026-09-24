<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisputeCase extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'case_number',
        'title',
        'category',
        'stage',
        'is_public',
        'status',
        'date_submitted',
        'summary',
        'parties',
        'assigned_officer',
        'confidentiality_note',
        'resolution_timeframe',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];
}
