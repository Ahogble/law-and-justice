<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisputeOfficer extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'title',
        'role',
        'stage',
        'category',
        'specialties',
        'experience_years',
        'cases_handled',
        'avatar_url',
        'email',
        'availability',
    ];

    protected $casts = [
        'specialties' => 'array',
        'experience_years' => 'integer',
        'cases_handled' => 'integer',
    ];
}
