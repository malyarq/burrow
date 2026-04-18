import { describe, expect, it } from 'vitest'
import { createTranslator } from '../../contexts/settings/i18n'
import { formatTechnicalErrorDetails, toDisplayErrorMessage, unwrapTechnicalErrorMessage } from '../displayError'

describe('displayError helpers', () => {
  const t = createTranslator('en')
  const fallback = t('error.inline_fallback')

  it('removes IPC wrapper prefixes before showing a user-facing message', () => {
    expect(unwrapTechnicalErrorMessage('[share] importShare failed: Share backend unavailable')).toBe('Share backend unavailable')
    expect(toDisplayErrorMessage(new Error('[share] importShare failed: Share backend unavailable'), fallback)).toBe(
      'Share backend unavailable',
    )
  })

  it('falls back when the message still contains unresolved placeholders', () => {
    expect(toDisplayErrorMessage(new Error('[modpacks] loadVersions failed: ${file.jarVersion}'), fallback)).toBe(fallback)
  })

  it('falls back for mixed-language placeholder copy', () => {
    expect(toDisplayErrorMessage(new Error('Changelog будет загружен...'), fallback)).toBe(fallback)
  })

  it('prefers the stack for copied technical details', () => {
    const error = new Error('Disk is full')

    expect(formatTechnicalErrorDetails(error)).toContain('Disk is full')
  })
})
