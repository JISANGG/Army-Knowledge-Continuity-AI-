import test from 'node:test'
import assert from 'node:assert/strict'

import { getVisibleSidebarItems, todayMissionList } from './sidebarState.js'

test('일일 부대 업무 목록을 확인할 수 있다', () => {
  assert.ok(Array.isArray(todayMissionList) && todayMissionList.length > 0)
})

test('오늘의 업무 결과 문서를 작성해도 작성 메뉴가 유지된다', () => {
  const items = [
    { id: 'today', label: '오늘 부대 업무' },
    { id: 'record', label: '오늘의 업무 작성하기' },
    { id: 'knowledge', label: '저장된 지식' },
  ]

  assert.deepEqual(
    getVisibleSidebarItems(items).map((item) => item.id),
    ['today', 'record', 'knowledge'],
  )
})
