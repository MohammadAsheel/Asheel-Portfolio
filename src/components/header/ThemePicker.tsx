import { Fragment, useEffect, useRef, useState } from 'react';
import Icon from '@/components/common/Icon';
import { getIcon, type IconSource } from '@/lib/icons';
import { applyPalette, getStoredTheme, setStoredTheme, type ThemeChoice } from '@/lib/palette';

interface ThemeOption {
  choice: ThemeChoice;
  label: string;
  icon: IconSource;
  dividerLabel?: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  { choice: 'auto', label: 'Automatic', icon: getIcon('calendar') },
  { choice: 'autumn', label: 'Autumn', icon: getIcon('leaf'), dividerLabel: 'Seasons' },
  { choice: 'winter', label: 'Winter', icon: getIcon('snowflake') },
  { choice: 'spring', label: 'Spring', icon: getIcon('seeding') },
  { choice: 'summer', label: 'Summer', icon: getIcon('beach') },
  { choice: 'neon', label: 'Neon', icon: getIcon('bolt'), dividerLabel: 'Other' },
];

export default function ThemePicker() {
  const pickerRef = useRef<HTMLDetailsElement>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeChoice>(() => getStoredTheme());

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent): void => {
      const picker = pickerRef.current;
      if (picker?.open && !picker.contains(event.target as Node)) {
        picker.open = false;
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      const picker = pickerRef.current;
      if (event.key === 'Escape' && picker?.open) {
        picker.open = false;
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectTheme = (theme: ThemeChoice): void => {
    setStoredTheme(theme);
    applyPalette();
    setCurrentTheme(theme);
    if (pickerRef.current) {
      pickerRef.current.open = false;
    }
  };

  return (
    <details className="theme-picker" id="theme-picker" ref={pickerRef}>
      <summary className="theme-picker-button" aria-label="Choose theme">
        {THEME_OPTIONS.map((option: ThemeOption) => (
          <Icon
            key={option.choice}
            icon={option.icon}
            className={['picker-icon', option.choice !== currentTheme ? 'hidden' : ''].filter(Boolean).join(' ')}
            data-icon={option.choice}
          />
        ))}
      </summary>
      <div className="theme-picker-panel" role="group" aria-label="Theme">
        {THEME_OPTIONS.map((option: ThemeOption) => (
          <Fragment key={option.choice}>
            {option.dividerLabel && (
              <div className="theme-picker-divider" role="separator">
                {option.dividerLabel}
              </div>
            )}
            <button
              className="theme-picker-option"
              type="button"
              data-theme-option={option.choice}
              aria-pressed={option.choice === currentTheme}
              onClick={() => selectTheme(option.choice)}
            >
              <Icon icon={option.icon} />
              <span>{option.label}</span>
            </button>
          </Fragment>
        ))}
      </div>
    </details>
  );
}
