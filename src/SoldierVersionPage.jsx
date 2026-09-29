import { useState } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Add,
  Article,
  Bookmark,
  CheckCircle,
  Dashboard as DashboardIcon,
  History,
  Notifications,
  Person,
  Send,
  Shield,
  TrendingUp,
} from '@mui/icons-material'
import { soldierKnowledgeDemo } from './data/soldierKnowledgeDemo'

const summaryCards = [
  { label: '저장된 지식', value: '3건', tone: 'primary', icon: CheckCircle },
  { label: '완료된 업무', value: '1건', tone: 'warning', icon: Notifications },
  { label: '재검토 문서', value: '2건', tone: 'secondary', icon: Article },
  { label: '업무 처리율', value: '91%', tone: 'success', icon: TrendingUp },
]

const sidebarItems = [
  { id: 'dashboard', label: '대시보드', icon: DashboardIcon },
  { id: 'knowledge', label: '저장된 지식', icon: Bookmark },
]

const initialChatMessages = []

function SoldierVersionPage({ onBack }) {
  const [activeView, setActiveView] = useState('dashboard')
  const [chatMessages, setChatMessages] = useState(initialChatMessages)
  const [chatInput, setChatInput] = useState('')
  const [expandedRecords, setExpandedRecords] = useState({})

  const displayedRecords = activeView === 'completed' ? soldierKnowledgeDemo.slice(0, 1) : soldierKnowledgeDemo

  const getAiReplyFromKnowledge = (question) => {
    const trimmed = question.trim()
    if (!trimmed) {
      return { text: '질문을 입력해 주세요.', sourceTitle: null, sourceId: null }
    }

    const query = trimmed.toLowerCase()
    const tokens = query.split(/\s+/).filter(Boolean)
    const matches = soldierKnowledgeDemo.filter((item) => {
      const source = `${item.title} ${item.summary}`.toLowerCase()
      return tokens.every((token) => source.includes(token))
    })

    const resultList = matches.length > 0 ? matches : soldierKnowledgeDemo
    const source = resultList[0]
    const summary = resultList.slice(0, 3).map((item) => `- ${item.title}: ${item.summary}`).join('\n')

    return {
      text: `부대 생활 관련 지식을 기준으로 정리하면:\n${summary}`,
      sourceTitle: source.title,
      sourceId: source.id,
    }
  }

  const handleChatSubmit = () => {
    const trimmed = chatInput.trim()
    if (!trimmed) {
      return
    }

    setChatMessages((prev) => [...prev, { from: 'user', text: trimmed, meta: '용사' }])
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
    setExpandedRecords((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleNewChat = () => {
    setChatMessages([])
    setChatInput('')
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fcfcfc' }}>
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
            <Avatar sx={{ bgcolor: '#8fc276', color: '#fff', width: 36, height: 36 }}>
              <Shield fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff' }}>
                부대 지식 영속화 AI
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                용사 포털
              </Typography>
            </Box>
          </Stack>
        </Toolbar>

        <List sx={{ px: 1.5, py: 1 }}>
          {sidebarItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id

            return (
              <ListItem key={id} disablePadding>
                <ListItemButton
                  selected={isActive}
                  onClick={() => setActiveView(id)}
                  sx={{
                    borderRadius: 2,
                    px: 1.5,
                    py: 1.25,
                    my: 0.35,
                    color: isActive ? '#fff' : '#cbd5e1',
                    bgcolor: isActive ? '#1d4ed8' : 'transparent',
                    '&:hover': { bgcolor: '#8fc276' },
                    '&.Mui-selected': { bgcolor: '#8fc276' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 28, mr: 0.5, color: isActive ? '#fff' : '#cbd5e1' }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 600, color: isActive ? '#fff' : '#cbd5e1' }} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(22, 163, 74, 0.08)', bgcolor: 'rgba(255,255,255,0.8)' }}>
          <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
            <Box />
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton sx={{ color: '#166534' }}>
                <Notifications />
              </IconButton>
              <Button variant="outlined" size="small" onClick={onBack} sx={{ borderColor: '#22c55e', color: '#166534', '&:hover': { borderColor: '#15803d', bgcolor: '#f0fdf4' } }}>
                관리자 화면
              </Button>
              <Avatar sx={{ bgcolor: '#22c55e', width: 34, height: 34 }}>
                <Person fontSize="small" />
              </Avatar>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          {activeView !== 'knowledge' && activeView !== 'completed' && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '100%', maxWidth: 1000 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                  {summaryCards.map(({ label, value, tone, icon: Icon }) => (
                    <Card key={label} sx={{ flex: 1, borderRadius: 3, border: '1px solid rgba(34, 197, 94, 0.12)' }}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">{label}</Typography>
                          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>{value}</Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor:
                              tone === 'primary'
                                ? '#dcfce7'
                                : tone === 'warning'
                                  ? '#fef3c7'
                                  : tone === 'success'
                                    ? '#dcfce7'
                                    : '#f0fdf4',
                            color:
                              tone === 'primary'
                                ? '#166534'
                                : tone === 'warning'
                                  ? '#b45309'
                                  : tone === 'success'
                                    ? '#15803d'
                                    : '#166534',
                          }}
                        >
                          <Icon fontSize="small" />
                        </Avatar>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>

                <Paper sx={{ p: 3, borderRadius: 4, mb: 3, border: '1px solid rgba(15, 23, 42, 0.05)', bgcolor: '#f8fafc' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      <Typography variant="overline" color="text.secondary">부대 지식 영속화 AI</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>무엇을 도와드릴까요?</Typography>
                      <Typography variant="body2" color="text.secondary">부대 생활과 인간관계, 기록관리 문제를 함께 정리해 드립니다.</Typography>
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
                        whiteSpace: 'nowrap',
                        borderColor: '#8fc276',
                        color: '#0a0a0a',
                        '& .MuiButton-startIcon': { mr: 0.5 },
                        '&:hover': { borderColor: '#8fc276', bgcolor: '#eff6ff' },
                      }}
                    >
                      새 채팅
                    </Button>
                  </Stack>

                  <Divider sx={{ mb: 2, borderColor: 'rgba(20,184,166,0.2)' }} />

                  <Stack direction="row" spacing={1.5} sx={{ mt: 3, alignItems: 'stretch' }}>
                    <TextField
                      fullWidth
                      placeholder="업무나 부대 상황을 입력하면 저장된 기록을 기준으로 답변합니다"
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
                        '& .MuiOutlinedInput-root': { height: '100%', minHeight: 40 },
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
                        bgcolor: '#8fc276',
                        '&:hover': { bgcolor: '#7ab85b' },
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
                              onClick={() => setExpandedRecords((prev) => ({ ...prev, [message.sourceId]: true }))}
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
                                '&:hover': { borderColor: '#1d4ed8', bgcolor: '#eff6ff' },
                              }}
                            >
                              {message.sourceTitle}
                            </Button>
                          </Box>
                        )}

                        <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.8 }}>
                          {message.text}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>
          )}

          {(activeView === 'knowledge' || activeView === 'completed') && (
            <Stack spacing={2.5}>
              {displayedRecords.map((item) => {
                const detailEntries = [
                  ['상황', item.situation],
                  ['발생 내용', item.incident],
                  ['원인', item.cause],
                  ['조치 내용', item.action],
                  ['결과', item.result],
                ].filter(([, value]) => value && String(value).trim())
                const isExpanded = !!expandedRecords[item.id]

                return (
                  <Paper key={item.id} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(34, 197, 94, 0.08)', bgcolor: '#ffffff' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5} sx={{ mb: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ bgcolor: '#dcfce7', color: '#166534' }}>
                          <History />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                      </Stack>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => toggleExpandedRecord(item.id)}
                        sx={{
                          minWidth: 120,
                          px: 1.5,
                          py: 0.8,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                          boxShadow: '0 8px 18px rgba(34, 197, 94, 0.2)',
                          fontWeight: 700,
                          textTransform: 'none',
                          whiteSpace: 'nowrap',
                          '&:hover': { background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' },
                        }}
                      >
                        {isExpanded ? '접기' : '자세히 보기'}
                      </Button>
                    </Stack>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: detailEntries.length > 0 ? 1.5 : 0 }}>
                      {item.summary}
                    </Typography>

                    {isExpanded && detailEntries.length > 0 && (
                      <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid rgba(34, 197, 94, 0.08)' }}>
                        <Stack spacing={1.5}>
                          {detailEntries.map(([label, value]) => (
                            <Box key={label}>
                              <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 700, display: 'block', mb: 0.4 }}>
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
        </Container>
      </Box>
    </Box>
  )
}

export default SoldierVersionPage
