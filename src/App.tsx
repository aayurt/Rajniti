import { GameProvider, useGame } from './game/store';
import LeftPanel from './components/LeftPanel';
import Board from './components/Board';
import RightPanel from './components/RightPanel';
import Lobby from './components/Lobby';

const TABS = [
  { id: 'board', label: 'Board', icon: '🎲' },
  { id: 'players', label: 'Players', icon: '👥' },
  { id: 'chat', label: 'Chat', icon: '💬' },
] as const;

function GameRoom() {
  const { state, dispatch } = useGame();
  const tab = state.mobileTab;

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="flex-1 grid gap-3 p-3 min-h-0 lg:grid-cols-[300px_1fr_310px] grid-cols-1">
        {/* center board */}
        <div className={`${tab === 'board' ? 'block' : 'hidden'} lg:block min-h-0 h-full`}>
          <div className="h-full min-h-[560px] lg:min-h-0 overflow-x-auto">
            <div className="h-full min-w-[680px] lg:min-w-0">
              <Board />
            </div>
          </div>
        </div>
        {/* right players */}
        <div
          className={`${tab === 'players' ? 'block' : 'hidden'} lg:block min-h-0 h-full lg:order-none order-first`}
        >
          <RightPanel />
        </div>
        {/* left chat/share */}
        <div className={`${tab === 'chat' ? 'block' : 'hidden'} lg:block min-h-0 h-full lg:order-first order-first`}>
          <LeftPanel />
        </div>
      </div>

      {/* mobile bottom nav */}
      <nav className="lg:hidden grid grid-cols-3 bg-panel border-t border-edge pb-safe">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => dispatch({ type: 'SET_TAB', tab: t.id })}
            className={`py-3 text-xs font-semibold flex flex-col items-center gap-0.5 min-h-[56px] ${
              tab === t.id ? 'text-lime' : 'text-fog'
            }`}
          >
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Shell() {
  const { state } = useGame();
  return state.screen === 'lobby' ? <Lobby /> : <GameRoom />;
}

export default function App() {
  return (
    <GameProvider>
      <Shell />
    </GameProvider>
  );
}
