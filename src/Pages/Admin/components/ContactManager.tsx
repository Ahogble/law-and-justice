import React, { useState } from 'react';
import { Building2, AlertTriangle, Trash2, Plus, Save } from 'lucide-react';

interface ContactManagerProps {
  contactSubTab: 'departments' | 'faqs';
  contactDepartments: any[];
  setContactDepartments: (val: any[]) => void;
  contactFaqs: any[];
  setContactFaqs: (val: any[]) => void;
  handleSaveContactConfig: () => void;
}

export default function ContactManager({
  contactSubTab,
  contactDepartments,
  setContactDepartments,
  contactFaqs,
  setContactFaqs,
  handleSaveContactConfig
}: ContactManagerProps) {

  // --- Departments State ---
  const [newDept, setNewDept] = useState({ name: '', nameEn: '', email: '', desc: '', descEn: '' });

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name || !newDept.email) return;
    const added = { id: `dept-${Date.now()}`, ...newDept };
    setContactDepartments([...contactDepartments, added]);
    setNewDept({ name: '', nameEn: '', email: '', desc: '', descEn: '' });
  };

  const handleDeleteDept = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce département ?')) {
      setContactDepartments(contactDepartments.filter((d: any) => d.id !== id));
    }
  };

  // --- FAQs State ---
  const [newFaq, setNewFaq] = useState({ q: '', qEn: '', a: '', aEn: '' });

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.q || !newFaq.a) return;
    const added = { id: `faq-${Date.now()}`, ...newFaq };
    setContactFaqs([...contactFaqs, added]);
    setNewFaq({ q: '', qEn: '', a: '', aEn: '' });
  };

  const handleDeleteFaq = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette FAQ ?')) {
      setContactFaqs(contactFaqs.filter((f: any) => f.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">
            {contactSubTab === 'departments' ? 'Départements de Contact' : 'Foire Aux Questions (FAQ)'}
          </h2>
          <p className="text-xs text-slate-500">
            {contactSubTab === 'departments' 
              ? 'Gérez les services affichés dans le formulaire de contact public.'
              : 'Gérez les questions fréquentes affichées sur la page contact.'}
          </p>
        </div>
        <button
          onClick={handleSaveContactConfig}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer la configuration</span>
        </button>
      </div>

      {contactSubTab === 'departments' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4" /> Ajouter un Département
            </h3>
            <form onSubmit={handleAddDept} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom (FR)</label>
                  <input
                    type="text" required
                    value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="ex: Secrétariat Général"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom (EN)</label>
                  <input
                    type="text"
                    value={newDept.nameEn} onChange={e => setNewDept({...newDept, nameEn: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email de destination</label>
                <input
                  type="email" required
                  value={newDept.email} onChange={e => setNewDept({...newDept, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  placeholder="secretariat@asso.fr"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description (FR)</label>
                  <input
                    type="text" required
                    value={newDept.desc} onChange={e => setNewDept({...newDept, desc: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Adhésions, cotisations..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description (EN)</label>
                  <input
                    type="text"
                    value={newDept.descEn} onChange={e => setNewDept({...newDept, descEn: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700">
                Ajouter ce département
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {contactDepartments.map((dept: any) => (
              <div key={dept.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between group shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{dept.name}</h4>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{dept.email}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{dept.desc}</p>
                </div>
                <button
                  onClick={() => handleDeleteDept(dept.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {contactSubTab === 'faqs' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4" /> Ajouter une FAQ
            </h3>
            <form onSubmit={handleAddFaq} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Question (FR)</label>
                  <input
                    type="text" required
                    value={newFaq.q} onChange={e => setNewFaq({...newFaq, q: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Question (EN)</label>
                  <input
                    type="text"
                    value={newFaq.qEn} onChange={e => setNewFaq({...newFaq, qEn: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Réponse (FR)</label>
                  <textarea
                    required rows={3}
                    value={newFaq.a} onChange={e => setNewFaq({...newFaq, a: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Réponse (EN)</label>
                  <textarea
                    rows={3}
                    value={newFaq.aEn} onChange={e => setNewFaq({...newFaq, aEn: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700">
                Ajouter cette question
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {contactFaqs.map((faq: any) => (
              <div key={faq.id} className="p-4 bg-white border border-slate-200 rounded-xl group shadow-sm flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{faq.q}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
