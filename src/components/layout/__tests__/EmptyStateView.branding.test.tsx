// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LAUNCHER_MARK_PATH } from '../../../app/assets/branding'
import { EmptyStateView } from '../EmptyStateView'

vi.mock('../../../contexts/SettingsContext', () => ({
  useSettings: () => ({
    getAccentHex: () => '#10b981',
    getAccentStyles: () => ({ className: '', style: undefined }),
  }),
}))

describe('EmptyStateView brand contract', () => {
  it('uses the canonical product mark and wordmark instead of split raw branding', () => {
    render(<EmptyStateView iconPath={LAUNCHER_MARK_PATH} />)

    const mark = screen.getByTestId('empty-state-brand-mark')
    expect(mark.getAttribute('data-brand-role')).toBe('product-mark')
    expect(mark.closest('.brand-mark-frame')).toBeTruthy()
    expect(screen.getAllByText('FriendLauncher')).toHaveLength(1)
  })

  it('falls back to the launcher mark when a custom empty-state icon fails', () => {
    render(<EmptyStateView iconPath="/broken-empty-state.svg" />)

    const mark = screen.getByTestId('empty-state-brand-mark') as HTMLImageElement
    fireEvent.error(mark)

    expect(mark.src.endsWith(LAUNCHER_MARK_PATH)).toBe(true)
  })
})
