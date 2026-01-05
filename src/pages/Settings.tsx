import { useUser, SignOutButton } from '@insforge/react';
import { useSettings } from '../hooks/useSettings';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { LogOut, User as UserIcon, Moon, Sun, Mail } from 'lucide-react';

export function Settings() {
  const { user } = useUser();
  const { settings, updateSettings } = useSettings(user?.id);
  const { isDark, toggleDarkMode } = useDarkMode();

  const handleUnitChange = async (value: string) => {
    try {
      await updateSettings({ weight_unit: value as 'kg' | 'lbs' });
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm lg:text-base">Manage your preferences</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 pb-20 md:pb-8">
        {/* User info */}
        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg text-gray-900 dark:text-white">{user?.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Free account</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Appearance */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Appearance</h2>
          <Card>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`p-3 rounded-lg transition-colors ${isDark
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Preferences</h2>
          <Card>
            <CardBody className="space-y-4">
              <Select
                label="Weight Unit"
                options={[
                  { value: 'kg', label: 'Kilograms (kg)' },
                  { value: 'lbs', label: 'Pounds (lbs)' },
                ]}
                value={settings?.weight_unit || 'kg'}
                onChange={(e) => handleUnitChange(e.target.value)}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This will be used as the default unit when logging exercises.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Sign out */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Account</h2>
          <Card>
            <CardBody>
              <SignOutButton>
                <Button variant="danger" className="w-full" size="lg">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </SignOutButton>
            </CardBody>
          </Card>
        </div>

        {/* Contact & Support */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact & Support</h2>
          <Card>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">Email Support</p>
                    <a
                      href="mailto:fitness_book@yahoo.com"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      fitness_book@yahoo.com
                    </a>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* App info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
          <p>FitnessBook v1.0</p>
          <p className="mt-1">Built with InsForge</p>
        </div>
      </main>
    </div>
  );
}
