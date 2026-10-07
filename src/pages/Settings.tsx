import { useState } from 'react';
import { Moon, Sun, Volume2, Bell, Trash2, Languages, Info, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getTokens } from '../styles/designTokens';
import { APP_VERSION } from '../version';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import Switch from '../components/ui/Switch';
import Slider from '../components/ui/Slider';
import Tabs from '../components/ui/Tabs';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import SectionHeader from '../components/ui/SectionHeader';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const tokens = getTokens(isDark);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [language, setLanguage] = useState<'fa' | 'en'>('fa');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = () => {
    setToastMessage('تنظیمات با موفقیت ذخیره شد');
    setShowToast(true);
  };

  const handleDeleteData = () => {
    setShowDeleteModal(false);
    setToastMessage('داده‌ها حذف شدند');
    setShowToast(true);
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="mx-auto max-w-lg space-y-4">

        <SectionHeader
          title="تنظیمات"
          subtitle="مدیریت تنظیمات برنامه"
        />

        <Card variant="elevated">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon size={20} style={{ color: tokens.accent }} /> : <Sun size={20} style={{ color: tokens.accent }} />}
              <div>
                <p className="text-sm font-bold" style={{ color: tokens.textMain }}>
                  حالت نمایش
                </p>
                <p className="text-xs" style={{ color: tokens.textSub }}>
                  {isDark ? 'تاریک' : 'روشن'}
                </p>
              </div>
            </div>
            <Switch checked={isDark} onChange={toggleTheme} />
          </div>
        </Card>

        <Card variant="elevated">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 size={20} style={{ color: tokens.accent }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: tokens.textMain }}>
                    افکت‌های صوتی
                  </p>
                  <p className="text-xs" style={{ color: tokens.textSub }}>
                    صدای کلیک و تایمر
                  </p>
                </div>
              </div>
              <Switch checked={soundEnabled} onChange={setSoundEnabled} />
            </div>

            {soundEnabled && (
              <Slider
                value={volume}
                onChange={setVolume}
                min={0}
                max={100}
                step={5}
                label="میزان صدا"
                unit="%"
              />
            )}
          </div>
        </Card>

        <Card variant="elevated">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={20} style={{ color: tokens.accent }} />
              <div>
                <p className="text-sm font-bold" style={{ color: tokens.textMain }}>
                  اعلان‌ها
                </p>
                <p className="text-xs" style={{ color: tokens.textSub }}>
                  یادآوری تمرین
                </p>
              </div>
            </div>
            <Switch checked={notificationsEnabled} onChange={setNotificationsEnabled} />
          </div>
        </Card>

        <Card variant="elevated">
          <div className="flex items-center gap-3 mb-3">
            <Languages size={20} style={{ color: tokens.accent }} />
            <p className="text-sm font-bold" style={{ color: tokens.textMain }}>
              زبان برنامه
            </p>
          </div>
          <Tabs
            tabs={[
              { id: 'fa', label: 'فارسی' },
              { id: 'en', label: 'English' },
            ]}
            activeId={language}
            onChange={(id) => setLanguage(id as 'fa' | 'en')}
          />
        </Card>

        <Card variant="elevated">
          <div className="flex items-center gap-3 mb-3">
            <Trash2 size={20} style={{ color: tokens.danger }} />
            <div>
              <p className="text-sm font-bold" style={{ color: tokens.textMain }}>
                حذف داده‌ها
              </p>
              <p className="text-xs" style={{ color: tokens.textSub }}>
                پاک کردن تمام اطلاعات برنامه
              </p>
            </div>
          </div>
          <PrimaryButton
            variant="danger"
            fullWidth
            onClick={() => setShowDeleteModal(true)}
          >
            حذف تمام داده‌ها
          </PrimaryButton>
        </Card>

        <PrimaryButton
          variant="accent"
          size="lg"
          fullWidth
          onClick={handleSave}
        >
          <Save size={18} />
          ذخیره تنظیمات
        </PrimaryButton>

        <div className="flex items-center justify-center gap-2 py-4">
          <Info size={14} style={{ color: tokens.textSub }} />
          <p className="text-xs" style={{ color: tokens.textSub }}>
            Fito {APP_VERSION}
          </p>
        </div>

      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="تایید حذف داده‌ها"
        size="sm"
      >
        <p className="mb-5 text-sm" style={{ color: tokens.textSub }}>
          آیا از حذف تمام داده‌ها مطمئن هستید؟ این عمل قابل بازگشت نیست.
        </p>
        <div className="flex gap-2">
          <PrimaryButton
            variant="outline"
            fullWidth
            onClick={() => setShowDeleteModal(false)}
          >
            انصراف
          </PrimaryButton>
          <PrimaryButton
            variant="danger"
            fullWidth
            onClick={handleDeleteData}
          >
            حذف
          </PrimaryButton>
        </div>
      </Modal>

      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type="success"
        duration={2500}
      />

    </div>
  );
}
