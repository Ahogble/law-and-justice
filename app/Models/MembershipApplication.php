<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipApplication extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'application_number',
        'tier_id',
        'tier_name',
        'tier_price',
        'civility',
        'first_name',
        'last_name',
        'birth_date',
        'birth_place',
        'marital_status',
        'cni',
        'cni_url',
        'avatar_url',
        'email',
        'phone',
        'whatsapp',
        'secondary_phone',
        'address',
        'country',
        'region',
        'department',
        'locality',
        'profession',
        'institution',
        'motivation',
        'payment_method',
        'payment_reference',
        'payment_receipt_url',
        'payment_status',
        'payment_verified_at',
        'status',
        'admin_notes',
        'reviewed_at',
        'member_id',
    ];

    protected $casts = [
        'tier_price' => 'integer',
        'birth_date' => 'date',
        'reviewed_at' => 'datetime',
        'payment_verified_at' => 'datetime',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'id');
    }

    public function cases()
    {
        return $this->hasMany(MemberCase::class, 'membership_application_id', 'id')->orderBy('created_at', 'desc');
    }

    public function associativeActivities()
    {
        return $this->hasMany(MemberAssociativeActivity::class, 'membership_application_id', 'id')->orderBy('start_date', 'desc');
    }
}
