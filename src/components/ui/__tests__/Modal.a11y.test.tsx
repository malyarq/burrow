// @vitest-environment jsdom

import { createRef, useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Modal } from '../Modal';

function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('Modal accessibility', () => {
  beforeEach(() => {
    mockMatchMedia(false);
    document.body.className = '';
  });

  it('renders an accessible dialog, traps focus, and restores focus on close', async () => {
    const Harness = () => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div>
          <button type="button" onClick={() => setIsOpen(true)}>
            Open modal
          </button>
          <button type="button">Outside action</button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Settings dialog">
            <input autoFocus aria-label="Account name" />
            <button type="button">Save changes</button>
          </Modal>
        </div>
      );
    };

    render(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Open modal' });
    const focusSpy = vi.spyOn(trigger, 'focus');
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Settings dialog' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');

    const input = screen.getByRole('textbox', { name: 'Account name' });
    const save = screen.getByRole('button', { name: 'Save changes' });
    const close = screen.getByRole('button', { name: 'Close dialog' });

    await waitFor(() => {
      expect(document.activeElement).toBe(input);
    });

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(save);

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(close);

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(input);

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    await waitFor(() => {
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  it('skips closed disclosures, hidden pickers and negative tab indices in its focus loop', async () => {
    render(<Modal isOpen onClose={vi.fn()} title="Appearance">
      <div hidden><input aria-label="Closed surface color" /></div>
      <input type="file" style={{ display: 'none' }} aria-label="Import file" />
      <input tabIndex={-1} aria-label="Programmatic picker" />
      <button type="button">Theme</button>
      <button type="button">Done</button>
    </Modal>);
    const theme = screen.getByRole('button', { name: 'Theme' });
    await waitFor(() => expect(document.activeElement).toBe(theme));
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Done' }));
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close dialog' }));
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(theme);
  });

  it('forwards modal body props and refs for flow-owned scroll handling', async () => {
    const onScroll = vi.fn();
    const bodyRef = createRef<HTMLDivElement>();

    render(
      <Modal
        isOpen
        onClose={vi.fn()}
        title="Flow modal"
        bodyRef={bodyRef}
        bodyProps={{ onScroll }}
      >
        <button type="button">Primary action</button>
      </Modal>,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Flow modal' });
    const modalBody = dialog.querySelector<HTMLElement>('[data-modal-body="true"]');

    expect(bodyRef.current).toBe(modalBody);
    expect(modalBody).toBeTruthy();
    expect(dialog.contains(modalBody as HTMLElement)).toBe(true);

    fireEvent.scroll(modalBody as HTMLElement);
    expect(onScroll).toHaveBeenCalled();
  });

  it('lets only the topmost nested modal handle Escape', async () => {
    const closeOuter = vi.fn();
    const closeInner = vi.fn();

    render(
      <Modal isOpen onClose={closeOuter} title="Outer dialog">
        <Modal isOpen onClose={closeInner} title="Inner dialog">
          <button type="button">Inner action</button>
        </Modal>
      </Modal>,
    );

    await screen.findByRole('dialog', { name: 'Inner dialog' });
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(closeInner).toHaveBeenCalledTimes(1);
    expect(closeOuter).not.toHaveBeenCalled();
  });
});
