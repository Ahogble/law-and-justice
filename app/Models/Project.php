<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'status',
        'category',
        'description',
        'lead',
        'start_date',
        'target_date',
        'deliverables',
        'progress',
    ];

    protected $casts = [
        'deliverables' => 'array',
        'progress' => 'integer',
    ];
}
