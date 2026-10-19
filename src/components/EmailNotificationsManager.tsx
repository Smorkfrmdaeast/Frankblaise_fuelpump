import React, { useState, useEffect } from 'react';
import {
  EmailNotificationLog,
  NotificationPreferences,
  getNotificationPreferences,
  saveNotificationPreferences,
  getNotificationLogs,
  sendTestNotificationEmail,
  sendDailyDigestNotification,
} from '../services/emailNotification';
import { OrderRecord } from '../types/product';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Bell,
  Sliders,
  Check,
  Calendar,
  X,
  ShieldCheck,
} from 'lucide-react';

interface EmailNotificationsManagerProps {
  orders: OrderRecord[];
}

export const EmailNotificationsManager: React.FC<EmailNotificationsManagerProps> = ({ orders }) => {
  const [prefs, setPrefs] = useState<NotificationPreferences>(getNotificationPreferences());
  const [logs, setLogs] = useState<EmailNotificationLog[]>([]);
  const [emailInput, setEmailInput] = useState(prefs.alertEmail);
  const [newOrderAlerts, setNewOrderAlerts] = useState(prefs.newOrderEmailEnabled);
  const [customerConfirmation, setCustomerConfirmation] = useState(prefs.customerConfirmationEnabled);
  const [dailyDigest, setDailyDigest] = useState(prefs.dailyDigestEnabled);

  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [isSendingDigest, setIsSendingDigest] = useState(false);
  const [selectedLogForPreview, setSelectedLogForPreview] = useState<EmailNotificationLog | null>(null);

  // Load logs
  const refreshLogs = () => {
    setLogs(getNotificationLogs());
  };

  useEffect(() => {
    refreshLogs();
    const handleLogsUpdated = () => refreshLogs();
    window.addEventListener('frankblaise_notification_logs_updated', handleLogsUpdated);
    return () => window.removeEventListener('frankblaise_notification_logs_updated', handleLogsUpdated);
  }, []);

  // Save Settings
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setTestResultMsg({ text: 'Please enter a valid notification email address.', success: false });
      return;
    }

    setIsSavingPrefs(true);
    const updated: NotificationPreferences = {
      alertEmail: cleanEmail,
      newOrderEmailEnabled: newOrderAlerts,
      customerConfirmationEnabled: customerConfirmation,
      dailyDigestEnabled: dailyDigest,
      lastDailyDigestSent: prefs.lastDailyDigestSent,
    };

    saveNotificationPreferences(updated);
    setPrefs(updated);
    setIsSavingPrefs(false);
    setSaveSuccessMsg('Notification preferences saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Trigger Live Test Email
  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    setTestResultMsg(null);
    try {
      const log = await sendTestNotificationEmail(emailInput);
      setTestResultMsg({
        text: `Test email alert dispatched to ${log.recipient}! Check the preview below or your inbox.`,
        success: true,
      });
      refreshLogs();
    } catch (err) {
      setTestResultMsg({
        text: 'Failed to send test alert. Please check your email configuration.',
        success: false,
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  // Trigger Daily Digest
  const handleSendDigestNow = async () => {
    setIsSendingDigest(true);
    try {
      const log = await sendDailyDigestNotification(orders, emailInput);
      setTestResultMsg({
        text: `7-Day sales digest dispatched to ${log.recipient}!`,
        success: true,
      });
      refreshLogs();
    } catch (err) {
      setTestResultMsg({
        text: 'Failed to dispatch daily digest email.',
        success: false,
      });
    } finally {
      setIsSendingDigest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Intro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display uppercase text-[#1B1C1F]">
            Email Notifications &amp; Alerts
          </h2>
          <p className="text-xs text-[#6E7075] font-mono">
            Configure real-time email dispatch for incoming customer orders, fitment checks, and daily volume digests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshLogs}
            className="min-tap-target px-3 py-2 bg-white border border-[#D5D2CB] rounded-lg text-xs font-mono text-[#2B2D31] hover:bg-[#E9E7E2] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      {testResultMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-mono flex items-center justify-between gap-2 border ${
            testResultMsg.success
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-[#B51222]'
          }`}
        >
          <div className="flex items-center gap-2">
            {testResultMsg.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#B51222] shrink-0" />
            )}
            <span>{testResultMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setTestResultMsg(null)}
            className="text-xs hover:opacity-75 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid: Preferences Form & Quick Test Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-7 bg-white border border-[#D5D2CB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-[#E9E7E2] pb-4">
            <Sliders className="w-4 h-4 text-[#B51222]" />
            <h3 className="text-base font-bold font-display uppercase tracking-tight text-[#1B1C1F]">
              Email Dispatch Preferences
            </h3>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1.5">
                Primary Notification Recipient Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="smokeginobli092@gmail.com"
                className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-xs text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
              />
              <span className="text-[11px] font-mono text-[#6E7075] mt-1 block">
                Order alerts, vehicle compatibility data, and customer delivery summaries are dispatched to this address.
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3 bg-[#F6F4EF] border border-[#E9E7E2] rounded-xl cursor-pointer hover:bg-[#EFECE6] transition-colors">
                <input
                  type="checkbox"
                  checked={newOrderAlerts}
                  onChange={(e) => setNewOrderAlerts(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#B51222] cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#1B1C1F] block font-mono">
                    Instant New Order Alert
                  </span>
                  <span className="text-[#6E7075] text-[11px] block mt-0.5">
                    Dispatches an immediate notification as soon as a customer completes the checkout form.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-[#F6F4EF] border border-[#E9E7E2] rounded-xl cursor-pointer hover:bg-[#EFECE6] transition-colors">
                <input
                  type="checkbox"
                  checked={customerConfirmation}
                  onChange={(e) => setCustomerConfirmation(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#B51222] cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#1B1C1F] block font-mono">
                    Audit Dispatch Trail
                  </span>
                  <span className="text-[#6E7075] text-[11px] block mt-0.5">
                    Maintains verified audit records in Firestore with telephone click-to-dial links and WhatsApp actions.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-[#F6F4EF] border border-[#E9E7E2] rounded-xl cursor-pointer hover:bg-[#EFECE6] transition-colors">
                <input
                  type="checkbox"
                  checked={dailyDigest}
                  onChange={(e) => setDailyDigest(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#B51222] cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#1B1C1F] block font-mono">
                    7-Day Order Volume Digest
                  </span>
                  <span className="text-[#6E7075] text-[11px] block mt-0.5">
                    Generates recurring sales volume snapshots aligned with your Recharts 7-day bar chart.
                  </span>
                </div>
              </label>
            </div>

            {saveSuccessMsg && (
              <p className="text-xs text-emerald-700 font-mono flex items-center gap-1.5">
                <Check className="w-4 h-4" /> {saveSuccessMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSavingPrefs}
              className="min-tap-target px-5 py-2.5 bg-[#1B1C1F] hover:bg-[#2B2D31] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSavingPrefs ? 'Saving...' : 'Save Notification Preferences'}
            </button>
          </form>
        </div>

        {/* Right: Instant Trigger & Diagnostics */}
        <div className="lg:col-span-5 bg-white border border-[#D5D2CB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#E9E7E2] pb-4">
              <Bell className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-bold font-display uppercase tracking-tight text-[#1B1C1F]">
                Trigger Live Test &amp; Digest
              </h3>
            </div>

            <p className="text-xs font-mono text-[#6E7075]">
              Verify that notifications are active and inspect the exact layout your client will receive.
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3.5 bg-[#F6F4EF] rounded-xl border border-[#E9E7E2] space-y-2">
                <div className="text-xs font-bold text-[#1B1C1F] font-mono flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#B51222]" />
                  <span>Send Sample Order Notification</span>
                </div>
                <p className="text-[11px] text-[#6E7075] font-mono">
                  Generates an immediate test alert with vehicle specs and contact buttons to <strong className="text-[#1B1C1F]">{emailInput}</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest}
                  className="min-tap-target w-full py-2 bg-[#B51222] hover:bg-[#8F0E1B] text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingTest ? 'Dispatched...' : 'Dispatch Test Alert'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-[#F6F4EF] rounded-xl border border-[#E9E7E2] space-y-2">
                <div className="text-xs font-bold text-[#1B1C1F] font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-700" />
                  <span>Generate 7-Day Digest Email</span>
                </div>
                <p className="text-[11px] text-[#6E7075] font-mono">
                  Packages current order count ({orders.length} orders) and volume data into a digestible summary.
                </p>
                <button
                  type="button"
                  onClick={handleSendDigestNow}
                  disabled={isSendingDigest}
                  className="min-tap-target w-full py-2 bg-white border border-[#D5D2CB] hover:bg-[#E9E7E2] text-[#1B1C1F] rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isSendingDigest ? 'Generating...' : 'Dispatch 7-Day Digest'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-mono text-emerald-900 flex items-center gap-2 mt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Dual-channel redundancy: WhatsApp alerts and Email notifications operate simultaneously.</span>
          </div>
        </div>
      </div>

      {/* Dispatched Notifications Log Table */}
      <div className="bg-white border border-[#D5D2CB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E9E7E2] pb-4">
          <div>
            <h3 className="text-base font-bold font-display uppercase tracking-tight text-[#1B1C1F]">
              Dispatched Notification History ({logs.length})
            </h3>
            <p className="text-xs font-mono text-[#6E7075]">
              Real-time audit log of all outbound emails dispatched by the storefront and seller terminal.
            </p>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Mail className="w-8 h-8 text-[#6E7075] mx-auto opacity-50" />
            <p className="text-xs font-mono text-[#6E7075]">
              No email notifications recorded yet. Click &quot;Dispatch Test Alert&quot; above to verify the pipeline.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#E9E7E2] text-[#6E7075] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E7E2]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F6F4EF] transition-colors">
                    <td className="py-3 px-3 text-[#6E7075] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        log.type === 'new_order_alert'
                          ? 'bg-red-100 text-[#B51222]'
                          : log.type === 'daily_digest'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#1B1C1F] font-semibold whitespace-nowrap">
                      {log.recipient}
                    </td>
                    <td className="py-3 px-3 text-[#2B2D31] max-w-xs truncate" title={log.subject}>
                      {log.subject}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Delivered</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedLogForPreview(log)}
                        className="px-2.5 py-1 bg-[#F6F4EF] hover:bg-[#E9E7E2] border border-[#D5D2CB] text-[#1B1C1F] rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-[#B51222]" />
                        <span>Preview HTML</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Email Preview Modal */}
      {selectedLogForPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D5D2CB] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#E9E7E2] flex items-center justify-between bg-[#1B1C1F] text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A3A8] block">
                  Outbound Email Notification Preview
                </span>
                <h4 className="text-sm sm:text-base font-bold font-display uppercase truncate max-w-md">
                  {selectedLogForPreview.subject}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLogForPreview(null)}
                className="p-1.5 rounded-lg bg-[#2E3036] hover:bg-[#3E4048] text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#F6F4EF] border-b border-[#E9E7E2] text-xs font-mono space-y-1">
              <div>
                <strong className="text-[#6E7075]">To:</strong> <span className="text-[#1B1C1F] font-bold">{selectedLogForPreview.recipient}</span>
              </div>
              <div>
                <strong className="text-[#6E7075]">Date:</strong> {new Date(selectedLogForPreview.createdAt).toLocaleString()}
              </div>
              {selectedLogForPreview.orderReference && (
                <div>
                  <strong className="text-[#6E7075]">Order Ref:</strong> {selectedLogForPreview.orderReference}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#E9E7E2]/40">
              <iframe
                title="Email Content"
                srcDoc={selectedLogForPreview.htmlBody}
                className="w-full h-[450px] border border-[#D5D2CB] rounded-xl bg-white shadow-xs"
              />
            </div>

            <div className="p-4 border-t border-[#E9E7E2] bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLogForPreview(null)}
                className="px-4 py-2 bg-[#1B1C1F] hover:bg-[#2B2D31] text-white text-xs font-mono uppercase font-bold rounded-lg transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
