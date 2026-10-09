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

// Hand-holding-dollar owner badge (reference price row).
function OwnerBadge() {
  return (
    <svg data-owner-badge viewBox="0 0 576 512" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M288-16c-13.3 0-24 10.7-24 24l0 12-1.8 0c-36.6 0-66.2 29.7-66.2 66.2 0 33.4 24.9 61.6 58 65.7l61 7.6c5.1 .6 9 5 9 10.2 0 5.7-4.6 10.2-10.2 10.2L240 180c-15.5 0-28 12.5-28 28s12.5 28 28 28l24 0 0 12c0 13.3 10.7 24 24 24s24-10.7 24-24l0-12 1.8 0c36.6 0 66.2-29.7 66.2-66.2 0-33.4-24.9-61.6-58-65.7l-61-7.6c-5.1-.6-9-5-9-10.2 0-5.7 4.6-10.2 10.2-10.2L328 76c15.5 0 28-12.5 28-28s-12.5-28-28-28l-16 0 0-12c0-13.3-10.7-24-24-24zM109.3 341.5L66.7 384 32 384c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l320.5 0c29 0 57.3-9.3 80.7-26.5l126.6-93.3c17.8-13.1 21.6-38.1 8.5-55.9s-38.1-21.6-55.9-8.5L392.6 416 280 416c-13.3 0-24-10.7-24-24s10.7-24 24-24l72 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-152.2 0c-33.9 0-66.5 13.5-90.5 37.5z"
      />
    </svg>
  );
}

// Bottom-tile anatomy mirrors samples/tile-shanghai-reference.html:
// level strip / flag row / auto-fit name row / price+owner row.
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
  const scale = fitFontScale(name, NAME_MAX_PX, NAME_BASE_PX);
  const isCorner = kind === 'start' || kind === 'prison-pass' || kind === 'vacation' || kind === 'goto-prison';
  const edge = orient === 'top' ? 'bottom' : orient === 'bottom' ? 'top' : orient;
  return (
    <div
      className={`rich-tile rich-${orient}${kind ? ` rich-kind-${kind}` : ''}${selected ? ' selected' : ''}`}
      data-board-block-index={index}
      data-city-level={level}
      aria-expanded={expanded}
      title={name}
      onClick={onSelect}
      style={style}
    >
      <div className="rich-clip">
        {groupColor && <div className="rich-bar" style={{ background: groupColor }} />}
        {flag && (
          <div className="rich-flag-bg" data-flag-bg>
            <Flag code={flag} />
          </div>
        )}
        <div className="rich-body">
          {!flag && icon && <div className="rich-icon">{icon}</div>}
          <div className="rich-name">
            <span style={{ fontSize: NAME_BASE_PX * scale }}>{name}</span>
          </div>
          {sub && <div className="rich-sub">{sub}</div>}
          {price !== undefined && (
            <div className="rich-price" data-price-row>
              <span>{price}$</span>
              {ownedBy && <OwnerBadge />}
            </div>
          )}
        </div>
        <div className="rich-level">
          {Array.from({ length: level }, (_, i) => (
            <span key={i} data-level-pip />
          ))}
        </div>
      </div>
      {!isCorner && flag && (
        <div className="rich-flag-edge" data-flag-edge={edge}>
          <Flag code={flag} />
        </div>
      )}
      {children}
    </div>
  );
}
