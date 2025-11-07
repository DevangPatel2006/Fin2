import { motion } from 'framer-motion';
import { User, Bell, Lock, Palette, Globe, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/DashboardLayout';

const settingsSections = [
  {
    icon: User,
    title: 'Profile',
    description: 'Manage your account information',
    action: 'Edit Profile',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Configure your notification preferences',
    action: 'Manage',
  },
  {
    icon: Lock,
    title: 'Security',
    description: 'Password and authentication settings',
    action: 'Update',
  },
  {
    icon: Palette,
    title: 'Appearance',
    description: 'Customize your interface theme',
    action: 'Customize',
  },
  {
    icon: Globe,
    title: 'Language & Region',
    description: 'Set your preferred language and currency',
    action: 'Change',
  },
  {
    icon: HelpCircle,
    title: 'Help & Support',
    description: 'Get help and contact support',
    action: 'View',
  },
];

export default function Settings() {
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
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-2xl font-bold text-white">U</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">User Name</h2>
              <p className="text-muted-foreground">user@example.com</p>
            </div>
            <Button variant="luxury">Edit Profile</Button>
          </div>
        </motion.div>

        {/* Quick Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">Quick Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications" className="text-base font-medium text-foreground cursor-pointer">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive notifications about transactions and goals</p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-updates" className="text-base font-medium text-foreground cursor-pointer">
                  Email Updates
                </Label>
                <p className="text-sm text-muted-foreground">Get weekly financial summaries via email</p>
              </div>
              <Switch id="email-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-insights" className="text-base font-medium text-foreground cursor-pointer">
                  AI Insights
                </Label>
                <p className="text-sm text-muted-foreground">Enable personalized AI recommendations</p>
              </div>
              <Switch id="ai-insights" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="biometric" className="text-base font-medium text-foreground cursor-pointer">
                  Biometric Authentication
                </Label>
                <p className="text-sm text-muted-foreground">Use fingerprint or face ID to login</p>
              </div>
              <Switch id="biometric" />
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass-card p-6 hover:neon-border-cyan transition-all duration-500 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{section.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                      {section.action}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card p-8 border-destructive/30"
        >
          <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
          <p className="text-muted-foreground mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
