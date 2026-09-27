import { useState } from 'react'
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Article,
  Assignment,
  Chat,
  CheckCircle,
  CloudUpload,
  Dashboard as DashboardIcon,
  Delete,
  History,
  LibraryBooks,
  Lock,
  NoteAdd,
  Notifications,
  Person,
  Schedule,
  Search,
  Settings,
  Shield,
  TrendingUp,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { mockUsers } from './data/users'
import { addKnowledgeRecord, createKnowledgeRecord, deleteKnowledgeRecord, getKnowledgeDb } from './data/records'
import { getVisibleSidebarItems } from './data/sidebarState'

const rankOptions = ['장교', '부사관', '용사']

const summaryCards = [
  { label: '오늘 처리 업무', value: '18건', tone: 'primary', icon: CheckCircle },
  { label: '긴급 보고', value: '3건', tone: 'warning', icon: Notifications },
  { label: '재검토 문서', value: '5건', tone: 'secondary', icon: Article },
  { label: '업무 처리율', value: '92%', tone: 'success', icon: TrendingUp },
]

const tasks = [
  { title: '부대 인사 명단 점검', time: '09:30', status: '진행중' },
  { title: '방호 복무 일정 확정', time: '11:00', status: '대기' },
  { title: '월간 교육 보고서 작성', time: '14:00', status: '검토중' },
]

const initialChatMessages = []

const emptyRecordForm = {
  title: '',
  situation: '',
  incident: '',
  cause: '',
  action: '',
  result: '',
}

