import { useState, useEffect } from 'react';
import { useGame } from '../game/store';
import { shareCopy, adblockCopy, connectionCopy, chatCopy } from './panels/copy';

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
  const [showAdblockModal, setShowAdblockModal] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const url = `https://rajniti.io/room/${room}`;

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
      <div className="flex justify-between items-center">
        <div className="font-black tracking-wide leading-none text-[30px]">
          RAJ<span className="text-lav">NITI</span>
          <em className="not-italic text-[#5b568f] text-[20px]">.IO</em>
        </div>
        <div className="flex items-center gap-2 text-fog">
          <button aria-label="discord" className="w-6 h-6 flex items-center justify-center hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
          </button>
          <button aria-label="help" className="w-6 h-6 flex items-center justify-center hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
          <button aria-label="sound" className="w-6 h-6 flex items-center justify-center hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          </button>
        </div>
      </div>

      {isOffline && (
        <div className="bg-[#e05e3a] text-white p-3 rounded-lg text-sm text-center">
          <div className="font-bold">{connectionCopy.bannerTitle}</div>
          <div className="text-xs mt-1">{connectionCopy.bannerBody}</div>
        </div>
      )}

      <div className="bg-panel border border-edge rounded-xl p-3.5">
        <p className="text-center text-lav font-bold text-sm mb-2.5">{shareCopy.header} ⓘ</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-ink border border-edge rounded-lg px-3 py-2 text-xs overflow-hidden whitespace-nowrap text-ellipsis">
            {url}
          </div>
          <button
            onClick={copy}
            className="bg-tile border border-line rounded-lg px-3.5 py-2 text-[13px] font-semibold min-h-[44px]"
          >
            {copied ? shareCopy.copiedBtn : shareCopy.copyBtn}
          </button>
        </div>
        <button
          onClick={() => dispatch({ type: 'BACK_TO_LOBBY' })}
          className="w-full mt-2 bg-tile border border-line rounded-lg px-3 py-2 text-[13px] font-semibold min-h-[44px]"
        >
          {shareCopy.viewSettings}
        </button>
      </div>

      <div className="border border-dashed border-line rounded-[10px] p-2 text-center text-xs text-fog">
        {adblockCopy.inline}
      </div>

      <div className="bg-panel border border-edge rounded-xl flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-center gap-2 p-2.5 border-b border-edge">
          <span className="text-fog text-[13px]">🔊 ✣</span>
          <b className="text-lav text-sm">{chatCopy.header}</b>
        </div>
        <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5">
          {state.chat.length === 0 && (
            <p className="text-center text-fog text-[13px] mt-6">💬 {chatCopy.empty}</p>
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
            placeholder={chatCopy.placeholder}
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

      {showAdblockModal && (
        <div className="fixed bottom-4 left-4 z-50 p-4 pointer-events-none">
          <div className="bg-panel border border-edge rounded-xl p-4 max-w-xs w-full relative shadow-lg pointer-events-auto">
            <button
              onClick={() => setShowAdblockModal(false)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-fog bg-tile rounded-full text-xs"
            >
              ✕
            </button>
            <h3 className="text-lav font-bold text-[15px] mb-2 pr-6">{adblockCopy.modalTitle}</h3>
            <p className="text-xs text-fog leading-relaxed">
              {adblockCopy.modalBody}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
