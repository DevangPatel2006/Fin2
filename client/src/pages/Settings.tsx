import { motion } from 'framer-motion';
import { User, Bell, Lock, HelpCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default function Settings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // User profile state
  const [user, setUser] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailUpdates: true,
    aiInsights: true,
    biometric: false
  });

  // Load user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data);
        setProfileForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();

    // Load notification preferences from localStorage
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) {
      toast({
        title: 'Error',
        description: 'Name and email are required',
        variant: 'destructive'
      });
      return;
    }

    setProfileLoading(true);
    try {
      const res = await API.put('/settings/profile', profileForm);
      setUser(res.data.user);
      toast({
        title: 'Success!',
        description: 'Profile updated successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        variant: 'destructive'
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive'
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await API.put('/settings/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({
        title: 'Success!',
        description: 'Password changed successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to change password',
        variant: 'destructive'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
    toast({
      title: 'Notification Preferences Updated',
      description: `${key} ${updated[key] ? 'enabled' : 'disabled'}`
    });
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({
        title: 'Error',
        description: 'Password is required to delete account',
        variant: 'destructive'
      });
      return;
    }

    setDeleteLoading(true);
    try {
      await API.delete('/settings/account', {
        data: { password: deletePassword }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('notifications');
      
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted'
      });

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to delete account',
        variant: 'destructive'
      });
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-indigo">Settings</span>
          </h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 hover:neon-border-indigo transition-all duration-500"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <Button type="submit" variant="luxury" disabled={profileLoading}>
              {profileLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications" className="text-base font-medium text-foreground cursor-pointer">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive notifications about transactions and goals</p>
              </div>
              <Switch 
                id="push-notifications" 
                checked={notifications.pushNotifications}
                onCheckedChange={() => handleNotificationToggle('pushNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-updates" className="text-base font-medium text-foreground cursor-pointer">
                  Email Updates
                </Label>
                <p className="text-sm text-muted-foreground">Get weekly financial summaries via email</p>
              </div>
              <Switch 
                id="email-updates" 
                checked={notifications.emailUpdates}
                onCheckedChange={() => handleNotificationToggle('emailUpdates')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-insights" className="text-base font-medium text-foreground cursor-pointer">
                  AI Insights
                </Label>
                <p className="text-sm text-muted-foreground">Enable personalized AI recommendations</p>
              </div>
              <Switch 
                id="ai-insights" 
                checked={notifications.aiInsights}
                onCheckedChange={() => handleNotificationToggle('aiInsights')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="biometric" className="text-base font-medium text-foreground cursor-pointer">
                  Biometric Authentication
                </Label>
                <p className="text-sm text-muted-foreground">Use fingerprint or face ID to login</p>
              </div>
              <Switch 
                id="biometric" 
                checked={notifications.biometric}
                onCheckedChange={() => handleNotificationToggle('biometric')}
              />
            </div>
          </div>
        </motion.div>

        {/* Security - Password Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password (min 6 characters)"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                required
              />
            </div>
            <Button type="submit" variant="luxury" disabled={passwordLoading}>
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </motion.div>

        {/* Help & Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 hover:neon-border-cyan transition-all duration-500 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">Help & Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Get help and contact support</p>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                View Help Center
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 border-destructive/30"
        >
          <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
          <p className="text-muted-foreground mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button 
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/10">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold">Delete Account?</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <div className="space-y-2">
              <Label htmlFor="delete-password">Enter your password to confirm</Label>
              <Input
                id="delete-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}