import { useEffect, useState } from 'react'
import {
  Alert,
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
  Add,
  Bookmark,
  Send,
  CheckCircle,
  CloudUpload,
  Dashboard as DashboardIcon,
  Delete,
  Lock,
  NoteAdd,
  Notifications,
  Person,
  Shield,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { mockUsers } from './data/users'
import { addKnowledgeRecord, createKnowledgeRecord, deleteKnowledgeRecord, getCompletedWorkRecords, getKnowledgeDb } from './data/records'
import { getVisibleSidebarItems } from './data/sidebarState'
import SoldierVersionPage from './SoldierVersionPage'

const rankOptions = ['장교', '부사관', '용사']

const summaryCards = [
  { label: '저장된 지식', value: '18건', tone: 'primary', icon: Bookmark },
  { label: '완료된 업무', value: '3건', tone: 'warning', icon: CheckCircle },
]

const initialChatMessages = []

const emptyTodayWorkForm = {
  title: '',
  purpose: '',
  specialNotes: '',
}

const emptyResultDocumentForm = {
  title: '',
  workDateTime: '',
  situation: '',
  incident: '',
  cause: '',
  action: '',
  result: '',
}

const emptyKnowledgeForm = {
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
  const [showSoldierVersion, setShowSoldierVersion] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [activeView, setActiveView] = useState('dashboard')
  const [todayWorkDialogOpen, setTodayWorkDialogOpen] = useState(false)
  const [resultDocumentDialogOpen, setResultDocumentDialogOpen] = useState(false)
  const [knowledgeDialogOpen, setKnowledgeDialogOpen] = useState(false)
  const [todayWorkForm, setTodayWorkForm] = useState(emptyTodayWorkForm)
  const [resultDocumentForm, setResultDocumentForm] = useState(emptyResultDocumentForm)
  const [knowledgeForm, setKnowledgeForm] = useState(emptyKnowledgeForm)
  const [todayWorkUploadFileName, setTodayWorkUploadFileName] = useState('')
  const [resultDocumentUploadFileName, setResultDocumentUploadFileName] = useState('')
  const [knowledgeUploadFileName, setKnowledgeUploadFileName] = useState('')
  const [knowledgeList, setKnowledgeList] = useState(() => getKnowledgeDb())
  const [todayWorkDocument, setTodayWorkDocument] = useState(null)
  const [todayResultDocument, setTodayResultDocument] = useState(null)

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

    if (form.rank === '용사') {
      setIsLoggedIn(false)
      setShowSoldierVersion(true)
      return
    }

    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowSoldierVersion(false)
    setForm({ militaryNumber: '', password: '', rank: '장교' })
    setError('')
    setUserInfo(null)
    setActiveView('dashboard')
    setTodayWorkDialogOpen(false)
    setResultDocumentDialogOpen(false)
    setKnowledgeDialogOpen(false)
    setResultDocumentUploadFileName('')
  }

  const handleTodayWorkFieldChange = (event) => {
    const { name, value } = event.target
    setTodayWorkForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleTodayWorkFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setTodayWorkUploadFileName(file.name)
    }
  }

  const handleTodayWorkSubmit = (event) => {
    event.preventDefault()

    const title = todayWorkForm.title.trim()
    const purpose = todayWorkForm.purpose.trim()

    if (!title || !purpose) {
      return
    }

    setTodayWorkDocument({
      title,
      purpose,
      specialNotes: todayWorkForm.specialNotes.trim(),
      fileName: todayWorkUploadFileName,
    })
    setTodayResultDocument(null)
    setTodayWorkForm(emptyTodayWorkForm)
    setTodayWorkUploadFileName('')
    setTodayWorkDialogOpen(false)
    setActiveView('dashboard')
  }

  const handleResultDocumentFieldChange = (event) => {
    const { name, value } = event.target
    setResultDocumentForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleResultDocumentFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setResultDocumentUploadFileName(file.name)
    }
  }

  const handleResultDocumentSubmit = (event) => {
    event.preventDefault()

    const title = resultDocumentForm.title.trim()
    const workDateTime = resultDocumentForm.workDateTime.trim()
    const situation = resultDocumentForm.situation.trim()
    const incident = resultDocumentForm.incident.trim()
    const cause = resultDocumentForm.cause.trim()
    const action = resultDocumentForm.action.trim()
    const result = resultDocumentForm.result.trim()

    if (!title || !workDateTime || !situation || !incident || !cause || !action || !result) {
      return
    }

    const newKnowledge = createKnowledgeRecord({
      title,
      workDateTime,
      situation,
      incident,
      cause,
      action,
      result,
      completionResult: result,
      attachmentName: resultDocumentUploadFileName,
    })

    setKnowledgeList(addKnowledgeRecord(newKnowledge))
    setTodayWorkDocument(null)
    setTodayResultDocument(null)
    setResultDocumentForm(emptyResultDocumentForm)
    setResultDocumentUploadFileName('')
    setResultDocumentDialogOpen(false)
    setActiveView('completed')
  }

  const handleKnowledgeFieldChange = (event) => {
    const { name, value } = event.target
    setKnowledgeForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleKnowledgeFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setKnowledgeUploadFileName(file.name)
    }
  }

  const handleKnowledgeSubmit = (event) => {
    event.preventDefault()

    const title = knowledgeForm.title.trim()
    const situation = knowledgeForm.situation.trim()
    const incident = knowledgeForm.incident.trim()
    const cause = knowledgeForm.cause.trim()
    const action = knowledgeForm.action.trim()
    const result = knowledgeForm.result.trim()

    if (!title || !situation || !incident || !cause || !action || !result) {
      return
    }

    const newKnowledge = createKnowledgeRecord({
      title,
      situation,
      incident,
      cause,
      action,
      result,
      attachmentName: knowledgeUploadFileName,
    })

    setKnowledgeList(addKnowledgeRecord(newKnowledge))
    setKnowledgeForm(emptyKnowledgeForm)
    setKnowledgeUploadFileName('')
    setKnowledgeDialogOpen(false)
    setActiveView('knowledge')
  }

  const handleDeleteRecord = (id) => {
    setKnowledgeList(deleteKnowledgeRecord(id))
  }

  if (showSoldierVersion) {
    return <SoldierVersionPage userInfo={userInfo} onLogout={handleLogout} />
  }

  if (isLoggedIn && userInfo) {
    return (
      <AdminDashboard
        userInfo={userInfo}
        onLogout={handleLogout}
        activeView={activeView}
        onViewChange={setActiveView}
        todayWorkDialogOpen={todayWorkDialogOpen}
        onTodayWorkDialogOpen={() => setTodayWorkDialogOpen(true)}
        onTodayWorkDialogClose={() => setTodayWorkDialogOpen(false)}
        onTodayWorkSubmit={handleTodayWorkSubmit}
        todayWorkForm={todayWorkForm}
        onTodayWorkFieldChange={handleTodayWorkFieldChange}
        onTodayWorkFileUpload={handleTodayWorkFileUpload}
        todayWorkUploadFileName={todayWorkUploadFileName}
        resultDocumentDialogOpen={resultDocumentDialogOpen}
        onResultDocumentDialogOpen={() => {
          setResultDocumentForm((prev) => ({ ...prev, title: todayWorkDocument?.title || prev.title }))
          setResultDocumentDialogOpen(true)
        }}
        onResultDocumentDialogClose={() => setResultDocumentDialogOpen(false)}
        onResultDocumentSubmit={handleResultDocumentSubmit}
        resultDocumentForm={resultDocumentForm}
        onResultDocumentFieldChange={handleResultDocumentFieldChange}
        onResultDocumentFileUpload={handleResultDocumentFileUpload}
        resultDocumentUploadFileName={resultDocumentUploadFileName}
        knowledgeDialogOpen={knowledgeDialogOpen}
        onKnowledgeDialogOpen={() => setKnowledgeDialogOpen(true)}
        onKnowledgeDialogClose={() => setKnowledgeDialogOpen(false)}
        onKnowledgeSubmit={handleKnowledgeSubmit}
        knowledgeForm={knowledgeForm}
        onKnowledgeFieldChange={handleKnowledgeFieldChange}
        onKnowledgeFileUpload={handleKnowledgeFileUpload}
        knowledgeUploadFileName={knowledgeUploadFileName}
        knowledgeList={knowledgeList}
        onDeleteRecord={handleDeleteRecord}
        todayWorkDocument={todayWorkDocument}
        todayResultDocument={todayResultDocument}
      />
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
        '& .MuiTypography-root, & .MuiButton-root, & .MuiInputBase-root, & .MuiInputLabel-root, & .MuiFormControlLabel-label, & .MuiAlert-message': {
          fontFamily: 'Paperozi',
        },
      }}
    >
      <Box
        component="nav"
        aria-label="메인 메뉴"
        sx={{
          width: '100%',
          minHeight: 72,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, md: 3 },
          bgcolor: '#fff',
          '& .MuiTypography-root': { fontFamily: 'Paperozi' },
        }}
      >
        <Toolbar disableGutters sx={{ height: '80px', px: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ bgcolor: '#2563eb', width: 36, height: 36 }}>
              <Shield fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontSize:'20px',color: '#0f172a' }}>
                부대 지식 영속화 AI
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </Box>

      <Box sx={{  mb:20,flex: 1, width: '100%', display: 'grid', placeItems: 'center', px: 2, py: { xs: 3, sm: 4 }, bgcolor: '#fff' }}>
      <Card sx={{ width: '100%', maxWidth: 800, borderRadius: 0, border: 'none', boxShadow: 'none', bgcolor: 'transparent' }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              부대 지식과 경험을 AI가 찾아드립니다.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mx: { xs: 6, sm: 7 } }}>
            <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              TACS 계급, 군번, 비밀번호를 입력해 주세요.
            </Typography>
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
    </Box>
  )
}

