import { SoundPackName } from '../../audio/types';
import { useGame } from '../../game/store';

const SoundPackLabels: Record<SoundPackName, string> = {
  classic: 'Classic',
  funny: 'Funny',
  got: 'Game of Thrones',
};

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button aria-pressed={on} onClick={onClick} className={`toggle ${on ? 'on' : ''}`} />;
}

export default function SoundSelector() {
  const { state, dispatch } = useGame();

  return (
    <div className="bg-panel border border-edge rounded-xl p-4">
      <b className="text-lav text-sm block text-center mb-3">Sound settings</b>
      <div className="flex items-center gap-3 py-2.5 border-b border-edge">
        <span>🔊</span>
        <div className="flex-1">
          <div className="text-sm font-semibold">{SoundPackLabels[state.sound.pack]}</div>
          <div className="text-xs text-fog">Current sound pack</div>
        </div>
        <Toggle on={false} onClick={() => {}} />
      </div>

      <div className="flex items-center gap-3 py-2.5 border-b border-edge">
        <span>🔈</span>
        <div className="flex-1">
          <div className="text-sm font-semibold">Volume</div>
          <div className="text-xs text-fog">0-100</div>
        </div>
        <Toggle on={false} onClick={() => {}} />
      </div>

      <div className="flex flex-col items-center gap-2 my-4">
{['classic', 'funny', 'got'].map((pack: SoundPackName) => {
          const active = state.sound.pack === pack;
          return (
            <button
              key={pack}
              onClick={() => dispatch({ type: 'SET_SOUND_PACK', pack: pack as SoundPackName })}
              className={`w-full rounded-md px-4 py-2 text-left ${
                active ? 'bg-gray-100 font-medium' : 'text-fog hover:text-lav'
              }`}
            >
              {SoundPackLabels[pack]}
            </button>
          );
        })}
      </div>
    </div>
  );
}