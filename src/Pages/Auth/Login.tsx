import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      <Head title="Connexion Administrateur — Droit & Justice" />
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="px-6 py-6 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex items-center justify-between z-10">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Retour au site public</span>
        </a>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-serif font-bold tracking-tight text-white block leading-none">Droit & Justice</span>
            <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Portail d'Administration</span>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-md bg-slate-900/70 border border-slate-800/90 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/50 relative">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">Connexion Administrateur</h1>
            <p className="text-sm text-slate-400 mt-2">
              Veuillez saisir vos identifiants pour gérer le contenu public du site Droit & Justice.
            </p>
          </div>

          {/* Error Banner */}
          {combinedErrors.email && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>{combinedErrors.email}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="admin@droit-justice.asso.fr"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Mot de Passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-amber-500/50"
                />
                <span className="text-xs">Se souvenir de moi</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
      <footer className="px-6 py-4 text-center text-xs text-slate-600 border-t border-slate-900 z-10">
        &copy; {new Date().getFullYear()} Droit & Justice — Système de Gestion de Contenu Intégré (Laravel + React)
      </footer>
    </div>
  );
}
