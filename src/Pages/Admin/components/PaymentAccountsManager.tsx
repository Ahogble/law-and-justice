import React, { useState } from 'react';
import { CreditCard, Plus, Save, Trash2, Edit, Check, Smartphone, Landmark, AlertCircle, Copy, CheckCircle2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { PaymentAccount } from '../../../types';

interface PaymentAccountsManagerProps {
  accounts: PaymentAccount[];
  requestConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
}

export default function PaymentAccountsManager({
  accounts = [],
  requestConfirmation,
}: PaymentAccountsManagerProps) {
  const [accountList, setAccountList] = useState<PaymentAccount[]>(accounts);
  const [editingAccount, setEditingAccount] = useState<PaymentAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleOpenNew = () => {
    setEditingAccount({
      id: 'acc-' + Date.now(),
      type: 'mobile',
      name: '',
      bank_name: '',
      account_holder: 'Association Droit & Justice',
      account_number: '',
      iban: '',
      swift: '',
      phone_number: '',
      instructions: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: PaymentAccount) => {
    setEditingAccount({ ...acc });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    const exists = accountList.some(a => a.id === editingAccount.id);
    let updated: PaymentAccount[];
    if (exists) {
      updated = accountList.map(a => a.id === editingAccount.id ? editingAccount : a);
    } else {
      updated = [...accountList, editingAccount];
    }
    setAccountList(updated);
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleDelete = (id: string, name: string) => {
    requestConfirmation(
      "Supprimer ce compte de paiement",
      `Êtes-vous certain de vouloir supprimer le compte "${name}" ? Les candidats ne pourront plus le sélectionner sur le formulaire d'adhésion.`,
      () => {
        setAccountList(accountList.filter(a => a.id !== id));
      }
    );
  };

  const handleToggleActive = (id: string) => {
    setAccountList(accountList.map(a => a.id === id ? { ...a, active: a.active === false ? true : false } : a));
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setSaveMessage(null);

    router.post('/admin/payment-accounts', {
      payment_accounts: accountList,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSaving(false);
        setSaveMessage('Comptes de paiement enregistrés avec succès !');
        setTimeout(() => setSaveMessage(null), 4000);
      },
      onError: () => {
        setIsSaving(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-serif font-bold text-slate-900">
              Comptes &amp; Coordonnées de Paiement
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configurez les comptes bancaires et numéros Mobile Money affichés aux candidats lors du règlement de la cotisation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenNew}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un compte</span>
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-60 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Enregistrement...' : 'Enregistrer la configuration'}</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountList.map((account) => {
          const isBank = account.type === 'bank';
          const isActive = account.active !== false;

          return (
            <div
              key={account.id}
              className={`bg-white rounded-xl border p-4 flex flex-col justify-between shadow-xs transition-all ${
                isActive ? 'border-slate-200 hover:border-amber-300' : 'border-slate-200 opacity-60 bg-slate-50/50'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isBank ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {isBank ? <Landmark className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">
                        {account.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {isBank ? (account.bank_name || 'Virement bancaire') : 'Mobile Money'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(account)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Modifier"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id, account.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1.5 text-xs mb-3 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans uppercase block">Titulaire :</span>
                    <span className="font-semibold text-slate-800">{account.account_holder}</span>
                  </div>

                  {isBank ? (
                    <>
                      {account.account_number && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-sans uppercase block">N° de Compte / RIB :</span>
                          <span className="font-bold text-slate-900 select-all">{account.account_number}</span>
                        </div>
                      )}
                      {account.iban && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-sans uppercase block">IBAN :</span>
                          <span className="font-semibold text-slate-800 select-all">{account.iban}</span>
                        </div>
                      )}
                      {account.swift && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-sans uppercase block">BIC / SWIFT :</span>
                          <span className="font-semibold text-slate-700">{account.swift}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans uppercase block">Numéro de Transfert :</span>
                      <span className="font-bold text-amber-900 text-sm select-all">{account.phone_number || 'Non renseigné'}</span>
                    </div>
                  )}

                  {account.instructions && (
                    <div className="pt-1 border-t border-slate-200/60 font-sans text-[11px] text-slate-600">
                      {account.instructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                  isActive ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  {isActive ? 'Actif sur le formulaire' : 'Désactivé'}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleActive(account.id)}
                  className={`text-[11px] font-semibold underline cursor-pointer ${
                    isActive ? 'text-slate-500 hover:text-slate-800' : 'text-amber-700 hover:text-amber-900'
                  }`}
                >
                  {isActive ? 'Désactiver' : 'Activer'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / New Modal */}
      {isModalOpen && editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>{accountList.some(a => a.id === editingAccount.id) ? 'Modifier le compte' : 'Nouveau compte de paiement'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type de compte *</label>
                  <select
                    value={editingAccount.type}
                    onChange={(e) => setEditingAccount({ ...editingAccount, type: e.target.value as any })}
                    className="w-full bg-slate-50 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                  >
                    <option value="mobile">Mobile Money (Wave, OM, MoMo...)</option>
                    <option value="bank">Compte Bancaire (Virement)</option>
                    <option value="other">Autre moyen</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Intitulé / Nom du mode *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Wave, Orange Money, BOA..."
                    value={editingAccount.name}
                    onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                    className="w-full bg-slate-50 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titulaire du compte *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Association Droit & Justice"
                  value={editingAccount.account_holder}
                  onChange={(e) => setEditingAccount({ ...editingAccount, account_holder: e.target.value })}
                  className="w-full bg-slate-50 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              {editingAccount.type === 'bank' ? (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nom de la Banque</label>
                    <input
                      type="text"
                      placeholder="Ex : Société Générale Côte d'Ivoire (SGCI)"
                      value={editingAccount.bank_name || ''}
                      onChange={(e) => setEditingAccount({ ...editingAccount, bank_name: e.target.value })}
                      className="w-full bg-slate-50 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">N° de Compte / RIB</label>
                    <input
                      type="text"
                      placeholder="Ex : CI092 01001 00293848201 45"
                      value={editingAccount.account_number || ''}
                      onChange={(e) => setEditingAccount({ ...editingAccount, account_number: e.target.value })}
                      className="w-full bg-slate-50 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">IBAN</label>
                      <input
                        type="text"
                        placeholder="Ex : CI092..."
                        value={editingAccount.iban || ''}
                        onChange={(e) => setEditingAccount({ ...editingAccount, iban: e.target.value })}
                        className="w-full bg-slate-50 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Code SWIFT / BIC</label>
                      <input
                        type="text"
                        placeholder="Ex : SGCICIAB"
                        value={editingAccount.swift || ''}
                        onChange={(e) => setEditingAccount({ ...editingAccount, swift: e.target.value })}
                        className="w-full bg-slate-50 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Numéro de téléphone / Compte *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : +225 07 00 00 00 01"
                    value={editingAccount.phone_number || ''}
                    onChange={(e) => setEditingAccount({ ...editingAccount, phone_number: e.target.value })}
                    className="w-full bg-slate-50 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions pour le candidat</label>
                <textarea
                  rows={2}
                  placeholder="Ex : Mentionnez votre nom et prénom en libellé de transfert..."
                  value={editingAccount.instructions || ''}
                  onChange={(e) => setEditingAccount({ ...editingAccount, instructions: e.target.value })}
                  className="w-full bg-slate-50 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active-check"
                  checked={editingAccount.active !== false}
                  onChange={(e) => setEditingAccount({ ...editingAccount, active: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <label htmlFor="active-check" className="font-semibold text-slate-700 cursor-pointer">
                  Actif (visible immédiatement sur le formulaire d'adhésion)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-sm"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
