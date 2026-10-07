import React from 'react';
import { Plus, UserCheck, Briefcase, ShieldCheck } from 'lucide-react';
import { DisputeOfficersManager } from './DisputeOfficersManager';
import { DisputeCasesManager } from './DisputeCasesManager';
import { DisputeStagesManager } from './DisputeStagesManager';

interface DisputesManagerProps {
  disputeOfficers: any[];
  disputeCases: any[];
  stagesList: any[];
  disputeSubTab: 'officers' | 'cases' | 'stages';
  setDisputeSubTab: (val: 'officers' | 'cases' | 'stages') => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  
  // Officers props
  officerSearchQuery: string;
  setOfficerSearchQuery: (val: string) => void;
  officerRoleFilter: string;
  setOfficerRoleFilter: (val: string) => void;
  officerAvailabilityFilter: string;
  setOfficerAvailabilityFilter: (val: string) => void;
  officerSortBy: string;
  setOfficerSortBy: (val: string) => void;
  successMessage: string | null;
  setSuccessMessage: (val: string | null) => void;
  disputeOfficerForm: any;
  setDisputeOfficerForm: (val: any) => void;
  handleSaveDisputeOfficer: (e: React.FormEvent) => void;
  handleDeleteDisputeOfficer: (id: string, name: string) => void;
  officerAvatarInputRef: React.RefObject<HTMLInputElement>;
  handleOfficerAvatarFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // Cases props
  caseSearchQuery: string;
  setCaseSearchQuery: (val: string) => void;
  caseCategoryFilter: string;
  setCaseCategoryFilter: (val: string) => void;
  caseStageFilter: string;
  setCaseStageFilter: (val: string) => void;
  caseStatusFilter: string;
  setCaseStatusFilter: (val: string) => void;
  caseSortBy: string;
  setCaseSortBy: (val: string) => void;
  disputeCaseForm: any;
  setDisputeCaseForm: (val: any) => void;
  handleSaveDisputeCase: (e: React.FormEvent) => void;
  handleDeleteDisputeCase: (id: string, name: string) => void;
  
  // Stages props
  disputeStageForm: any;
  setDisputeStageForm: (val: any) => void;
  handleAddOrUpdateStage: (e: React.FormEvent) => void;
  handleDeleteStage: (id: string) => void;
}

