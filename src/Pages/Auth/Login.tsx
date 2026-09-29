import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Shield, Lock, Mail, User, ArrowLeft, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { errors: pageErrors } = usePage().props as any;
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  const combinedErrors = { ...errors, ...pageErrors };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden">
      <Head title="Connexion Administrateur — Droit & Justice" />
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="px-6 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between z-10 shadow-xs">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-amber-700 font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Retour au site public</span>
        </a>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-serif font-bold tracking-tight text-slate-900 block leading-none">Droit & Justice</span>
            <span className="text-[10px] text-amber-700 uppercase tracking-wider font-bold">Portail d'Administration</span>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-8 backdrop-blur-xl shadow-xl shadow-slate-200/60 relative">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 mb-4 shadow-xs">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">Connexion Administrateur</h1>
            <p className="text-sm text-slate-600 mt-2">
              Veuillez saisir vos identifiants pour gérer le contenu public du site Droit & Justice.
            </p>
          </div>

          {/* Error Banner */}
          {combinedErrors.email && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm shadow-xs">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <div>{combinedErrors.email}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Identifiant de connexion / Téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="693937000"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mot de Passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm shadow-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500/30"
                />
                <span className="text-xs font-medium">Se souvenir de moi</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {processing ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Se Connecter au Back-Office</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white/50 backdrop-blur-xs z-10">
        &copy; {new Date().getFullYear()} Droit & Justice — Système de Gestion de Contenu Intégré (Laravel + React)
      </footer>
    </div>
  );
}