function AdminDashboard({
  userInfo,
  onLogout,
  activeView,
  onViewChange,
  todayWorkDialogOpen,
  onTodayWorkDialogOpen,
  onTodayWorkDialogClose,
  onTodayWorkSubmit,
  todayWorkForm,
  onTodayWorkFieldChange,
  onTodayWorkFileUpload,
  todayWorkUploadFileName,
  resultDocumentDialogOpen,
  onResultDocumentDialogOpen,
  onResultDocumentDialogClose,
  onResultDocumentSubmit,
  resultDocumentForm,
  onResultDocumentFieldChange,
  onResultDocumentFileUpload,
  resultDocumentUploadFileName,
  knowledgeDialogOpen,
  onKnowledgeDialogOpen,
  onKnowledgeDialogClose,
  onKnowledgeSubmit,
  knowledgeForm,
  onKnowledgeFieldChange,
  onKnowledgeFileUpload,
  knowledgeUploadFileName,
  knowledgeList,
  onDeleteRecord,
  todayWorkDocument,
  todayResultDocument,
}) {
  const [chatMessages, setChatMessages] = useState(initialChatMessages)
  const [chatInput, setChatInput] = useState('')
  const [expandedRecords, setExpandedRecords] = useState({})
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 8)
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })

    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  const completedWorkCount = getCompletedWorkRecords(knowledgeList).length
  const dashboardSummaryCards = summaryCards.map((card) => {
    if (card.label === '저장된 지식') {
      return { ...card, value: `${knowledgeList.length}건` }
    }
    if (card.label === '완료된 업무') {
      return { ...card, value: `${completedWorkCount}건` }
    }
    return card
  })

  const sideItems = getVisibleSidebarItems(
    [
      { id: 'dashboard', label: '대시보드', icon: DashboardIcon },
      { id: 'completed', label: '완료된 업무', icon: CheckCircle },
      { id: 'knowledge', label: '저장된 지식', icon: Bookmark },
    ],
  )
  const displayedRecords = activeView === 'completed'
    ? getCompletedWorkRecords(knowledgeList)
    : knowledgeList

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

  const handleNewChat = () => {
    setChatMessages([])
    setChatInput('')
  }

  const toggleExpandedRecord = (id) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6fb' }}>
      <Box
        component="nav"
        aria-label="메인 메뉴"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          width: '100%',
          flexShrink: 0,
          bgcolor: hasScrolled ? '#e8ecf2' : '#f4f6fb',
          color: '#0f172a',
          borderBottom: hasScrolled ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid transparent',
          boxShadow: hasScrolled ? '0 4px 16px rgba(15, 23, 42, 0.08)' : 'none',
          transition: 'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
          '& .MuiTypography-root': { fontFamily: 'Paperozi' },
        }}
      >
        <Box
          sx={{
            minHeight: 72,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              sm: 'minmax(0, 1fr) auto',
              lg: 'minmax(0, 1fr) auto minmax(0, 1fr)',
            },
            alignItems: 'center',
            gap: { xs: 0.5, md: 2 },
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 0 },
          }}
        >
          <Toolbar disableGutters sx={{ gridColumn: 1, minHeight: '64px !important', flexShrink: 0, px: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar sx={{ bgcolor: '#2563eb', width: 36, height: 36 }}>
                <Shield fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  부대 지식 영속화 AI
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  간부 포털
                </Typography>
              </Box>
            </Stack>
          </Toolbar>

          <List
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gridColumn: { xs: 1, sm: '1 / -1', lg: 2 },
              justifySelf: { xs: 'stretch', lg: 'center' },
              justifyContent: { xs: 'flex-start', sm: 'center' },
              gap: 0.5,
              p: 0,
              minWidth: 0,
              width: { xs: '100%', lg: 'auto' },
              overflowX: 'auto',
              '& .MuiListItemButton-root': { whiteSpace: 'nowrap' },
            }}
          >
            {sideItems.map(({ id, label, icon: Icon }) => (
              <ListItem key={id} disablePadding sx={{ width: 'auto', flexShrink: 0 }}>
                <ListItemButton
                  onClick={() => onViewChange(id)}
                  sx={{
                    borderRadius: 2,
                    px: 1.5,
                    py: 1.25,
                    color: '#334155',
                    bgcolor: 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(15, 23, 42, 0.06)',
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
                      color: '#334155',
                    }}
                  >
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              gridColumn: { xs: 1, sm: 2, lg: 3 },
              gridRow: { xs: 3, sm: 1, lg: 1 },
              justifySelf: 'end',
              mt: { xs: 1, sm: 0 },
              minWidth: 0,
            }}
          >
            <Button
              variant="contained"
              size="small"
              startIcon={<NoteAdd />}
              onClick={onTodayWorkDialogOpen}
              sx={{
                fontFamily: 'Paperozi',
                whiteSpace: 'nowrap',
                px: { xs: 1, sm: 1.5 },
                mr: { xs: 1.5, sm: 2 },
                minWidth: 0,
              }}
            >
              오늘의 업무 작성하기
            </Button>
            <Avatar sx={{ bgcolor: '#2563eb', width: 34, height: 34, fontFamily: 'Paperozi' }}>
              {userInfo?.name?.[0] || <Person fontSize="small" />}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {userInfo?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', whiteSpace: 'nowrap' }}>
                {userInfo?.role || userInfo?.rank}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={onLogout}
              sx={{ fontFamily: 'Paperozi', whiteSpace: 'nowrap' }}
            >
              로그아웃
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Container
          maxWidth="xl"
          sx={{
            py: 3,
            '& .MuiTypography-root, & .MuiButton-root, & .MuiChip-label': {
              fontFamily: 'Paperozi',
            },
          }}
        >
          <Dialog open={todayWorkDialogOpen} onClose={onTodayWorkDialogClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontFamily: 'Paperozi' }}>오늘의 업무 작성하기</DialogTitle>
            <DialogContent>
              <Box component="form" id="today-work-form" onSubmit={onTodayWorkSubmit} noValidate>
                <Stack spacing={2.5} sx={{ pt: 1 }}>
                  <TextField
                    fullWidth
                    label="업무명"
                    name="title"
                    value={todayWorkForm.title}
                    onChange={onTodayWorkFieldChange}
                    placeholder="업무명을 입력해 주세요."
                    required
                  />

                  <TextField
                    fullWidth
                    label="업무 목적"
                    name="purpose"
                    value={todayWorkForm.purpose}
                    onChange={onTodayWorkFieldChange}
                    placeholder="업무 목적을 입력해 주세요."
                    multiline
                    minRows={2}
                    required
                  />

                  <TextField
                    fullWidth
                    label="특이사항"
                    name="specialNotes"
                    value={todayWorkForm.specialNotes}
                    onChange={onTodayWorkFieldChange}
                    placeholder="참고할 특이사항을 입력해 주세요."
                    multiline
                    minRows={3}
                  />

                  <Button component="label" variant="outlined" startIcon={<CloudUpload />} sx={{ alignSelf: 'flex-start' }}>
                    파일 업로드
                    <input hidden type="file" onChange={onTodayWorkFileUpload} />
                  </Button>

                  {todayWorkUploadFileName && (
                    <Chip label={todayWorkUploadFileName} color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                  )}
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={onTodayWorkDialogClose}>닫기</Button>
              <Button type="submit" form="today-work-form" variant="contained">
                업무 저장
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={resultDocumentDialogOpen} onClose={onResultDocumentDialogClose} maxWidth="md" fullWidth>
            <DialogTitle>오늘의 업무 결과 문서 작성</DialogTitle>
            <DialogContent>
              <Box component="form" id="result-document-form" onSubmit={onResultDocumentSubmit} noValidate>
                <Stack spacing={2.5} sx={{ pt: 1 }}>
                  <TextField
                    fullWidth
                    label="업무명"
                    name="title"
                    value={resultDocumentForm.title}
                    onChange={onResultDocumentFieldChange}
                    placeholder="업무명을 입력해 주세요."
                    required
                  />

                  <Box>
                    <Typography component="label" htmlFor="result-work-date-time" variant="body2" sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}>
                      업무 일시
                    </Typography>
                    <TextField
                      fullWidth
                      id="result-work-date-time"
                      name="workDateTime"
                      type="datetime-local"
                      value={resultDocumentForm.workDateTime}
                      onChange={onResultDocumentFieldChange}
                      required
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="상황"
                    name="situation"
                    value={resultDocumentForm.situation}
                    onChange={onResultDocumentFieldChange}
                    placeholder="업무 상황을 입력해 주세요."
                    multiline
                    minRows={2}
                    required
                  />

                  <TextField
                    fullWidth
                    label="발생내용"
                    name="incident"
                    value={resultDocumentForm.incident}
                    onChange={onResultDocumentFieldChange}
                    placeholder="발생한 내용을 입력해 주세요."
                    multiline
                    minRows={2}
                    required
                  />

                  <TextField
                    fullWidth
                    label="원인"
                    name="cause"
                    value={resultDocumentForm.cause}
                    onChange={onResultDocumentFieldChange}
                    placeholder="원인을 입력해 주세요."
                    multiline
                    minRows={2}
                    required
                  />

                  <TextField
                    fullWidth
                    label="조치내용"
                    name="action"
                    value={resultDocumentForm.action}
                    onChange={onResultDocumentFieldChange}
                    placeholder="조치 내용을 입력해 주세요."
                    multiline
                    minRows={2}
                    required
                  />

                  <TextField
                    fullWidth
                    label="조치결과"
                    name="result"
                    value={resultDocumentForm.result}
                    onChange={onResultDocumentFieldChange}
                    placeholder="조치 결과를 입력해 주세요."
                    multiline
                    minRows={2}
                    required
                  />

                  <Button component="label" variant="outlined" startIcon={<CloudUpload />} sx={{ alignSelf: 'flex-start' }}>
                    파일 업로드
                    <input hidden type="file" onChange={onResultDocumentFileUpload} />
                  </Button>

                  {resultDocumentUploadFileName && (
                    <Chip label={resultDocumentUploadFileName} color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                  )}
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={onResultDocumentDialogClose}>닫기</Button>
              <Button type="submit" form="result-document-form" variant="contained">
                결과 문서 저장
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog  open={knowledgeDialogOpen} onClose={onKnowledgeDialogClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontFamily: 'Paperozi' }}>지식 기록하기</DialogTitle>
            <DialogContent>
              <Box component="form" id="knowledge-record-form" onSubmit={onKnowledgeSubmit} noValidate>
                <Stack spacing={2.5} sx={{ pt: 1 }}>
                  <TextField
                    fullWidth
                    label="업무명"
                    name="title"
                    value={knowledgeForm.title}
                    onChange={onKnowledgeFieldChange}
                    placeholder="업무명을 입력해 주세요."
                    required
                  />

                  <TextField
                    fullWidth
                    label="상황"
                    name="situation"
                    value={knowledgeForm.situation}
                    onChange={onKnowledgeFieldChange}
                    placeholder="업무 상황을 입력해 주세요."
                    multiline
                    minRows={2}
                    required
                  />

                  <TextField
                    fullWidth
                    label="발생 내용"
                    name="incident"
                    value={knowledgeForm.incident}
                    onChange={onKnowledgeFieldChange}
                    placeholder="발생한 내용을 입력해 주세요."
                    multiline
                    minRows={2}
                    required
                  />

                  <TextField
                    fullWidth
                    label="원인"
                    name="cause"
                    value={knowledgeForm.cause}
                    onChange={onKnowledgeFieldChange}
                    placeholder="원인을 입력해 주세요."
                    multiline
                    minRows={2}
                    required
                  />

                  <TextField
                    fullWidth
                    label="조치 내용"
                    name="action"
                    value={knowledgeForm.action}
                    onChange={onKnowledgeFieldChange}
                    placeholder="조치 내용을 입력해 주세요."
                    multiline
                    minRows={2}
                    required
                  />

                  <TextField
                    fullWidth
                    label="결과"
                    name="result"
                    value={knowledgeForm.result}
                    onChange={onKnowledgeFieldChange}
                    placeholder="결과를 입력해 주세요."
                    multiline
                    minRows={2}
                    required
                  />

                  <Button component="label" variant="outlined" startIcon={<CloudUpload />} sx={{ alignSelf: 'flex-start' }}>
                    파일 업로드
                    <input hidden type="file" onChange={onKnowledgeFileUpload} />
                  </Button>

                  {knowledgeUploadFileName && (
                    <Chip label={knowledgeUploadFileName} color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                  )}
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={onKnowledgeDialogClose}>닫기</Button>
              <Button type="submit" form="knowledge-record-form" variant="contained">
                지식 저장
              </Button>
            </DialogActions>
          </Dialog>

          {activeView === 'knowledge' && (
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5,mt:10 }}>
              <Typography variant="h4" sx={{ ml:2, color: '#353535' }}>저장된 지식</Typography>
              <Button variant="contained" startIcon={<NoteAdd />} onClick={onKnowledgeDialogOpen} sx={{ ml: 2 }}>
                지식 기록하기
              </Button>
            </Stack>
          )}

          {activeView === 'completed' && (
            <Typography variant="h4" sx={{ ml: 2, mt: 10, mb: 2.5, color:'#353535' }}>
              완료된 업무
            </Typography>
          )}

          {(activeView === 'knowledge' || activeView === 'management' || activeView === 'completed') && (
            <Stack spacing={2.5}>
              {displayedRecords.map((item) => {
                const isResultDocument = item.workDateTime || item.assignee || item.completionResult || item.specialNotes
                const hasStructuredResult = item.situation || item.incident || item.cause || item.action || item.result
                const detailEntries = (isResultDocument
                  ? [
                      ['업무일시', item.workDateTime],
                      ...(hasStructuredResult
                        ? [
                            ['상황', item.situation],
                            ['발생내용', item.incident],
                            ['원인', item.cause],
                            ['조치내용', item.action],
                            ['조치결과', item.result || item.completionResult],
                          ]
                        : [
                            ['담당자', item.assignee],
                            ['완료결과', item.completionResult],
                            ['특이사항', item.specialNotes],
                          ]),
                    ]
                  : [
                      ['상황', item.situation],
                      ['발생 내용', item.incident],
                      ['원인', item.cause],
                      ['조치 내용', item.action],
                      ['결과', item.result],
                    ]).concat([['첨부 파일', item.attachmentName]]).filter(([, value]) => value && String(value).trim())

                const isExpanded = !!expandedRecords[item.id]

                return (
                  <Paper key={item.id} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(15, 23, 42, 0.05)' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5} sx={{ mb: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
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
                              minWidth: 90,
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
              {displayedRecords.length === 0 && (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  완료된 업무가 없습니다.
                </Typography>
              )}
            </Stack>
          )}

          {activeView !== 'record' && activeView !== 'knowledge' && activeView !== 'management' && activeView !== 'completed' && (
            <Box sx={{ display: 'flex', justifyContent: 'center',mt:10 }}>
              <Box sx={{ width: '100%', maxWidth: 880, mx: 'auto' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                  {dashboardSummaryCards.map(({ label, value, tone, icon: Icon }) => (
                    <Card key={label} sx={{ flex: 1, borderRadius: 3 }}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.875rem' }}>{label}</Typography>
                          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700, fontSize: '1.6rem' }}>{value}</Typography>
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

                {todayWorkDocument && (
                  <Paper sx={{ p: 2.5, borderRadius: 4, mb: 2.5, border: '1px solid rgba(37, 99, 235, 0.12)', bgcolor: '#eff6ff' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 300 }}>오늘의 부대 업무</Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<NoteAdd fontSize="inherit" />}
                        onClick={onResultDocumentDialogOpen}
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
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
                      {todayWorkDocument.title}
                    </Typography>
                    <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                      {[
                        ['업무 목적', todayWorkDocument.purpose],
                        ['특이사항', todayWorkDocument.specialNotes],
                      ].filter(([, value]) => value).map(([label, value]) => (
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
                    {todayWorkDocument.fileName && (
                      <Chip label={todayWorkDocument.fileName} color="primary" variant="outlined" sx={{ mt: 1.5 }} />
                    )}
                    {todayResultDocument && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(15, 23, 42, 0.1)' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.25 }}>결과 문서</Typography>
                        <Stack spacing={1.5}>
                          {[
                            ['업무일시', todayResultDocument.workDateTime],
                            ['상황', todayResultDocument.situation],
                            ['발생내용', todayResultDocument.incident],
                            ['원인', todayResultDocument.cause],
                            ['조치내용', todayResultDocument.action],
                            ['조치결과', todayResultDocument.result],
                          ].filter(([, value]) => value).map(([label, value]) => (
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
                        {todayResultDocument.attachmentName && (
                          <Chip label={todayResultDocument.attachmentName} color="primary" variant="outlined" sx={{ mt: 1.5 }} />
                        )}
                      </Box>
                    )}
                  </Paper>
                )}

                <Paper sx={{ p: 3, borderRadius: 4, mb: 3, border: '1px solid rgba(15, 23, 42, 0.05)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      <Typography variant="overline" color="text.secondary" >부대 지식 영속화 AI</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb:1.5 }} >무엇을 도와드릴까요?</Typography>
                      <Typography variant="h10" >부대 지식과 경험을 AI가 찾아드립니다.</Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add sx={{ fontSize: 14 }} />}
                      onClick={handleNewChat}
                      sx={{
                        flexShrink: 0,
                        minWidth: 0,
                        px: 1,
                        py: 0,
                        height: 28,
                        minHeight: 24,
                        fontSize: '0.8rem',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                        '& .MuiButton-startIcon': { mr: 0.5 },
                      }}
                    >
                      새 채팅
                    </Button>
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
                      startIcon={<Send />}
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
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setExpandedRecords((prev) => ({ ...prev, [message.sourceId]: true }))
                                onViewChange('management')
                              }}
                              sx={{
                                minWidth: 0,
                                px: 1,
                                py: 0.25,
                                borderColor: '#bfdbfe',
                                borderRadius: 1,
                                fontWeight: 700,
                                color: '#1d4ed8',
                                textTransform: 'none',
                                justifyContent: 'flex-start',
                                '&:hover': {
                                  borderColor: '#1d4ed8',
                                  bgcolor: '#eff6ff',
                                },
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
