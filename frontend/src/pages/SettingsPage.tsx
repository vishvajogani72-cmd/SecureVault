
import { useState } from 'react';
import {
  User, Mail, Calendar, Lock, LogOut, ShieldCheck,
  KeyRound, BellRing, Palette, ChevronRight, Eye, EyeOff,
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

export function SettingsPage() {
  const {
    user,
    token,
    lock,
    logout,
    autoLockEnabled,
    setAutoLockEnabled,
    clipboardClearEnabled,
    setClipboardClearEnabled,
  } = useAuth();

  const { notify } = useToast();

  const [lockConfirm, setLockConfirm] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [locking, setLocking] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const doLock = async () => {
    setLocking(true);
    await lock();
    setLockConfirm(false);
    setLocking(false);
    notify('Vault locked successfully', 'success');
  };

  const doLogout = () => {
    logout();
    setLogoutConfirm(false);
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      notify('Please fill in all password fields.', 'error');
      return;
    }

    if (newPassword.length < 12) {
      notify('New master password must contain at least 12 characters.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      notify('New passwords do not match.', 'error');
      return;
    }

    if (oldPassword === newPassword) {
      notify('New password must be different from the current password.', 'error');
      return;
    }

    if (!token) {
      notify('Your session has expired. Please log in again.', 'error');
      return;
    }

    setChangingPassword(true);

    try {
      await api.changeMasterPassword(token, oldPassword, newPassword);

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      notify('Master password changed successfully!', 'success');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to change master password.';

      notify(message, 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your account and vault preferences.
        </p>
      </div>

      {/* Account */}
      <Card className="p-6">
        <SectionTitle icon={User} title="Account" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent-500/40 to-accent-700/20 text-2xl font-bold text-accent-200">
            {user?.username?.[0]?.toUpperCase() ?? 'U'}
          </div>

          <div className="flex-1 space-y-2.5">
            <Row icon={User} label="Username" value={user?.username ?? '—'} />
            <Row icon={Mail} label="Email" value={user?.email ?? 'Not set'} />
            <Row
              icon={Calendar}
              label="Member since"
              value={
                user
                  ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '—'
              }
            />
            <Row
              icon={ShieldCheck}
              label="Last login"
              value={
                user?.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleString()
                  : '—'
              }
            />
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <SectionTitle icon={ShieldCheck} title="Security" />

        <div className="space-y-3">
          <SettingToggle
            icon={Lock}
            label="Auto-lock vault after inactivity"
            description="Locks the vault after 10 minutes of inactivity"
            checked={autoLockEnabled}
            onChange={setAutoLockEnabled}
          />

          <div className="h-px bg-white/[0.06]" />

          <SettingToggle
            icon={KeyRound}
            label="Clear clipboard automatically"
            description="Clears copied passwords after 30 seconds when browser permissions allow"
            checked={clipboardClearEnabled}
            onChange={setClipboardClearEnabled}
          />

          <div className="h-px bg-white/[0.06]" />

          <div className="flex items-center gap-3 py-1">
            <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg border border-white/10 bg-base-800/60">
              <BellRing size={16} className="text-slate-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                Security notifications
              </p>
              <p className="text-xs text-slate-500">
                New-device sign-in alerts are not available yet.
              </p>
            </div>
            <span className="rounded-md bg-base-800 px-2 py-1 text-xs text-slate-500">
              Coming soon
            </span>
          </div>
        </div>
      </Card>

      {/* Change Master Password */}
      <Card className="p-6">
        <SectionTitle icon={KeyRound} title="Change Master Password" />

        <p className="mb-5 text-sm text-slate-400">
          Update the password used to unlock your SecureVault. Your saved
          credentials should remain encrypted with the same vault key.
        </p>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordField
            label="Current master password"
            value={oldPassword}
            onChange={setOldPassword}
            visible={showPasswords}
          />

          <PasswordField
            label="New master password"
            value={newPassword}
            onChange={setNewPassword}
            visible={showPasswords}
          />

          <PasswordField
            label="Confirm new master password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            visible={showPasswords}
          />

          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-accent-300"
          >
            {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
            {showPasswords ? 'Hide passwords' : 'Show passwords'}
          </button>

          <p className="text-xs text-slate-500">
            Use at least 12 characters. Remember your new password because
            you'll need it the next time you unlock your vault.
          </p>

          <Button type="submit" disabled={changingPassword} fullWidth>
            <KeyRound size={16} />
            {changingPassword ? 'Changing password...' : 'Update master password'}
          </Button>
        </form>
      </Card>

      {/* Appearance */}
      <Card className="p-6">
        <SectionTitle icon={Palette} title="Appearance" />

        <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-base-900/40 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white">Theme</p>
            <p className="text-xs text-slate-500">Cyber Night (default)</p>
          </div>
          <ChevronRight size={16} className="text-slate-600" />
        </div>
      </Card>

      {/* Vault actions */}
      <Card className="border-danger-500/20 p-6">
        <SectionTitle icon={LogOut} title="Vault actions" danger />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setLockConfirm(true)}
          >
            <Lock size={16} /> Lock vault
          </Button>

          <Button
            variant="danger"
            fullWidth
            onClick={() => setLogoutConfirm(true)}
          >
            <LogOut size={16} /> Sign out
          </Button>
        </div>
      </Card>

      {/* Lock confirmation */}
      <Modal
        open={lockConfirm}
        onClose={() => setLockConfirm(false)}
        title="Lock vault?"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setLockConfirm(false)}
              disabled={locking}
            >
              Cancel
            </Button>
            <Button onClick={doLock} disabled={locking}>
              <Lock size={15} />
              {locking ? 'Locking...' : 'Lock now'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-400">
          You'll need to re-enter your master password to access your
          credentials again.
        </p>
      </Modal>

      {/* Logout confirmation */}
      <Modal
        open={logoutConfirm}
        onClose={() => setLogoutConfirm(false)}
        title="Sign out?"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={doLogout}>
              <LogOut size={15} /> Sign out
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-400">
          You'll be signed out and returned to the login screen.
        </p>
      </Modal>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="new-password"
        className="w-full rounded-xl border border-white/10 bg-base-900 px-4 py-3 text-sm text-white outline-none transition focus:border-accent-400"
        placeholder={`Enter ${label.toLowerCase()}`}
        required
      />
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  danger = false,
}: {
  icon: typeof User;
  title: string;
  danger?: boolean;
}) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <div
        className={`grid h-8 w-8 place-items-center rounded-lg border ${
          danger
            ? 'border-danger-500/30 bg-danger-500/10'
            : 'border-white/10 bg-base-800/60'
        }`}
      >
        <Icon
          size={16}
          className={danger ? 'text-danger-400' : 'text-accent-300'}
        />
      </div>
      <h2
        className={`text-sm font-semibold uppercase tracking-wider ${
          danger ? 'text-danger-400' : 'text-slate-300'
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} className="flex-shrink-0 text-slate-500" />
      <span className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <span className="ml-auto truncate text-sm font-medium text-white">
        {value}
      </span>
    </div>
  );
}

function SettingToggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: typeof Lock;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg border border-white/10 bg-base-800/60">
        <Icon size={16} className="text-slate-400" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>

      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
