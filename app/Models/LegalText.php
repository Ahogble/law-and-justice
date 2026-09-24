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
        'reference',
        'category',
        'date',
        'summary',
        'full_text',
        'pdf_url',
    ];
}
