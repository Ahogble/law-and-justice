<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemberCaseDocument extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'member_case_id',
        'title',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function memberCase()
    {
        return $this->belongsTo(MemberCase::class, 'member_case_id', 'id');
    }
}
