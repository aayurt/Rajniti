import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  it('renders tab panels', () => {
    const { container } = render(
      <Tabs value="1" onValueChange={() => {}}>
        <div>
          <button value="tab1" onClick={() => {}}>
            <TabPanel value="tab1">Panel 1</TabPanel>
          </button>
        </div>
        <div>
          <button value="tab2" onClick={() => {}}>
            <TabPanel value="tab2">Panel 2</TabPanel>
          </button>
        </div>
      </Tabs>
    );
    const panels = container.querySelectorAll('[id^="tab-panel-"]');
    expect(panels.length).toBe(2);
  });

  it('selects active tab', () => {
    const { container } = render(
      <Tabs value="tab1" onValueChange={() => {}}>
        <button value="tab1" onClick={() => {}}>
          <TabPanel value="tab1">Panel 1</TabPanel>
        </button>
        <button value="tab2" onClick={() => {}}>
          <TabPanel value="tab2">Panel 2</TabPanel>
        </button>
      </Tabs>
    );
    const tab1 = container.querySelector('[value="tab1"]');
    const tab2 = container.querySelector('[value="tab2"]');
    expect(tab1?.className).toContain('text-lav');
    expect(tab2?.className).toContain('text-fog');
  });
});