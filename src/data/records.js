const STORAGE_KEY = 'military-knowledge-db'

export const initialKnowledge = [
  {
    id: 1,
    title: '훈련 일정 변경과 보급 준비 지연 조정',
    summary: '상급부대 일정 변경이 늦게 공유되고 보급 요청 현황도 여러 문서에 나뉘어 있어 훈련 준비가 반복해서 밀린 사례입니다. 담당자별 진행 상태와 마감 시점을 한 표로 모으고, 필수 물자부터 확인해 일정 충돌과 누락을 줄였습니다.',
    situation: '월간 훈련 계획이 확정된 뒤에도 장소와 시간이 여러 차례 바뀌었습니다. 보급 요청은 부서별로 따로 관리되고 있어 실제 도착 예정일과 수령 담당자를 한눈에 확인하기 어려웠으며, 훈련 준비와 일일 행정 업무가 겹쳐 담당자들의 확인 부담도 커졌습니다.',
    incident: '훈련을 앞두고 일부 물자의 수령 일정이 계획과 맞지 않는 사실이 뒤늦게 확인됐습니다. 변경된 일정이 이전 문서에 반영되지 않은 상태에서 준비가 진행되어 같은 내용을 다시 확인하고 보고하는 일이 발생했고, 최종 점검 시간도 부족해질 우려가 있었습니다.',
    cause: '일정 변경 사항을 전달하는 경로와 기준 시간이 정해져 있지 않았고, 요청·승인·수령 정보를 서로 다른 파일과 메신저에 나눠 기록한 것이 주된 원인이었습니다. 담당자가 바뀌거나 부재중일 때 진행 상황을 대신 확인할 수 있는 인수인계 자료도 부족했습니다.',
    action: '훈련 일정표에 변경 일시와 확인자를 표시하고, 각 물자의 요청 상태·예정 수령일·담당자를 하나의 점검표로 통합했습니다. 준비 항목을 필수와 후속 확인으로 구분해 우선순위를 정했으며, 일정 변경이 생기면 관련 담당자들이 같은 문서를 갱신한 뒤 확인 여부를 남기도록 했습니다.',
    result: '필수 준비물의 누락 여부와 지연 항목을 훈련 전에 확인할 수 있었고, 같은 내용을 여러 번 대조하는 시간이 줄었습니다. 이후 일정이 바뀌어도 변경 이력과 담당자를 따라갈 수 있게 되어 보고와 인수인계가 한결 수월해졌습니다.',
  },
  {
    id: 2,
    title: '휴가 집중 시기 당직 편성과 업무 공백 대응',
    summary: '휴가 신청이 특정 기간에 몰리면서 당직 편성, 일일 보고, 필수 행정 업무를 동시에 유지하기 어려웠던 사례입니다. 승인 기준과 최소 근무 인원을 미리 공유하고 대체 담당자 및 인수인계 항목을 정리해 특정 인원에게 업무가 과도하게 집중되는 문제를 완화했습니다.',
    situation: '명절과 정기 휴가 기간이 겹치면서 여러 인원이 비슷한 날짜에 휴가를 신청했습니다. 부서마다 처리해야 하는 정기 보고와 당직 일정은 그대로 유지해야 했지만, 실제 근무 가능 인원과 업무별 대체 담당자를 함께 확인할 수 있는 자료가 없어 승인과 편성 때마다 재조정이 필요했습니다.',
    incident: '휴가 승인 후 당직표를 다시 작성하는 과정에서 특정 날짜의 근무 인원이 부족하고, 일부 정기 보고 업무를 대신 처리할 사람이 지정되지 않은 점이 확인됐습니다. 기존 담당자에게 휴가 중 연락이 가거나 남은 인원에게 추가 근무와 보고 업무가 몰릴 가능성도 제기됐습니다.',
    cause: '휴가 신청, 당직표, 업무별 담당자 목록을 따로 관리해 서로의 변경 사항이 제때 반영되지 않았습니다. 대체 근무 가능 여부와 업무 숙련도를 사전에 확인하지 않았고, 승인 우선순위도 일관되게 공유되지 않아 조정 과정에서 불필요한 문의가 반복됐습니다.',
    action: '기간별 근무 가능 인원과 필수 업무를 먼저 확인한 뒤, 승인 기준과 최소 근무 인원을 부서에 공지했습니다. 당직표에는 주 담당자와 대체 담당자를 함께 표시하고, 휴가 전에 미결 업무·보고 기한·인계받을 자료를 확인하는 간단한 인수인계 항목을 마련했습니다. 변경 사항은 공용 일정표에 즉시 반영하도록 했습니다.',
    result: '휴가 일정과 당직 편성의 충돌을 승인 전에 발견할 수 있었고, 담당자 부재 중에도 정기 업무가 중단되지 않도록 대체 경로를 마련했습니다. 근무 조정 기준이 공유되어 반복 문의와 막판 재편성이 줄었으며, 잔여 인원에게 업무가 편중되는 상황도 완화됐습니다.',
  },
  {
    id: 3,
    title: '물자 현황 불일치와 점검 기록 인수인계 개선',
    summary: '실물 물자 수량과 장부 기록이 맞지 않고 점검 이력이 담당자별 문서에 흩어져 원인 확인과 후속 조치가 늦어진 사례입니다. 기준일을 정해 실물·장부를 함께 대조하고, 차이 사유와 조치 담당자 및 완료 예정일을 기록해 재확인 부담을 낮췄습니다.',
    situation: '정기 재물 확인을 준비하면서 보관 장소별 물자 현황, 대여 내역, 수리 요청 목록을 취합해야 했습니다. 일부 기록은 종이 점검표에, 일부는 개인 파일에 남아 있었고 기록 시점도 서로 달라 현재 보유 수량과 사용 가능 여부를 즉시 판단하기 어려웠습니다.',
    incident: '점검 중 장부상 수량과 실물 수량에 차이가 있는 항목이 발견됐지만, 이전 점검 기록과 대여·반납 내역이 연결되어 있지 않아 어느 시점부터 차이가 발생했는지 바로 확인되지 않았습니다. 동시에 수리 의뢰 후 상태가 갱신되지 않은 물자도 있어 사용 가능 여부를 담당자에게 다시 문의해야 했습니다.',
    cause: '물자 이동이나 대여가 발생했을 때 기록을 갱신하는 담당자와 기한이 명확하지 않았고, 점검표마다 항목 이름과 상태 표시 방식도 달랐습니다. 담당자 교체 시 미결 수리 건과 추가 확인 사항을 함께 넘기는 절차가 없어 같은 확인 작업이 반복됐습니다.',
    action: '기준일을 정해 보관 장소별 실물 수량과 장부를 함께 확인하고, 차이가 있는 항목은 즉시 임의 수정하지 않고 사유·확인자·후속 조치 담당자를 별도 기록했습니다. 점검 항목과 상태 표기를 통일했으며, 대여·반납 및 수리 상태를 갱신할 담당자와 처리 기한을 지정해 다음 점검 때 진행 상황을 확인하도록 했습니다.',
    result: '수량 차이와 수리 대기 항목을 구분해 보고할 수 있었고, 무엇을 누구에게 언제까지 확인해야 하는지 명확해졌습니다. 점검 이력이 한곳에 쌓여 담당자가 바뀌어도 이전 조치와 미결 사항을 이어받기 쉬워졌으며, 반복적인 재확인과 누락 위험도 줄었습니다.',
  },
]

