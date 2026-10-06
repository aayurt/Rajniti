import { useState } from 'react';
import { useGame } from '../game/store';

function Blob({ color, size = 30 }: { color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.55 }}
    >
      👀
    </div>
  );
}

export default function LeftPanel({ room = 'jfwq6' }: { room?: string }) {
  const { state, dispatch } = useGame();
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const url = `https://rajniti.io/room/${room}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard unavailable in some webviews */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    dispatch({ type: 'SEND_CHAT', text: draft.trim() });
    setDraft('');
  };

  return (
    <div className="flex flex-col gap-3 min-h-0 h-full">
      <div>
        <div className="font-black tracking-wide leading-none text-[30px]">
          RAJ<span className="text-lav">NITI</span>
          <em className="not-italic text-[#5b568f] text-[20px]">.IO</em>
        </div>
      </div>

      <div className="bg-panel border border-edge rounded-xl p-3.5">
        <p className="text-center text-lav font-bold text-sm mb-2.5">Share this game ⓘ</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-ink border border-edge rounded-lg px-3 py-2 text-xs overflow-hidden whitespace-nowrap text-ellipsis">
            {url}
          </div>
          <button
            onClick={copy}
            className="bg-tile border border-line rounded-lg px-3.5 py-2 text-[13px] font-semibold min-h-[44px]"
          >
            {copied ? '✓ Copied' : '⧉ Copy'}
          </button>
        </div>
        <button
          onClick={() => dispatch({ type: 'BACK_TO_LOBBY' })}
          className="w-full mt-2 bg-tile border border-line rounded-lg px-3 py-2 text-[13px] font-semibold min-h-[44px]"
        >
          ⚙ View room settings
        </button>
      </div>

      <div className="border border-dashed border-line rounded-[10px] p-2 text-center text-xs text-fog">
        Disable your ad blocker to support Rajniti.io
      </div>

      <div className="bg-panel border border-edge rounded-xl flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-center gap-2 p-2.5 border-b border-edge">
          <span className="text-fog text-[13px]">🔊 ✣</span>
          <b className="text-lav text-sm">Chat</b>
        </div>
        <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5">
          {state.chat.length === 0 && (
            <p className="text-center text-fog text-[13px] mt-6">💬 No messages yet</p>
          )}
          {state.chat.map((m) => (
            <div key={m.id} className="flex gap-2 items-start">
              <Blob color={m.color} size={26} />
              <div className="bg-tile rounded-lg px-3 py-1.5 text-[13px] max-w-[80%]">
                <div className="text-[11px] text-fog">{m.from}</div>
                <div>{m.text}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="p-3 flex gap-2 items-center">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Say something..."
            className="flex-1 bg-ink border border-edge rounded-full px-4 py-2.5 text-[13px] outline-none placeholder:text-fog min-h-[44px]"
          />
          <button
            type="submit"
            aria-label="Send"
            className="w-11 h-11 rounded-full bg-tile border border-edge flex items-center justify-center text-base flex-shrink-0"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
