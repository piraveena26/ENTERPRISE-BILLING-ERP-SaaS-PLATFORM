import React, { useState } from 'react';
import {
  Shield,
  Check,
  X,
  Lock,
  Sliders,
  Sparkles,
  GitBranch,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { EnterpriseRole, AppModule, PermissionAction } from '../../types/erp';
import { ALL_ROLES, ALL_PERMISSIONS, ALL_MODULES } from '../../data/demoData';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const PermissionMatrix: React.FC = () => {
  const { currentRole, permissionMatrix, updatePermission, approvalWorkflow } = useERP();
  const [selectedRole, setSelectedRole] = useState<EnterpriseRole>('Finance Manager');
  const [activeTab, setActiveTab] = useState<'matrix' | 'workflow'>('matrix');

  // Key modules for the matrix display
  const targetModules: AppModule[] = [
    'Invoices',
    'Quotations',
    'Sales Orders',
    'Payments',
    'Customers',
    'Products',
    'Inventory',
    'Purchases',
    'Accounting',
    'Reports',
    'Settings',
  ];

  // Actions for column headers
  const targetActions: PermissionAction[] = [
    'View',
    'Create',
    'Edit',
    'Approve',
    'Finalize',
    'Delete',
    'Export',
    'Print',
    'Refund',
    'Post',
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Enterprise RBAC & Security Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Granular permission matrix across 13 enterprise roles and multi-tier approval workflows
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors ${
            activeTab === 'matrix'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Role Permission Matrix (13x13 Grid)
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors ${
            activeTab === 'workflow'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Approval Workflows Pipeline
        </button>
      </div>

      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Role Selector Pills */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Select Role to Configure:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ALL_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedRole === role
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300 uppercase text-[10px]">
                  <th className="p-3.5 min-w-[160px]">Application Module</th>
                  {targetActions.map((act) => (
                    <th key={act} className="p-3.5 text-center min-w-[70px]">
                      {act}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {targetModules.map((mod) => (
                  <tr key={mod} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{mod}</span>
                    </td>
                    {targetActions.map((act) => {
                      const isAllowed = !!permissionMatrix[selectedRole]?.[mod]?.[act];
                      const isSuper = selectedRole === 'Super Admin' || selectedRole === 'Tenant Owner';

                      return (
                        <td key={act} className="p-3.5 text-center">
                          <button
                            disabled={isSuper}
                            onClick={() => updatePermission(selectedRole, mod, act, !isAllowed)}
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                              isAllowed
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                            } ${isSuper ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-105'}`}
                          >
                            {isAllowed ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
            <span>Role changes take effect instantly across active user sessions.</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">SOC2 Type II Access Audit Logged</span>
          </div>
        </div>
      )}

      {/* Tab: Approval Workflows */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 text-xs">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">
              Node-Based Enterprise Approval Pipeline
            </h4>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Purchase orders, credit notes, and invoices exceeding designated statutory thresholds require sequential authorized cryptographic signatures.
            </p>
          </div>

          <div className="space-y-4">
            {approvalWorkflow.map((node, idx) => (
              <div
                key={node.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {node.stepName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{node.conditionDescription}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="purple" size="sm">Required Role: {node.requiredRole}</Badge>
                      {node.thresholdAmount && (
                        <Badge variant="warning" size="sm">
                          Threshold: &gt; {node.currency} {node.thresholdAmount.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Badge variant="success" dot size="sm">Active Guardrail</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
