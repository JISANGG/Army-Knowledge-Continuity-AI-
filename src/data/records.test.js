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

const { createKnowledgeRecord } = await import('./records.js')

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
