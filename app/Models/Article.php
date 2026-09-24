<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'slug',
        'excerpt',
        'content',
        'category',
        'author_name',
        'author_role',
        'published_at',
        'read_time',
        'image_url',
        'tags',
        'pdf_url',
    ];

    protected $casts = [
        'tags' => 'array',
    ];
}
