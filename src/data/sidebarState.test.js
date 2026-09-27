import test from 'node:test'
import assert from 'node:assert/strict'

import { getVisibleSidebarItems, todayMissionList } from './sidebarState.js'

test('일일 부대 업무 목록을 확인할 수 있다', () => {
  assert.ok(Array.isArray(todayMissionList) && todayMissionList.length > 0)
})

test('업무 해결 문서를 작성하면 작성 메뉴가 사라진다', () => {
  const items = [
    { id: 'today', label: '오늘 부대 업무' },
    { id: 'record', label: '업무 해결 문서 작성' },
    { id: 'management', label: '업무 관리' },
  ]

  assert.deepEqual(
    getVisibleSidebarItems(items, false).map((item) => item.id),
    ['today', 'record', 'management'],
  )

  assert.deepEqual(
    getVisibleSidebarItems(items, true).map((item) => item.id),
    ['today', 'management'],
  )
})
