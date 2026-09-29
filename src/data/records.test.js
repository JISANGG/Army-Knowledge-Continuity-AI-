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

const { createKnowledgeRecord, getCompletedWorkRecords } = await import('./records.js')

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
