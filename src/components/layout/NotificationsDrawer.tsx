import React, { useState } from 'react';
import { X, CheckCheck, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AppModule } from '../../types/erp';

export interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateModule: (module: AppModule) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateModule,
}) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useERP();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const filteredNotifs = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Notifications</h3>
                <p className="text-xs text-slate-500">{unreadCount} unread system alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={clearAllNotifications}
                  title="Mark all as read"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex gap-2 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                filter === 'unread'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredNotifs.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">All caught up!</p>
                <p className="text-xs text-slate-400 mt-0.5">No notifications pending your attention</p>
              </div>
            ) : (
              filteredNotifs.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    markNotificationAsRead(item.id);
                    if (item.linkModule) {
                      onNavigateModule(item.linkModule);
                      onClose();
                    }
                  }}
                  className={`p-4 transition-colors cursor-pointer flex gap-3 items-start ${
                    item.read
                      ? 'bg-transparent opacity-75 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      : 'bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/70'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getSeverityIcon(item.severity)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4
                        className={`text-xs font-bold truncate ${
                          item.read ? 'text-slate-700 dark:text-slate-300' : 'text-indigo-950 dark:text-white'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                      {item.message}
                    </p>
                    {item.linkModule && (
                      <span className="inline-block mt-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                        View in {item.linkModule} &rarr;
                      </span>
                    )}
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
