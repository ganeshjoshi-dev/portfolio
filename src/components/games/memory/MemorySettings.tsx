'use client';

import { useCallback } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { useLocalStorage } from '@/hooks';
import type {
  MemoryGameSettings,
  MemoryGridSize,
  MemoryTimerMode,
} from '@/types/games';

const MEMORY_SETTINGS_KEY = 'memory-game-settings';

const defaultSettings: MemoryGameSettings = {
  gridSize: '4x4',
  timerMode: 'none',
  countdownSeconds: 60,
};

const gridSizeOptions: { value: MemoryGridSize; label: string }[] = [
  { value: '2x2', label: '2×2 (Easy)' },
  { value: '3x2', label: '3×2 (Easy)' },
  { value: '4x4', label: '4×4 (Medium)' },
  { value: '4x5', label: '4×5 (Hard)' },
  { value: '6x6', label: '6×6 (Expert)' },
];

const timerModeOptions: { value: MemoryTimerMode; label: string }[] = [
  { value: 'none', label: 'No timer' },
  { value: 'stopwatch', label: 'Stopwatch' },
  { value: 'countdown', label: 'Countdown' },
];

const countdownPresets = [30, 60, 90, 120, 180, 300];

const MIN_COUNTDOWN = 10;
const MAX_COUNTDOWN = 600;

export interface MemorySettingsProps {
  onApply: (settings: MemoryGameSettings) => void;
  className?: string;
}

export default function MemorySettings({
  onApply,
  className = '',
}: MemorySettingsProps) {
  const [settings, setSettings] = useLocalStorage<MemoryGameSettings>(
    MEMORY_SETTINGS_KEY,
    defaultSettings
  );

  const handleGridSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const gridSize = e.target.value as MemoryGridSize;
      setSettings({ ...settings, gridSize });
    },
    [settings, setSettings]
  );

  const handleTimerModeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const timerMode = e.target.value as MemoryTimerMode;
      setSettings({
        ...settings,
        timerMode,
        countdownSeconds:
          timerMode === 'countdown' ? settings.countdownSeconds ?? 60 : undefined,
      });
    },
    [settings, setSettings]
  );

  const handleCountdownPresetChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value === 'custom') return;
      const countdownSeconds = parseInt(value, 10);
      if (!Number.isNaN(countdownSeconds)) {
        setSettings({ ...settings, countdownSeconds });
      }
    },
    [settings, setSettings]
  );

  const handleCountdownCustomChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const n = parseInt(raw, 10);
      if (raw === '') {
        setSettings({ ...settings, countdownSeconds: 60 });
        return;
      }
      if (!Number.isNaN(n)) {
        const countdownSeconds = Math.min(
          MAX_COUNTDOWN,
          Math.max(MIN_COUNTDOWN, n)
        );
        setSettings({ ...settings, countdownSeconds });
      }
    },
    [settings, setSettings]
  );

  const handleApply = useCallback(() => {
    const countdownSeconds =
      settings.timerMode === 'countdown'
        ? Math.min(
            MAX_COUNTDOWN,
            Math.max(MIN_COUNTDOWN, settings.countdownSeconds ?? 60)
          )
        : undefined;
    const next: MemoryGameSettings = {
      ...settings,
      countdownSeconds,
    };
    setSettings(next);
    onApply(next);
  }, [settings, onApply, setSettings]);

  const useCustomCountdown =
    settings.timerMode === 'countdown' &&
    !countdownPresets.includes(settings.countdownSeconds ?? 60);

  return (
    <div
      className={`rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 sm:p-6 ${className}`}
      role="form"
      aria-label="Memory game settings"
    >
      <h3 className="text-sm font-medium text-slate-300 mb-4">Settings</h3>
      <div className="space-y-4">
        <Select
          label="Grid size"
          value={settings.gridSize}
          onChange={handleGridSizeChange}
          options={gridSizeOptions}
          className="w-full"
        />
        <Select
          label="Timer"
          value={settings.timerMode}
          onChange={handleTimerModeChange}
          options={timerModeOptions}
          className="w-full"
        />
        {settings.timerMode === 'countdown' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Countdown time
            </label>
            <div className="flex flex-wrap gap-2 items-end">
              <Select
                value={
                  useCustomCountdown
                    ? 'custom'
                    : String(settings.countdownSeconds ?? 60)
                }
                onChange={handleCountdownPresetChange}
                options={[
                  ...countdownPresets.map((s) => ({
                    value: String(s),
                    label: `${s}s`,
                  })),
                  { value: 'custom', label: 'Custom' },
                ]}
                className="min-w-[5rem]"
              />
              {useCustomCountdown && (
                <Input
                  type="number"
                  min={MIN_COUNTDOWN}
                  max={MAX_COUNTDOWN}
                  value={settings.countdownSeconds ?? 60}
                  onChange={handleCountdownCustomChange}
                  className="w-24"
                  inputClassName="w-full"
                  aria-label="Custom countdown seconds"
                />
              )}
              <span className="text-slate-500 text-sm">
                {MIN_COUNTDOWN}s–{MAX_COUNTDOWN}s
              </span>
            </div>
          </div>
        )}
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleApply}
          className="w-full sm:w-auto"
        >
          Apply &amp; new game
        </Button>
      </div>
    </div>
  );
}

export { MEMORY_SETTINGS_KEY, defaultSettings };
