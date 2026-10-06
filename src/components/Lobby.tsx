import { useGame } from '../game/store';
import LeftPanel from './LeftPanel';
import Board from './Board';

const APPEARANCES = [
  '#c8f04a', '#ffcf3f', '#ff8a3d', '#d94f4f',
  '#5aa9ff', '#7fd4e8', '#1f9e8e', '#4ade80',
  '#a0715c', '#c0439c', '#ff7d9c', '#7b5cf0',
];

const RULES: { key: string; title: string; desc: string }[] = [
  { key: 'doubleRent', title: 'x2 rent on full-set properties', desc: 'If a player owns a full property set, the base rent payment will be doubled' },
  { key: 'vacationCash', title: 'Vacation cash', desc: 'If a player lands on Vacation, all collected money from taxes and bank payments will be earned' },
  { key: 'auction', title: 'Auction', desc: 'If someone skips purchasing the property landed on, it will be sold to the highest bidder' },
  { key: 'noRentInPrison', title: "Don't collect rent while in prison", desc: 'Rent will not be collected when landing on properties whose owners are in prison' },
  { key: 'mortgage', title: 'Mortgage', desc: "Mortgage properties to earn 50% of their cost, but you won't get paid rent when players land on them" },
  { key: 'evenBuild', title: 'Even build', desc: 'Houses and hotels must be built up and sold off evenly within a property set' },
];

const RULE_ICONS = ['🪙', '🏖️', '🔨', '📉', '🤲', '🏘️'];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button aria-pressed={on} onClick={onClick} className={`toggle ${on ? 'on' : ''}`} />;
}

export default function Lobby() {
  const { state, dispatch } = useGame();

  return (
    <div className="grid gap-3 p-3 h-[100dvh] lg:grid-cols-[300px_1fr_340px] grid-cols-1">
      <div className="hidden lg:block min-h-0">
        <LeftPanel />
      </div>

      {/* center: blurred board + appearance picker */}
      <div className="relative min-h-0 h-[52dvh] lg:h-auto">
        <Board blurred interactive={false} />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 rounded-[14px] p-4 overflow-y-auto">
          <p className="text-sm mb-5">Select your player appearance:</p>
          <div className="grid grid-cols-4 gap-x-7 gap-y-4 mb-7">
            {APPEARANCES.map((c) => {
              const active = state.appearance === c;
              return (
                <button
                  key={c}
                  onClick={() => dispatch({ type: 'SET_APPEARANCE', color: c })}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl min-w-[48px] min-h-[48px] ${
                    active ? 'ring-4 ring-white/70 scale-110' : ''
                  }`}
                  style={{ background: c }}
                  aria-label={`Appearance ${c}`}
                >
                  {active && '👀'}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => dispatch({ type: 'JOIN_GAME' })}
            className="bg-[#5b34e8] text-white font-semibold rounded-md px-7 py-3 text-[15px] min-h-[48px]"
          >
            Join game →
          </button>
          <button className="mt-8 border border-line rounded-lg px-4 py-2 text-[13px] text-fog min-h-[44px]">
            🛒 Get more appearances
          </button>
        </div>
      </div>

      {/* right: waiting + settings */}
      <div className="min-h-0 overflow-y-auto flex flex-col gap-3 pb-safe">
        <div className="bg-panel border border-edge rounded-xl p-3 text-center text-fog text-sm">
          Waiting for players...
        </div>
        <div className="bg-panel border border-edge rounded-xl p-4">
          <b className="text-lav text-sm block text-center mb-3">Game settings</b>

          <div className="flex items-center gap-3 py-2.5 border-b border-edge">
            <span>👥</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">Maximum players</div>
              <div className="text-xs text-fog">How many players can join the game</div>
            </div>
            <select
              value={state.maxPlayers}
              onChange={(e) => dispatch({ type: 'SET_MAX_PLAYERS', n: Number(e.target.value) })}
              className="bg-tile border border-line rounded-md px-2 py-2 text-sm min-h-[44px]"
            >
              {[2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 py-2.5 border-b border-edge">
            <span>🔑</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">Private room</div>
              <div className="text-xs text-fog">Private rooms can be accessed using the room URL only</div>
            </div>
            <Toggle on onClick={() => {}} />
          </div>

          <div className="flex items-center gap-3 py-2.5 border-b border-edge">
            <span>🤖</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">
                Allow bots to join <span className="bg-grape text-[10px] px-1.5 py-0.5 rounded">Beta</span>
              </div>
              <div className="text-xs text-fog">Bots will join the game based on availability</div>
            </div>
            <Toggle on={false} onClick={() => {}} />
          </div>

          <div className="flex items-center gap-3 py-2.5 border-b border-edge">
            <span>🗺️</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">Board map</div>
              <div className="text-xs text-fog">Change map tiles, properties and stacks</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">Classic</div>
              <div className="text-xs text-lav">Browse maps ›</div>
            </div>
          </div>

          <b className="text-lav text-sm block text-center my-3">Gameplay rules</b>
          {RULES.map((r, i) => (
            <div key={r.key} className="flex items-start gap-3 py-2.5 border-b border-edge">
              <span className="mt-0.5">{RULE_ICONS[i]}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="text-xs text-fog">{r.desc}</div>
              </div>
              <Toggle on={!!state.rules[r.key]} onClick={() => dispatch({ type: 'TOGGLE_RULE', key: r.key })} />
            </div>
          ))}

          <div className="flex items-center gap-3 py-2.5 border-b border-edge">
            <span>💸</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">Starting cash</div>
              <div className="text-xs text-fog">Adjust how much money players start the game with</div>
            </div>
            <select
              value={state.startingCash}
              onChange={(e) => dispatch({ type: 'SET_STARTING_CASH', n: Number(e.target.value) })}
              className="bg-tile border border-line rounded-md px-2 py-2 text-sm min-h-[44px]"
            >
              {[1000, 1500, 2000, 2500].map((n) => (
                <option key={n} value={n}>${n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 py-2.5">
            <span>🔀</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">Randomize player order</div>
              <div className="text-xs text-fog">Randomly reorder players at the beginning of the game</div>
            </div>
            <Toggle on={!!state.rules.randomOrder} onClick={() => dispatch({ type: 'TOGGLE_RULE', key: 'randomOrder' })} />
          </div>
        </div>
      </div>
    </div>
  );
}
