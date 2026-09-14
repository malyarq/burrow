// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SettingsProvider } from '../../../contexts/SettingsContext'
import { AppearanceTab } from '../tabs/AppearanceTab'

describe('AppearanceTab brand contract', () => {
  it('keeps appearance guidance focused on presets and accent behavior without a dedicated brand card', () => {
    render(
      <SettingsProvider>
        <AppearanceTab />
      </SettingsProvider>,
    )

    expect(screen.queryByTestId('appearance-brand-system-card')).toBeNull()
    expect(screen.getByTestId('appearance-branding').getAttribute('data-appearance-owner')).toBe('branding')
    expect(screen.getByLabelText('Theme Presets')).toBeTruthy()
    expect((screen.getByLabelText('Theme Presets') as HTMLSelectElement).value).toBe('default')
    expect(
      screen.getByText(/The accent highlights buttons, selections and focus. It does not change the background/i),
    ).toBeTruthy()
    screen.getByRole('button', { name: 'Background Effects' }).click()
    expect(
      screen.getByText(/Background controls repaint the shell frame and backdrop around this modal/i),
    ).toBeTruthy()
  })
})
