import test from 'node:test'
import assert from 'node:assert/strict'

globalThis.localStorage = {
  store: {},
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null
  },
  setItem(key, value) {
    this.store[key] = String(value)
  },
  removeItem(key) {
    delete this.store[key]
  },
}

const { createKnowledgeRecord, getCompletedWorkRecords, getKnowledgeDb, initialKnowledge } = await import('./records.js')

test('createKnowledgeRecord preserves full record details', () => {
  const record = createKnowledgeRecord({
    title: '교육 일정 지연 대응',
    situation: '교육 준비가 늦어지고 있다.',
    incident: '장비 반출이 지연됐습니다.',
    cause: '보급 지연',
    action: '대체 수순을 정리했습니다.',
    result: '교육 일정을 유지했습니다.',
  })

  assert.equal(record.title, '교육 일정 지연 대응')
  assert.equal(record.summary, '교육 준비가 늦어지고 있다.')
  assert.equal(record.incident, '장비 반출이 지연됐습니다.')
  assert.equal(record.cause, '보급 지연')
  assert.equal(record.action, '대체 수순을 정리했습니다.')
  assert.equal(record.result, '교육 일정을 유지했습니다.')
})

test('createKnowledgeRecord preserves result document fields', () => {
  const record = createKnowledgeRecord({
    title: '장비 점검',
    workDateTime: '2026-09-29T14:30',
    assignee: '김대위',
    completionResult: '점검 완료',
    specialNotes: '추가 이상 없음',
  })

  assert.equal(record.title, '장비 점검')
  assert.equal(record.workDateTime, '2026-09-29T14:30')
  assert.equal(record.assignee, '김대위')
  assert.equal(record.completionResult, '점검 완료')
  assert.equal(record.specialNotes, '추가 이상 없음')
  assert.equal(record.summary, '점검 완료')
})

test('structured result documents preserve requested details and count as completed', () => {
  const record = createKnowledgeRecord({
    title: '훈련 보급 일정 조정',
    workDateTime: '2026-09-29T14:30',
    situation: '훈련 일정 변경으로 보급 준비가 지연됐다.',
    incident: '일부 물자가 예정일보다 늦게 도착했다.',
    cause: '변경된 일정이 요청 문서에 반영되지 않았다.',
    action: '필수 물자부터 재확인하고 담당자를 지정했다.',
    result: '훈련 전 물자 준비를 완료했다.',
    completionResult: '훈련 전 물자 준비를 완료했다.',
    attachmentName: 'supply-checklist.pdf',
  })

  assert.equal(record.situation, '훈련 일정 변경으로 보급 준비가 지연됐다.')
  assert.equal(record.incident, '일부 물자가 예정일보다 늦게 도착했다.')
  assert.equal(record.cause, '변경된 일정이 요청 문서에 반영되지 않았다.')
  assert.equal(record.action, '필수 물자부터 재확인하고 담당자를 지정했다.')
  assert.equal(record.result, '훈련 전 물자 준비를 완료했다.')
  assert.equal(record.attachmentName, 'supply-checklist.pdf')
  assert.deepEqual(getCompletedWorkRecords([record]), [record])
})

test('createKnowledgeRecord preserves knowledge attachment name', () => {
  const record = createKnowledgeRecord({
    title: '장비 점검 기록',
    situation: '장비를 정기 점검했다.',
    incident: '이상 없음',
    cause: '정기 점검',
    action: '점검표를 작성했다.',
    result: '점검 완료',
    attachmentName: 'inspection.pdf',
  })

  assert.equal(record.attachmentName, 'inspection.pdf')
})

test('getCompletedWorkRecords includes only records with a completion result', () => {
  const completed = createKnowledgeRecord({
    title: '장비 점검',
    completionResult: '점검 완료',
  })
  const unfinished = createKnowledgeRecord({ title: '교육 준비' })

  assert.deepEqual(getCompletedWorkRecords([completed, unfinished]), [completed])
})

test('getKnowledgeDb refreshes built-in records and preserves custom records', () => {
  const customRecord = { id: 12345, title: '사용자 기록', summary: '직접 추가한 업무 기록' }
  globalThis.localStorage.setItem('military-knowledge-db', JSON.stringify([
    { id: 1, title: '이전 기본 기록', summary: '저장돼 있던 짧은 내용' },
    customRecord,
  ]))

  const records = getKnowledgeDb()
  const savedRecords = JSON.parse(globalThis.localStorage.getItem('military-knowledge-db'))

  assert.equal(records[0].title, initialKnowledge[0].title)
  assert.equal(records[0].summary, initialKnowledge[0].summary)
  assert.deepEqual(records[1], customRecord)
  assert.deepEqual(savedRecords, records)
})