const getDefaultKnowledge = () => [...initialKnowledge]

export const getKnowledgeDb = () => {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getDefaultKnowledge()))
    return getDefaultKnowledge()
  }

  try {
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getDefaultKnowledge()
    }

    const defaultsById = new Map(initialKnowledge.map((record) => [record.id, record]))
    const refreshed = parsed.map((record) => {
      const defaultRecord = defaultsById.get(record.id)
      return defaultRecord ? { ...record, ...defaultRecord } : record
    })

    if (JSON.stringify(refreshed) !== JSON.stringify(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed))
    }

    return refreshed
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getDefaultKnowledge()))
    return getDefaultKnowledge()
  }
}

export const knowledgeDb = getKnowledgeDb()

export const createKnowledgeRecord = ({
  title,
  situation,
  incident,
  cause,
  action,
  result,
  workDateTime,
  assignee,
  completionResult,
  specialNotes,
  attachmentName,
}) => ({
  id: Date.now(),
  title: (title || '').trim(),
  summary: (completionResult || '').trim() || (situation || '').trim() || '업무 기록이 저장되었습니다.',
  situation: (situation || '').trim(),
  incident: (incident || '').trim(),
  cause: (cause || '').trim(),
  action: (action || completionResult || '').trim(),
  result: (result || completionResult || '').trim(),
  workDateTime: (workDateTime || '').trim(),
  assignee: (assignee || '').trim(),
  completionResult: (completionResult || '').trim(),
  specialNotes: (specialNotes || '').trim(),
  attachmentName: (attachmentName || '').trim(),
})

export const addKnowledgeRecord = (record) => {
  const current = getKnowledgeDb()
  const next = [record, ...current]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export const deleteKnowledgeRecord = (id) => {
  const current = getKnowledgeDb()
  const next = current.filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export const getCompletedWorkRecords = (records) =>
  records.filter((record) => Boolean(record.completionResult?.trim()))
