import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  Shield,
  Laptop,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AuditLog } from '../../types/erp';
import { Table, Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useERP();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const columns: Column<AuditLog>[] = [
    {
      header: 'Timestamp',
      render: (log) => (
        <span className="font-mono text-xs text-slate-500">{log.timestamp}</span>
      ),
    },
    {
      header: 'User & Role',
      render: (log) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{log.user}</span>
          <Badge variant="purple" size="sm">{log.role}</Badge>
        </div>
      ),
    },
    {
      header: 'Action Executed',
      render: (log) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">{log.action}</span>
          <span className="text-[10px] text-slate-400 font-mono">Record: {log.recordId}</span>
        </div>
      ),
    },
    {
      header: 'Module',
      render: (log) => <Badge variant="outline" size="sm">{log.module}</Badge>,
    },
    {
      header: 'Origin IP',
      render: (log) => (
        <span className="font-mono text-[11px] text-slate-500">{log.ipAddress}</span>
      ),
    },
    {
      header: 'Result',
      render: (log) => (
        <Badge variant={log.status === 'Success' ? 'success' : 'warning'} dot size="sm">
          {log.status}
        </Badge>
      ),
    },
    {
      header: 'Inspect',
      align: 'center',
      render: (log) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedLog(log)}>
          Diff
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Enterprise Security & Audit Trail
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Immutable forensic log of state changes, invoice finalizations, credit alterations, and security events
        </p>
      </div>

      <Table
        columns={columns}
        data={auditLogs}
        keyExtractor={(l) => l.id}
        searchPlaceholder="Search audit log by user, action, module, record..."
        onRowClick={(l) => setSelectedLog(l)}
      />

      {/* Inspect Log Diff Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title="Audit Record Forensic Inspection"
          subtitle={`Event ID: ${selectedLog.id} • ${selectedLog.timestamp}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <p><strong>Actor:</strong> {selectedLog.user} ({selectedLog.role})</p>
              <p><strong>Module & Record:</strong> {selectedLog.module} &rarr; {selectedLog.recordId}</p>
              <p><strong>Client Station:</strong> {selectedLog.ipAddress}</p>
              {selectedLog.reason && (
                <p><strong>Justification:</strong> &ldquo;{selectedLog.reason}&rdquo;</p>
              )}
            </div>

            {/* Before / After State comparison */}
            {(selectedLog.beforeState || selectedLog.afterState) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-rose-50/30 dark:bg-rose-950/20">
                  <span className="font-bold text-[10px] uppercase text-rose-600 block mb-1">State Before:</span>
                  <p className="text-slate-700 dark:text-slate-300 font-mono text-xs">{selectedLog.beforeState || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-950/20">
                  <span className="font-bold text-[10px] uppercase text-emerald-600 block mb-1">State After:</span>
                  <p className="text-slate-700 dark:text-slate-300 font-mono text-xs">{selectedLog.afterState || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
