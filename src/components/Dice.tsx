const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [28, 28],
    [72, 72],
  ],
  3: [
    [28, 28],
    [50, 50],
    [72, 72],
  ],
  4: [
    [30, 30],
    [70, 30],
    [30, 70],
    [70, 70],
  ],
  5: [
    [30, 30],
    [70, 30],
    [50, 50],
    [30, 70],
    [70, 70],
  ],
  6: [
    [30, 28],
    [70, 28],
    [30, 50],
    [70, 50],
    [30, 72],
    [70, 72],
  ],
};

export default function Dice({ value, rolling, tilt = -8 }: { value: number; rolling?: boolean; tilt?: number }) {
  return (
    <div
      className={`dice ${rolling ? 'rolling' : ''}`}
      style={rolling ? undefined : { transform: `rotate(${tilt}deg)` }}
    >
      {PIPS[value].map(([x, y], i) => (
        <div key={i} className="pip" style={{ left: `calc(${x}% - 5px)`, top: `calc(${y}% - 5px)` }} />
      ))}
    </div>
  );
}
