<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LegalText extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'titleEn',
        'subtitle',
        'subtitleEn',
        'reference',
        'referenceEn',
        'category',
        'date',
        'dateEn',
        'summary',
        'full_text',
        'pdf_url',
        'sections'
    ];

    protected $casts = [
        'sections' => 'array'
    ];
}