function App() {
  const [form, setForm] = useState({
    militaryNumber: '',
    password: '',
    rank: '장교',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [activeView, setActiveView] = useState('dashboard')
  const [recordDialogOpen, setRecordDialogOpen] = useState(false)
  const [recordForm, setRecordForm] = useState(emptyRecordForm)
  const [uploadFileName, setUploadFileName] = useState('')
  const [knowledgeList, setKnowledgeList] = useState(() => getKnowledgeDb())
  const [hasWrittenDocument, setHasWrittenDocument] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const user = mockUsers.find(
      (item) =>
        item.rank === form.rank &&
        item.militaryNumber === form.militaryNumber &&
        item.password === form.password,
    )

    if (!user) {
      setError('선택한 계급, 군번 또는 비밀번호가 올바르지 않습니다.')
      return
    }

    setError('')
    setUserInfo(user)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setForm({ militaryNumber: '', password: '', rank: '장교' })
    setError('')
    setUserInfo(null)
    setActiveView('dashboard')
    setRecordDialogOpen(false)
  }

  const handleRecordFieldChange = (event) => {
    const { name, value } = event.target
    setRecordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadFileName(file.name)
    }
  }

  const handleRecordSubmit = (event) => {
    event.preventDefault()

    const trimmedTitle = recordForm.title.trim()
    const trimmedSituation = recordForm.situation.trim()

    if (!trimmedTitle || !trimmedSituation) {
      return
    }

    const newKnowledge = createKnowledgeRecord({
      title: trimmedTitle,
      situation: trimmedSituation,
      incident: recordForm.incident.trim(),
      cause: recordForm.cause.trim(),
      action: recordForm.action.trim(),
      result: recordForm.result.trim(),
    })

    setKnowledgeList(addKnowledgeRecord(newKnowledge))
    setHasWrittenDocument(true)
    setRecordForm(emptyRecordForm)
    setUploadFileName('')
    setRecordDialogOpen(false)
    setActiveView('management')
  }

  const handleDeleteRecord = (id) => {
    setKnowledgeList(deleteKnowledgeRecord(id))
  }

  if (isLoggedIn && userInfo) {
    return (
      <AdminDashboard
        userInfo={userInfo}
        onLogout={handleLogout}
        activeView={activeView}
        onViewChange={setActiveView}
        recordDialogOpen={recordDialogOpen}
        onRecordDialogOpen={() => setRecordDialogOpen(true)}
        onRecordDialogClose={() => setRecordDialogOpen(false)}
        knowledgeList={knowledgeList}
        recordForm={recordForm}
        onRecordFieldChange={handleRecordFieldChange}
        onFileUpload={handleFileUpload}
        uploadFileName={uploadFileName}
        onRecordSubmit={handleRecordSubmit}
        onDeleteRecord={handleDeleteRecord}
        hasWrittenDocument={hasWrittenDocument}
      />
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)',
        px: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440, borderRadius: 4, boxShadow: 8 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Lock fontSize="large" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              부대 업무 AI
            </Typography>
            <Typography variant="body2" color="text.secondary">
              계급, 군번, 비밀번호를 입력해 주세요.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              <FormControl>
                <RadioGroup row name="rank" value={form.rank} onChange={handleChange}>
                  {rankOptions.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                label="군번"
                name="militaryNumber"
                value={form.militaryNumber}
                onChange={handleChange}
                placeholder="예: 23-12345"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="비밀번호"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호 입력"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>
                로그인
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

function AdminDashboard({
  userInfo,
  onLogout,
  activeView,
  onViewChange,
  recordDialogOpen,
  onRecordDialogOpen,
  onRecordDialogClose,
  knowledgeList,
  recordForm,
  onRecordFieldChange,
  onFileUpload,
  uploadFileName,
  onRecordSubmit,
  onDeleteRecord,
  hasWrittenDocument,
}) {
  const [chatMessages, setChatMessages] = useState(initialChatMessages)
  const [chatInput, setChatInput] = useState('')
  const [expandedRecords, setExpandedRecords] = useState({})

  const sideItems = getVisibleSidebarItems(
    [
      { id: 'record', label: '업무 해결 문서 작성', icon: NoteAdd },
      { id: 'dashboard', label: '대시보드', icon: DashboardIcon },
      { id: 'management', label: '업무 관리', icon: Assignment },
    ],
    hasWrittenDocument,
  )

  const getAiReplyFromKnowledge = (question) => {
    const trimmed = question.trim()
    if (!trimmed) {
      return { text: '질문을 입력해 주세요.', sourceTitle: null, sourceId: null }
    }

    const query = trimmed.toLowerCase()
    const tokens = query.split(/\s+/).filter(Boolean)

    const matches = knowledgeList.filter((item) => {
      const source = `${item.title} ${item.summary}`.toLowerCase()
      return tokens.every((token) => source.includes(token))
    })

    const resultList = matches.length > 0 ? matches : knowledgeList

    if (resultList.length === 0) {
      return {
        text: '업무 관리 목록에 관련 내용이 없습니다. 다른 키워드로 다시 물어봐 주세요.',
        sourceTitle: null,
        sourceId: null,
      }
    }

    const source = resultList[0]
    const summary = resultList.slice(0, 3).map((item) => `- ${item.title}: ${item.summary}`).join('\n')

    return {
      text: `업무 관리 기록을 기준으로 정리하면:\n${summary}`,
      sourceTitle: source.title,
      sourceId: source.id,
    }
  }

  const handleChatSubmit = () => {
    const trimmed = chatInput.trim()
    if (!trimmed) {
      return
    }

    setChatMessages((prev) => [...prev, { from: 'user', text: trimmed, meta: userInfo?.rank || '대대장' }])
    setChatInput('')

    const reply = getAiReplyFromKnowledge(trimmed)
    setChatMessages((prev) => [...prev, {
      from: 'assistant',
      text: reply.text,
      meta: 'AI 도우미',
      sourceTitle: reply.sourceTitle,
      sourceId: reply.sourceId,
    }])
  }

  const toggleExpandedRecord = (id) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6fb' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(15, 23, 42, 0.08)',
            bgcolor: '#0f172a',
            color: '#e2e8f0',
          },
        }}
      >
        <Toolbar sx={{ px: 2, py: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ bgcolor: '#2563eb', width: 36, height: 36 }}>
              <Shield fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff' }}>
                부대 업무 AI
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                관리자 포털
              </Typography>
            </Box>
          </Stack>
        </Toolbar>

        <List sx={{ px: 1.5, py: 1 }}>
          {sideItems.map(({ id, label, icon: Icon }) => {
            const isActive = id === 'management' ? activeView === 'management' || activeView === 'knowledge' : activeView === id

            return (
              <ListItem key={id} disablePadding>
                <ListItemButton
                  selected={isActive && id !== 'record' && id !== 'dashboard'}
                  onClick={() => {
                    if (id === 'record') {
                      onRecordDialogOpen()
                      return
                    }
                    onViewChange(id)
                  }}
                  sx={{
                    borderRadius: 2,
                    px: 1.5,
                    py: 1.25,
                    my: 0.35,
                    color: id === 'record' ? '#fff' : isActive && id !== 'dashboard' ? '#fff' : '#cbd5e1',
                    bgcolor: id === 'record' ? '#2563eb' : 'transparent',
                    boxShadow: id === 'record' ? '0 8px 20px rgba(37, 99, 235, 0.25)' : 'none',
                    '&:hover': {
                      bgcolor: id === 'record' ? '#1d4ed8' : 'rgba(148, 163, 184, 0.08)',
                    },
                    '&.Mui-selected': {
                      bgcolor: id === 'record' ? '#2563eb' : id === 'dashboard' ? 'transparent' : '#1d4ed8',
                      '&:hover': { bgcolor: id === 'record' ? '#1d4ed8' : id === 'dashboard' ? 'rgba(148, 163, 184, 0.08)' : '#1e40af' },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 28,
                      mr: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: id === 'record' ? '#fff' : isActive && id !== 'dashboard' ? '#fff' : '#cbd5e1',
                    }}
                  >
                  {id === 'record' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18 }}>
                      <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 700, color: '#fff', fontSize: 20 }}>+</Typography>
                    </Box>
                  ) : (
                    <Icon fontSize="small" />
                  )}
                </ListItemIcon>
                  <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: id === 'record' ? 700 : 500 }} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{ borderBottom: '1px solid rgba(15, 23, 42, 0.08)', bgcolor: 'rgba(255,255,255,0.9)' }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {activeView === 'record'
                  ? '업무 해결 문서 작성'
                  : activeView === 'knowledge'
                    ? '저장된 지식'
                    : '업무 대시보드'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userInfo?.rank} · {userInfo?.name}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
            
              <IconButton>
                <Notifications />
              </IconButton>
              <Button variant="outlined" color="primary" size="small" onClick={onLogout}>
                로그아웃
              </Button>
              <Avatar sx={{ bgcolor: '#0f766e', width: 34, height: 34 }}>{userInfo?.name?.[0]}</Avatar>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Dialog open={recordDialogOpen} onClose={onRecordDialogClose} maxWidth="md" fullWidth>
            <DialogTitle>부대 업무 기록하기</DialogTitle>
            <DialogContent>
              <Box component="form" id="record-dialog-form" onSubmit={onRecordSubmit} noValidate>
                <Stack spacing={2.5} sx={{ pt: 1 }}>
                  <TextField
                    fullWidth
                    label="제목"
                    name="title"
                    value={recordForm.title}
                    onChange={onRecordFieldChange}
                    placeholder="예: 교육 일정 지연 대응 기록"
                  />

                  <TextField
                    fullWidth
                    label="상황"
                    name="situation"
                    value={recordForm.situation}
                    onChange={onRecordFieldChange}
                    placeholder="업무 상황을 간단히 설명해 주세요."
                    multiline
                    minRows={3}
                  />

                  <TextField
                    fullWidth
                    label="발생 내용"
                    name="incident"
                    value={recordForm.incident}
                    onChange={onRecordFieldChange}
                    placeholder="어떤 상황이 발생했는지 작성해 주세요."
                    multiline
                    minRows={3}
                  />

                  <TextField
                    fullWidth
                    label="원인"
                    name="cause"
                    value={recordForm.cause}
                    onChange={onRecordFieldChange}
                    placeholder="발생 원인을 분석해 주세요."
                    multiline
                    minRows={3}
                  />

                  <TextField
                    fullWidth
                    label="조치 내용"
                    name="action"
                    value={recordForm.action}
                    onChange={onRecordFieldChange}
                    placeholder="조치 및 대응 내용을 작성해 주세요."
                    multiline
                    minRows={3}
                  />

                  <TextField
                    fullWidth
                    label="결과"
                    name="result"
                    value={recordForm.result}
                    onChange={onRecordFieldChange}
                    placeholder="결과와 개선점을 작성해 주세요."
                    multiline
                    minRows={3}
                  />

                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    파일 업로드
                    <input hidden type="file" onChange={onFileUpload} />
                  </Button>

                  {uploadFileName && (
                    <Chip label={uploadFileName} color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                  )}
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={onRecordDialogClose}>닫기</Button>
              <Button type="submit" form="record-dialog-form" variant="contained">
                기록 저장
              </Button>
            </DialogActions>
          </Dialog>

          {(activeView === 'knowledge' || activeView === 'management') && (
            <Stack spacing={2.5}>
              {knowledgeList.map((item) => {
                const detailEntries = [
                  ['상황', item.situation],
                  ['발생 내용', item.incident],
                  ['원인', item.cause],
                  ['조치 내용', item.action],
                  ['결과', item.result],
                ].filter(([, value]) => value && String(value).trim())

                const isExpanded = !!expandedRecords[item.id]

                return (
                  <Paper key={item.id} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(15, 23, 42, 0.05)' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5} sx={{ mb: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ bgcolor: '#dbeafe', color: '#1d4ed8' }}>
                          <History />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          flexShrink: 0,
                          ml: 1,
                        }}
                      >
                        {detailEntries.length > 0 && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => toggleExpandedRecord(item.id)}
                            sx={{
                              minWidth: 120,
                              px: 1.5,
                              py: 0.8,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                              boxShadow: '0 8px 18px rgba(37, 99, 235, 0.2)',
                              fontWeight: 700,
                              textTransform: 'none',
                              whiteSpace: 'nowrap',
                              display: 'inline-flex',
                              opacity: 1,
                              visibility: 'visible',
                              zIndex: 1,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                              },
                            }}
                          >
                            {isExpanded ? '접기' : '자세히 보기'}
                          </Button>
                        )}

                        <IconButton
                          edge="end"
                          aria-label="삭제하기"
                          onClick={() => onDeleteRecord(item.id)}
                          sx={{
                            color: '#dc2626',
                            border: '1px solid rgba(220, 38, 38, 0.2)',
                            bgcolor: '#fef2f2',
                            width: 36,
                            height: 36,
                            '&:hover': { bgcolor: '#fee2e2' },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: detailEntries.length > 0 ? 1.5 : 0 }}>
                      {item.summary}
                    </Typography>

                    {isExpanded && detailEntries.length > 0 && (
                      <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid rgba(15, 23, 42, 0.06)' }}>
                        <Stack spacing={1.5}>
                          {detailEntries.map(([label, value]) => (
                            <Box key={label}>
                              <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, display: 'block', mb: 0.4 }}>
                                {label}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#0f172a', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                                {value}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Paper>
                )
              })}
            </Stack>
          )}

          {activeView !== 'record' && activeView !== 'knowledge' && activeView !== 'management' && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '100%', maxWidth: 1000 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                  {summaryCards.map(({ label, value, tone, icon: Icon }) => (
                    <Card key={label} sx={{ flex: 1, borderRadius: 3 }}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">{label}</Typography>
                          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>{value}</Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor:
                              tone === 'primary'
                                ? '#dbeafe'
                                : tone === 'warning'
                                  ? '#fef3c7'
                                  : tone === 'success'
                                    ? '#dcfce7'
                                    : '#e2e8f0',
                            color:
                              tone === 'primary'
                                ? '#1d4ed8'
                                : tone === 'warning'
                                  ? '#b45309'
                                  : tone === 'success'
                                    ? '#15803d'
                                    : '#334155',
                          }}
                        >
                          <Icon fontSize="small" />
                        </Avatar>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>

                {!hasWrittenDocument && (
                  <Paper sx={{ p: 2.5, borderRadius: 4, mb: 2.5, border: '1px solid rgba(37, 99, 235, 0.12)', bgcolor: '#eff6ff' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="overline" color="primary.main">운영 알림</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>오늘의 부대 업무</Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<NoteAdd fontSize="inherit" />}
                        onClick={onRecordDialogOpen}
                        sx={{
                          whiteSpace: 'nowrap',
                          borderRadius: 1.5,
                          minWidth: 0,
                          px: 0.75,
                          py: 0.3,
                          fontSize: '0.65rem',
                          lineHeight: 1.2,
                          height: 28,
                          ml: 'auto',
                        }}
                      >
                        결과 문서 작성하기
                      </Button>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.8 }}>
                      보급 상태 점검과 근무 일정 확인이 완료되었으며, 추가로 확인해야 할 교육 준비와 인원 배치 사항만 정리하면 됩니다.
                    </Typography>
                  </Paper>
                )}

                <Paper sx={{ p: 3, borderRadius: 4, mb: 3, border: '1px solid rgba(15, 23, 42, 0.05)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      <Typography variant="overline" color="text.secondary">AI 업무 도우미</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>부대 행정 요약</Typography>
                    </Box>
                    <Chip label="실시간 연결" color="success" size="small" />
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  <Stack direction="row" spacing={1.5} sx={{ mt: 3, alignItems: 'stretch' }}>
                    <TextField
                      fullWidth
                      placeholder="업무를 입력하면 저장된 기록을 기준으로 답변합니다"
                      size="small"
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          handleChatSubmit()
                        }
                      }}
                      sx={{
                        bgcolor: '#f8fafc',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          height: '100%',
                          minHeight: 40,
                        },
                        flex: 1,
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<Chat />}
                      onClick={handleChatSubmit}
                      sx={{
                        px: 2,
                        minWidth: 88,
                        height: 40,
                        alignSelf: 'stretch',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      전송
                    </Button>
                  </Stack>
                </Paper>

                {chatMessages.length > 0 && (
                  <Stack spacing={2} sx={{ mt: 1, mb: 3 }}>
                    {chatMessages.map((message, index) => (
                      <Paper
                        key={`${message.meta}-${index}`}
                        elevation={0}
                        sx={{
                          p: 2.25,
                          borderRadius: 3,
                          border: '1px solid rgba(15, 23, 42, 0.08)',
                          bgcolor: message.from === 'user' ? '#e0f2fe' : '#f8fafc',
                          color: '#0f172a',
                          whiteSpace: 'pre-line',
                          boxShadow: 'none',
                          width: '100%',
                        }}
                      >
                        <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.75 }}>
                          {message.meta}
                        </Typography>

                        {message.from === 'assistant' && message.sourceTitle && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25, flexWrap: 'wrap' }}>
                            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700 }}>
                              출처
                            </Typography>
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => onViewChange('management')}
                              sx={{
                                minWidth: 0,
                                p: 0,
                                fontWeight: 700,
                                color: '#1d4ed8',
                                textTransform: 'none',
                                justifyContent: 'flex-start',
                              }}
                            >
                              {message.sourceTitle}
                            </Button>
                          </Box>
                        )}

                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: '1rem',
                            lineHeight: 1.8,
                          }}
                        >
                          {message.text}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  )
}

export default App
