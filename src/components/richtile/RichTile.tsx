import type { CSSProperties, ReactNode } from 'react';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/yanone-kaffeesatz/400.css';
import '@fontsource/yanone-kaffeesatz/600.css';
import './tokens.css';
import Flag from './flags';
import type { FlagCode } from './flags';
import { fitFontScale } from './scale';

export type RichOrient = 'top' | 'right' | 'bottom' | 'left';

export interface RichTileProps {
  index: number;
  name: string;
  price?: number;
  flag?: FlagCode;
  groupColor?: string;
  kind?: string;
  icon?: string;
  level?: number;
  ownedBy?: string;
  selected?: boolean;
  expanded?: boolean;
  orient?: RichOrient;
  sub?: string;
  onSelect?: () => void;
  style?: CSSProperties;
  children?: ReactNode;
}

const NAME_BASE_PX = 13;
const NAME_MAX_PX = 58;

function OwnerBadge() {
  return (
    <div className="cprZ5bW8">
      <div className="ai0ojLXA">
        <div className="boV026E-"></div>
        <div className="Eys-0IGN">
          <svg data-prefix="fas" data-icon="hand-holding-dollar" className="svg-inline--fa fa-hand-holding-dollar" role="img" viewBox="0 0 576 512" aria-hidden="true" width="1em" height="1em">
            <path fill="currentColor" d="M288-16c-13.3 0-24 10.7-24 24l0 12-1.8 0c-36.6 0-66.2 29.7-66.2 66.2 0 33.4 24.9 61.6 58 65.7l61 7.6c5.1 .6 9 5 9 10.2 0 5.7-4.6 10.2-10.2 10.2L240 180c-15.5 0-28 12.5-28 28s12.5 28 28 28l24 0 0 12c0 13.3 10.7 24 24 24s24-10.7 24-24l0-12 1.8 0c36.6 0 66.2-29.7 66.2-66.2 0-33.4-24.9-61.6-58-65.7l-61-7.6c-5.1-.6-9-5-9-10.2 0-5.7 4.6-10.2 10.2-10.2L328 76c15.5 0 28-12.5 28-28s-12.5-28-28-28l-16 0 0-12c0-13.3-10.7-24-24-24zM109.3 341.5L66.7 384 32 384c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l320.5 0c29 0 57.3-9.3 80.7-26.5l126.6-93.3c17.8-13.1 21.6-38.1 8.5-55.9s-38.1-21.6-55.9-8.5L392.6 416 280 416c-13.3 0-24-10.7-24-24s10.7-24 24-24l72 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-152.2 0c-33.9 0-66.5 13.5-90.5 37.5z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function RichTile({
  index,
  name,
  price,
  flag,
  groupColor,
  kind,
  icon,
  sub,
  level = 0,
  ownedBy,
  selected,
  expanded = false,
  orient = 'bottom',
  onSelect,
  style,
  children,
}: RichTileProps) {
  const scalePct = Math.min(100, Math.max(10, fitFontScale(name, NAME_MAX_PX, NAME_BASE_PX) * 100));

  const blockClass = `D8mtfl-S _1KW03nqs Itu-lOtn richup-block-${orient}${kind ? ` richup-block-${kind}` : ''}${selected ? ' selected' : ''} lGIw59Ly`;

  return (
    <div
      className={blockClass}
      data-board-block-index={index}
      data-city-level={level}
      aria-expanded={expanded}
      title={name}
      onClick={onSelect}
      style={style}
    >
      <div className="PuSPraNU">
        {Array.from({ length: level }, (_, i) => (
          <span key={i} data-level-pip />
        ))}
      </div>

      {flag && (
        <div className="LelS5mxC">
          <div className="YqnDBpFw">
            <Flag code={flag} />
          </div>
        </div>
      )}

      {groupColor && <div className="rich-bar" style={{ background: groupColor, height: '6px', width: '100%', position: 'absolute', top: 0, left: 0 }} />}

      <div className="CvalsVWS">
        {flag && (
          <div className="mlnKELb2">
            <Flag code={flag} />
          </div>
        )}
        {!flag && icon && <div className="rich-icon" style={{ fontSize: '20px', lineHeight: 1, zIndex: 1, textAlign: 'center' }}>{icon}</div>}
        <div className="LSlmqo-l">
          <div style={{ display: 'inline-block', fontSize: `${scalePct}%` }}>{name}</div>
        </div>
        {sub && <div className="rich-sub" style={{ fontSize: '0.65em', color: '#aaa', marginTop: '0.2rem', textAlign: 'center', zIndex: 1 }}>{sub}</div>}
      </div>

      {price !== undefined && (
        <div className="_0NRL5-w0">
          <div className="YV19OnIY">{price}</div>
          {ownedBy && <OwnerBadge />}
        </div>
      )}

      {children}
    </div>
  );
}
