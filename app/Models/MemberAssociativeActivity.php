<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MemberAssociativeActivity extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected $fillable = [
        'id',
        'member_id',
        'membership_application_id',
        'type',
        'title',
        'role',
        'organization_unit',
        'start_date',
        'end_date',
        'is_current',
        'status',
        'description',
        'document_url',
        'document_name',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'id');
    }

    public function application()
    {
        return $this->belongsTo(MembershipApplication::class, 'membership_application_id', 'id');
    }
}
