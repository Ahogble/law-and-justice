<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    public static function getByKey(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        if (! $setting) {
            return $default;
        }
        $decoded = json_decode($setting->value, true);

        return json_last_error() === JSON_ERROR_NONE ? $decoded : $setting->value;
    }

    public static function setByKey(string $key, $value): void
    {
        $encoded = is_array($value) || is_object($value) ? json_encode($value) : $value;
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $encoded]
        );
    }
}
