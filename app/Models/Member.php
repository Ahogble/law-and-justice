<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'role',
        'organization',
        'category',
        'subcategory',
        'bio',
        'avatar_url',
        'specialties',
        'publication_count',
        'email',
        'joined_year',
    ];

    protected $casts = [
        'specialties' => 'array',
        'publication_count' => 'integer',
        'joined_year' => 'integer',
    ];
}
