<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'type',
        'date',
        'location',
        'description',
        'speakers',
        'status',
        'registration_link',
    ];

    protected $casts = [
        'speakers' => 'array',
    ];
}
