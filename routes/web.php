<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

// Public Route
Route::get('/', [PublicController::class, 'index'])->name('home');
Route::post('/membership-applications', [PublicController::class, 'submitMembershipApplication'])->name('membership.apply');

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
    Route::post('/article-categories', [AdminController::class, 'saveArticleCategories'])->name('admin.article-categories.save');

    // Members & Applications
    Route::post('/members', [AdminController::class, 'saveMember'])->name('admin.members.save');
    Route::delete('/members/{id}', [AdminController::class, 'deleteMember'])->name('admin.members.delete');
    Route::post('/member-categories', [AdminController::class, 'saveMemberCategories'])->name('admin.member-categories.save');
    Route::post('/applications/{id}/approve', [AdminController::class, 'approveApplication'])->name('admin.applications.approve');
    Route::post('/applications/{id}/reject', [AdminController::class, 'rejectApplication'])->name('admin.applications.reject');
    Route::delete('/applications/{id}', [AdminController::class, 'deleteApplication'])->name('admin.applications.delete');
    Route::post('/applications/{id}/note', [AdminController::class, 'updateApplicationNote'])->name('admin.applications.note');
    Route::post('/applications/{id}/admin-fields', [AdminController::class, 'updateApplicationAdminFields'])->name('admin.applications.admin-fields');
    Route::post('/applications/{id}/verify-payment', [AdminController::class, 'verifyPayment'])->name('admin.applications.verify-payment');

    // Member Cases (Fiche du Membre & Gestion des Affaires)
    Route::post('/member-cases', [AdminController::class, 'saveMemberCase'])->name('admin.member-cases.save');
    Route::delete('/member-cases/{id}', [AdminController::class, 'deleteMemberCase'])->name('admin.member-cases.delete');
    Route::post('/member-cases/{id}/status', [AdminController::class, 'updateMemberCaseStatus'])->name('admin.member-cases.status');
    Route::post('/member-cases/{id}/documents', [AdminController::class, 'uploadMemberCaseDocument'])->name('admin.member-cases.documents.upload');
    Route::delete('/member-case-documents/{id}', [AdminController::class, 'deleteMemberCaseDocument'])->name('admin.member-case-documents.delete');

    // Member Associative Life & Activities
    Route::post('/member-associative-activities', [AdminController::class, 'saveMemberAssociativeActivity'])->name('admin.member-associative-activities.save');
    Route::delete('/member-associative-activities/{id}', [AdminController::class, 'deleteMemberAssociativeActivity'])->name('admin.member-associative-activities.delete');

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

    // Settings & Configs
    Route::post('/settings', [AdminController::class, 'updateSettings'])->name('admin.settings.update');
    Route::post('/contact-config', [AdminController::class, 'saveContactConfig'])->name('admin.contact-config.save');
    Route::post('/membership-tiers', [AdminController::class, 'saveMembershipTiers'])->name('admin.membership-tiers.save');
    Route::post('/payment-accounts', [AdminController::class, 'savePaymentAccounts'])->name('admin.payment-accounts.save');
});
