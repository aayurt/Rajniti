import type { RichOrient } from './RichTile';

function getRotation(orient: RichOrient = 'bottom', flip: boolean = false): string | undefined {
  let deg = 0;
  if (orient === 'top') deg = 180;
  else if (orient === 'right') deg = -90;
  else if (orient === 'left') deg = 90;

  if (flip) {
    deg += 180;
  }

  return deg !== 0 ? `rotate(${deg}deg)` : undefined;
}

// RichUp character anatomy: currentColor disc + shade + white eyes + black pupils.
export default function Character({
  color,
  selected = false,
  flip = false,
  size = 24,
  orient = 'bottom',
}: {
  color: string;
  selected?: boolean;
  flip?: boolean;
  size?: number;
  orient?: RichOrient;
}) {
  return (
    <span
      data-character
      data-selected={selected || undefined}
      style={{ display: 'block', width: size, height: size, color }}
    >
      <span style={{ display: 'block', width: '100%', height: '100%', transform: getRotation(orient, flip) }}>
        <svg viewBox="0 0 32 32" fill="none" width="100%" height="100%" aria-hidden="true">
          <g clipPath="url(#character_svg__a)">
            <path
              data-body
              d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16Z"
              fill="currentColor"
            />
            <path
              data-show-on-selected="1"
              opacity="0.1"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 15.927c8.837 0 16-8.836 16 0a16 16 0 0 1-32 0c0-8.836 7.163 0 16 0Z"
              fill="#000"
            />
            <g data-testid="char-eyes">
              <path
                data-show-on-selected="1"
                d="M17.586 22.927a4.414 4.414 0 1 0 8.828 0 4.414 4.414 0 0 0-8.828 0ZM5.804 22.927c0 2.438 1.966 4.414 4.391 4.414s4.391-1.976 4.391-4.414c0-2.437-1.966-4.413-4.39-4.413-2.426 0-4.392 1.976-4.392 4.413Z"
                fill="#fff"
              />
            </g>
            <g data-testid="char-pupils">
              <path
                data-show-on-selected="1"
                d="M20.414 24.747c0 .88.71 1.594 1.586 1.594a1.59 1.59 0 0 0 1.587-1.594c0-.88-.71-1.594-1.587-1.594a1.59 1.59 0 0 0-1.586 1.594ZM8.602 24.747a1.594 1.594 0 1 0 3.188 0 1.594 1.594 0 0 0-3.188 0Z"
                fill="#000"
              />
            </g>
          </g>
          <defs>
            <clipPath id="character_svg__a">
              <path fill="#fff" d="M0 0h32v32H0z" />
            </clipPath>
          </defs>
        </svg>
      </span>
    </span>
  );
}

export { getRotation };