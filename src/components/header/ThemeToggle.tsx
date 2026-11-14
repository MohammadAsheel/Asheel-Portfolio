import Icon from '@/components/common/Icon';
import { getIcon } from '@/lib/icons';
import { togglePaletteMode } from '@/lib/palette';

export default function ThemeToggle() {
  return (
    <button
      className="theme-toggle"
      type="button"
      id="theme-toggle"
      aria-label="Toggle color theme"
      onClick={() => togglePaletteMode()}
    >
      <Icon icon={getIcon('sun')} className="theme-toggle-sun" />
      <Icon icon={getIcon('moon')} className="theme-toggle-moon" />
    </button>
  );
}
