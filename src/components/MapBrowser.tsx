import { useState } from 'react';
import { tileArea } from '../data/tiles';
import type { Tile } from '../data/tiles';
import { MAP_ORDER, MAPS } from '../data/maps';
import type { BoardMap, MapId } from '../data/maps';

function cellsFor(map: BoardMap): Map<number, Tile> {
  return new Map(map.tiles.map((t) => [t.id, t]));
}

export function MiniBoard({ map, cell = 10, showCenter = false }: { map: BoardMap; cell?: number; showCenter?: boolean }) {
  const cells = cellsFor(map);
  const spots = [];
  for (let row = 1; row <= 11; row++) {
    for (let col = 1; col <= 11; col++) {
      const edge = row === 1 || row === 11 || col === 1 || col === 11;
      const tile = [...cells.values()].find((t) => {
        const [rs, cs] = tileArea(t.id).split('/').map(Number);
        return rs === row && cs === col;
      });
      spots.push(
        <div
          key={`${row}-${col}`}
          data-minimap-cell={edge && tile ? tile.id : undefined}
          title={tile?.name ?? ''}
          style={{
            width: cell,
            height: cell,
            borderRadius: 1,
            background: !edge ? 'transparent' : (tile?.color ?? '#2b2850'),
          }}
        />,
      );
    }
  }
  return (
    <div style={{ position: 'relative', width: cell * 11, height: cell * 11 }}>
      <div
        data-minimap-grid
        style={{ display: 'grid', gridTemplateColumns: `repeat(11, ${cell}px)`, gap: 0 }}
      >
        {spots}
      </div>
      {showCenter && (
        <div
          style={{
            position: 'absolute',
            inset: cell,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: 3, color: '#8f8aa8' }}>BOARD PREVIEW</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{map.name}</div>
          <div style={{ fontSize: 34 }}>{map.icon}</div>
        </div>
      )}
    </div>
  );
}

export default function MapBrowser({
  current,
  onSelect,
  onClose,
}: {
  current: MapId;
  onSelect: (id: MapId) => void;
  onClose: () => void;
}) {
  const [preview, setPreview] = useState<MapId>(current);
  const map = MAPS[preview];
  return (
    <div
      data-map-browser
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1a1830',
          border: '1px solid #2b2850',
          borderRadius: 14,
          padding: 16,
          maxWidth: 860,
          width: '100%',
          maxHeight: '90dvh',
          overflowY: 'auto',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ minWidth: 200, flex: 1 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Browse maps</div>
          {MAP_ORDER.map((id) => (
            <button
              key={id}
              onClick={() => setPreview(id)}
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                marginBottom: 6,
                borderRadius: 10,
                border: '1px solid #2b2850',
                background: id === preview ? '#25224a' : 'transparent',
                color: '#e8e6ff',
                cursor: 'pointer',
                minHeight: 48,
              }}
            >
              <span style={{ fontSize: 20 }}>{MAPS[id].icon}</span>
              <span style={{ flex: 1, textAlign: 'left', fontWeight: 600 }}>{MAPS[id].name}</span>
              {id === current && <span style={{ fontSize: 11, color: '#7dff5e' }}>✓ current</span>}
            </button>
          ))}
        </div>
        <div style={{ flex: 2, minWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <MiniBoard map={map} cell={22} showCenter />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onSelect(preview)}
              style={{
                background: '#5b34e8',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 22px',
                fontWeight: 700,
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              {preview === current ? '✓ Selected' : 'Select this map'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                color: '#e8e6ff',
                border: '1px solid #34315e',
                borderRadius: 8,
                padding: '10px 18px',
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              ✕ Close preview
            </button>
          </div>
          <MiniBoard map={map} cell={4} />
        </div>
      </div>
    </div>
  );
}
