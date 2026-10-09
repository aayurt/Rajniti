import { APPEARANCES } from './skins';

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
}

export default function AppearanceModal({ isOpen, onClose, onSelect }: AppearanceModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-panel border border-edge rounded-xl p-6 max-w-sm w-full">
        <h2 className="text-lav text-xl font-bold mb-4">Select Appearance</h2>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {APPEARANCES.map((color) => {
            const [r, g, b] = color.match(/\d+/g)!.map(Number);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            const contrastColor = brightness > 155 ? '#1f2937' : '#ffffff';

            return (
              <button
                key={color}
                onClick={() => onSelect(color)}
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  brightness > 155 ? 'text-gray-800' : 'text-white'
                } border-2 ${color}`}
                style={{ background: color }}
                aria-label={`Appearance ${color}`}
              >
                {brightness > 155 ? color : ''}
              </button>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-200 rounded-md py-2 text-sm">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 bg-tile rounded-md py-2 text-sm">
            Select
          </button>
        </div>
      </div>
    </div>
  );
}