export const DisputesManager: React.FC<DisputesManagerProps> = ({
  disputeOfficers,
  disputeCases,
  stagesList,
  disputeSubTab,
  setDisputeSubTab,
  isEditing,
  setIsEditing,
  // Officers
  officerSearchQuery, setOfficerSearchQuery,
  officerRoleFilter, setOfficerRoleFilter,
  officerAvailabilityFilter, setOfficerAvailabilityFilter,
  officerSortBy, setOfficerSortBy,
  successMessage, setSuccessMessage,
  disputeOfficerForm, setDisputeOfficerForm,
  handleSaveDisputeOfficer, handleDeleteDisputeOfficer,
  officerAvatarInputRef, handleOfficerAvatarFileUpload,
  // Cases
  caseSearchQuery, setCaseSearchQuery,
  caseCategoryFilter, setCaseCategoryFilter,
  caseStageFilter, setCaseStageFilter,
  caseStatusFilter, setCaseStatusFilter,
  caseSortBy, setCaseSortBy,
  disputeCaseForm, setDisputeCaseForm,
  handleSaveDisputeCase, handleDeleteDisputeCase,
  // Stages
  disputeStageForm, setDisputeStageForm,
  handleAddOrUpdateStage, handleDeleteStage
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Litiges & Procédures (Section 4)</h2>
          <p className="text-xs text-slate-500">Gérez les intervenants, les dossiers de litiges et le circuit de résolution.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (disputeSubTab === 'officers') {
                setDisputeOfficerForm({
                  id: '',
                  name: '',
                  title: 'Médiateur Certifié',
                  role: 'Médiateur',
                  stage: 'mediation',
                  category: 'interne',
                  specialties: '',
                  experience_years: 10,
                  cases_handled: 5,
                  avatar_url: '',
                  email: '',
                  availability: 'Disponible'
                });
              } else if (disputeSubTab === 'cases') {
                setDisputeCaseForm({
                  id: '',
                  case_number: '',
                  title: '',
                  category: 'interne',
                  stage: 'conciliation',
                  is_public: true,
                  status: 'En cours',
                  date_submitted: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                  summary: '',
                  parties: '',
                  assigned_officer: '',
                  confidentiality_note: '',
                  resolution_timeframe: '30 jours'
                });
              } else {
                setDisputeStageForm({
                  id: '',
                  key: '',
                  stepNumber: `Étape ${stagesList.length + 1}`,
                  title: '',
                  subtitle: '',
                  description: '',
                  legalBasis: '',
                  confidentiality: '',
                  officersTitle: ''
                });
              }
              setIsEditing(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{disputeSubTab === 'officers' ? 'Nouvel Intervenant' : disputeSubTab === 'cases' ? 'Nouveau Dossier' : 'Nouvelle Étape'}</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs header */}
      <div className="flex items-center gap-2 mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        <button
          onClick={() => { setDisputeSubTab('officers'); setIsEditing(false); }}
          className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            disputeSubTab === 'officers'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Intervenants & Officiels Neutres</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${disputeSubTab === 'officers' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{disputeOfficers.length}</span>
        </button>

        <button
          onClick={() => { setDisputeSubTab('cases'); setIsEditing(false); }}
          className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            disputeSubTab === 'cases'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Dossiers & Affaires Litigieuses</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${disputeSubTab === 'cases' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{disputeCases.length}</span>
        </button>

        <button
          onClick={() => { setDisputeSubTab('stages'); setIsEditing(false); }}
          className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            disputeSubTab === 'stages'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Étapes des Litiges Internes</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${disputeSubTab === 'stages' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{stagesList.length}</span>
        </button>
      </div>

      {/* SUB-TAB 1: OFFICERS */}
      {disputeSubTab === 'officers' && (
        <DisputeOfficersManager
          disputeOfficers={disputeOfficers}
          stagesList={stagesList}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          officerSearchQuery={officerSearchQuery}
          setOfficerSearchQuery={setOfficerSearchQuery}
          officerRoleFilter={officerRoleFilter}
          setOfficerRoleFilter={setOfficerRoleFilter}
          officerAvailabilityFilter={officerAvailabilityFilter}
          setOfficerAvailabilityFilter={setOfficerAvailabilityFilter}
          officerSortBy={officerSortBy}
          setOfficerSortBy={setOfficerSortBy}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
          disputeOfficerForm={disputeOfficerForm}
          setDisputeOfficerForm={setDisputeOfficerForm}
          handleSaveDisputeOfficer={handleSaveDisputeOfficer}
          handleDeleteDisputeOfficer={handleDeleteDisputeOfficer}
          officerAvatarInputRef={officerAvatarInputRef}
          handleOfficerAvatarFileUpload={handleOfficerAvatarFileUpload}
        />
      )}

      {/* SUB-TAB 2: CASES */}
      {disputeSubTab === 'cases' && (
        <DisputeCasesManager
          disputeCases={disputeCases}
          stagesList={stagesList}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          caseSearchQuery={caseSearchQuery}
          setCaseSearchQuery={setCaseSearchQuery}
          caseCategoryFilter={caseCategoryFilter}
          setCaseCategoryFilter={setCaseCategoryFilter}
          caseStageFilter={caseStageFilter}
          setCaseStageFilter={setCaseStageFilter}
          caseStatusFilter={caseStatusFilter}
          setCaseStatusFilter={setCaseStatusFilter}
          caseSortBy={caseSortBy}
          setCaseSortBy={setCaseSortBy}
          disputeCaseForm={disputeCaseForm}
          setDisputeCaseForm={setDisputeCaseForm}
          handleSaveDisputeCase={handleSaveDisputeCase}
          handleDeleteDisputeCase={handleDeleteDisputeCase}
        />
      )}

      {/* SUB-TAB 3: STAGES */}
      {disputeSubTab === 'stages' && (
        <DisputeStagesManager
          stagesList={stagesList}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          disputeStageForm={disputeStageForm}
          setDisputeStageForm={setDisputeStageForm}
          handleAddOrUpdateStage={handleAddOrUpdateStage}
          handleDeleteStage={handleDeleteStage}
        />
      )}
    </div>
  );
};
