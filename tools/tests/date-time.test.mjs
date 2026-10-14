import assert from 'node:assert/strict'
import test from 'node:test'

import {
  formatDateTime,
  fromDateKey,
  getCalendarDays,
  shiftDate,
  shiftMonth,
  shiftTime,
  toDateKey,
} from '../../src/components/ui/date-time.utils.ts'

test('calendar uses six Monday-first weeks across year boundaries', () => {
  const days = getCalendarDays(2026, 0)
  assert.equal(days.length, 42)
  assert.equal(days[0].key, '2025-12-29')
  assert.equal(days[41].key, '2026-02-08')
  assert.equal(days.filter((day) => day.inMonth).length, 31)
})

test('February includes leap day only in leap years', () => {
  assert.equal(getCalendarDays(2024, 1).filter((day) => day.inMonth).length, 29)
  assert.equal(getCalendarDays(2025, 1).filter((day) => day.inMonth).length, 28)
})

test('keyboard month changes clamp the day rather than skipping February', () => {
  assert.equal(shiftMonth('2024-01-31', 1), '2024-02-29')
  assert.equal(shiftMonth('2025-01-31', 1), '2025-02-28')
  assert.equal(shiftMonth('2024-02-29', 12), '2025-02-28')
  assert.equal(shiftMonth('2026-01-01', -1), '2025-12-01')
})

test('date keys stay local and daily navigation crosses months and years', () => {
  assert.equal(toDateKey(fromDateKey('2026-10-14')), '2026-10-14')
  assert.equal(shiftDate('2026-12-31', 1), '2027-01-01')
  assert.equal(shiftDate('2024-03-01', -1), '2024-02-29')
})

test('minute controls carry into hours and wrap safely at midnight', () => {
  assert.deepEqual(shiftTime(11, 58, 5), { hours: 12, minutes: 3 })
  assert.deepEqual(shiftTime(0, 0, -5), { hours: 23, minutes: 55 })
  assert.deepEqual(shiftTime(23, 55, 5), { hours: 0, minutes: 0 })
  assert.equal(formatDateTime('2026-10-14', 9, 5), '14.10.2026, 09:05')
})
