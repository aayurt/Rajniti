import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import MapBrowser, { MiniBoard } from './MapBrowser';
import { MAPS } from '../data/maps';

afterEach(() => cleanup());

describe('MiniBoard', () => {
  it('renders 40 edge cells for the map', () => {
    const { container } = render(<MiniBoard map={MAPS.classic} />);
    expect(container.querySelectorAll('[data-minimap-cell]').length).toBe(40);
  });

  it('shows center label when asked', () => {
    render(<MiniBoard map={MAPS.deathvalley} showCenter />);
    expect(screen.getByText('BOARD PREVIEW')).toBeInTheDocument();
    expect(screen.getByText('Death Valley')).toBeInTheDocument();
  });
});

describe('MapBrowser', () => {
  it('lists all four maps', () => {
    render(<MapBrowser current="classic" onSelect={() => {}} onClose={() => {}} />);
    for (const name of ['Classic', 'Mr. Worldwide', 'Death Valley', 'Lucky Wheel'])
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
  });

  it('selects the previewed map and closes', () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<MapBrowser current="classic" onSelect={onSelect} onClose={onClose} />);
    fireEvent.click(screen.getByText('Death Valley'));
    fireEvent.click(screen.getByText('Select this map'));
    expect(onSelect).toHaveBeenCalledWith('deathvalley');
    fireEvent.click(screen.getByText('✕ Close preview'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
