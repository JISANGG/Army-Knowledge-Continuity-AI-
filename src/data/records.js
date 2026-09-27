const STORAGE_KEY = 'military-knowledge-db'

export const initialKnowledge = [
  {
    id: 1,
    title: '교육 일정 보급 지침',
    summary: '교육 일정표와 보급 수량을 연동해 3주차 점검을 우선 수행할 수 있도록 정리함.',
    situation: '교육 일정이 점검 일정과 보급 물자 도착 시점을 연동해야 한다.',
    incident: '교육 전반이 보급 현황과 맞지 않아 준비가 지연될 가능성이 있었다.',
    cause: '보급 대기 시간과 교육 일정이 분리되어 있어 조정이 늦어졌기 때문이다.',
    action: '3주차 점검을 우선 수행하고 일정표와 보급 수량을 정렬해 재배치했다.',
    result: '교육 준비가 안정적으로 진행되었고, 보급 누락 위험이 크게 감소했다.',
  },
  {
    id: 2,
    title: '휴가 계획 관리',
    summary: '인원 충원표를 기준으로 휴가 승인 우선순위를 정리해 비상 근무 공백을 최소화한 사례.',
    situation: '여름 휴가 시즌에 인원 편제가 불안정해 보안 근무 공백이 우려되었다.',
    incident: '휴가 신청이 한꺼번에 몰리면서 비상 근무 인력 배치가 어려웠다.',
    cause: '개별 부서별 승인 순서가 통일되지 않아 인력 분산이 불균형했다.',
    action: '인원 충원표를 기준으로 우선순위를 정리하고 대체 근무표를 보완했다.',
    result: '휴가 승인과 비상 근무의 균형이 유지되면서 공백이 최소화되었다.',
  },
  {
    id: 3,
    title: '장비 점검 체크리스트',
    summary: '보급 장비별 점검 항목과 결과를 기록해 추후 유지보수 우선순위를 정리한 문서.',
    situation: '보급 장비의 정기 점검 항목을 체계적으로 유지해야 한다.',
    incident: '점검 기록이 분산되어 일부 장비의 상태를 빠르게 확인하기 어려웠다.',
    cause: '점검 결과를 한곳에 정리하지 않아 유지보수 우선순위 판단이 늦어졌다.',
    action: '장비별 점검 항목과 결과를 기록표로 정리해 유지보수 우선순위를 체계화했다.',
    result: '장비 상태 파악 속도가 향상되고, 유지보수 계획 수립이 더 정확해졌다.',
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
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultKnowledge()
  } catch (error) {
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
}) => ({
  id: Date.now(),
  title: (title || '').trim(),
  summary: (situation || '').trim() || '업무 기록이 저장되었습니다.',
  situation: (situation || '').trim(),
  incident: (incident || '').trim(),
  cause: (cause || '').trim(),
  action: (action || '').trim(),
  result: (result || '').trim(),
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
