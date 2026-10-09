const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  6: [[30, 28], [70, 28], [30, 50], [70, 50], [30, 72], [70, 72]],
};

interface DiceProps {
  value: number;
  rolling?: boolean;
  size?: number;
  className?: string;
}

export default function Dice({ value, rolling, size = 92, className = '' }: DiceProps) {
  const baseStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    background: 'linear-gradient(145deg, #fff, #d9d6e8)',
    borderRadius: `${size * 0.217}px`,
    position: 'relative',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6), inset 0 2px 4px #fff',
    flexShrink: 0,
    transform: rolling ? undefined : 'rotate(-8deg)',
  };

  const pipSize = size * 0.152;
  const pipOffset = pipSize / 2;

  return (
    <div
      className={`dice-3d ${rolling ? 'rolling' : ''} ${className}`}
      data-testid="dice"
      style={baseStyle}
    >
      {PIPS[value].map(([x, y], i) => (
        <div
          key={i}
          className="pip"
          style={{
            left: `calc(${x}% - ${pipOffset}px)`,
            top: `calc(${y}% - ${pipOffset}px)`,
            width: `${pipSize}px`,
            height: `${pipSize}px`,
            background: '#1a1830',
            borderRadius: '50%',
            position: 'absolute',
          }}
        />
      ))}
    </div>
  );
}