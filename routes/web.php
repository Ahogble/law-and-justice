<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

// Public Route
Route::get('/', [PublicController::class, 'index'])->name('home');

// Auth Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected Admin CMS Routes
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // Articles
    Route::post('/articles', [AdminController::class, 'saveArticle'])->name('admin.articles.save');
    Route::delete('/articles/{id}', [AdminController::class, 'deleteArticle'])->name('admin.articles.delete');

    // Members
    Route::post('/members', [AdminController::class, 'saveMember'])->name('admin.members.save');
    Route::delete('/members/{id}', [AdminController::class, 'deleteMember'])->name('admin.members.delete');
    Route::post('/member-categories', [AdminController::class, 'saveMemberCategories'])->name('admin.member-categories.save');

    // Projects
    Route::post('/projects', [AdminController::class, 'saveProject'])->name('admin.projects.save');
    Route::delete('/projects/{id}', [AdminController::class, 'deleteProject'])->name('admin.projects.delete');

    // Activities
    Route::post('/activities', [AdminController::class, 'saveActivity'])->name('admin.activities.save');
    Route::delete('/activities/{id}', [AdminController::class, 'deleteActivity'])->name('admin.activities.delete');

    // Legal Texts
    Route::post('/legal-texts', [AdminController::class, 'saveLegalText'])->name('admin.legal-texts.save');
    Route::delete('/legal-texts/{id}', [AdminController::class, 'deleteLegalText'])->name('admin.legal-texts.delete');

    // Disputes Management
    Route::post('/dispute-officers', [AdminController::class, 'saveDisputeOfficer'])->name('admin.dispute-officers.save');
    Route::delete('/dispute-officers/{id}', [AdminController::class, 'deleteDisputeOfficer'])->name('admin.dispute-officers.delete');
    Route::post('/dispute-cases', [AdminController::class, 'saveDisputeCase'])->name('admin.dispute-cases.save');
    Route::delete('/dispute-cases/{id}', [AdminController::class, 'deleteDisputeCase'])->name('admin.dispute-cases.delete');
    Route::post('/dispute-stages', [AdminController::class, 'saveDisputeStages'])->name('admin.dispute-stages.save');

    // Settings
    Route::post('/settings', [AdminController::class, 'updateSettings'])->name('admin.settings.update');
});
