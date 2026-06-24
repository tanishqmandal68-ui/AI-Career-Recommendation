# Job Advisor AI Comprehensive Overhaul Implementation Plan

> [!NOTE]
> This document may not reflect the current implementation.
> See the final report for up-to-date state:
> [Final Report](../reports/comprehensive-overhaul.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Job Advisor AI frontend with global state security, XSS prevention, light/dark theming, and Gemini-inspired UI.

**Architecture:** Zustand store with PII sanitization, DOMPurify for XSS prevention, CSS custom properties for theming, and a complete UI redesign following Gemini's aesthetic.

**Tech Stack:** React 18, Zustand 5, DOMPurify, TypeScript, Vite, CSS custom properties

## Global Constraints

- No raw `resumeText` stored in chat messages (PII security)
- All rendered HTML must be sanitized via DOMPurify
- Theme preference persisted to localStorage
- CSS uses custom properties for light/dark mode switching
- Mobile-responsive with single breakpoint at 768px

---

## Task 1: Install Dependencies

**Files:**
- Modify: `frontend/package.json`

**Interfaces:**
- Consumes: None
- Produces: `dompurify` and `@types/dompurify` available

- [ ] **Step 1: Install DOMPurify**

```bash
cd D:\Desktop\Project\Ai_Job_Recommendation_Chatbot\frontend
npm install dompurify
npm install -D @types/dompurify
```

- [ ] **Step 2: Verify installation**

```bash
npm list dompurify
```

Expected: `dompurify@<version>`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install dompurify for XSS sanitization"
```

---

## Task 2: Refactor chatStore for PII Security

**Files:**
- Modify: `frontend/src/store/chatStore.ts`

**Interfaces:**
- Consumes: None
- Produces: `Message` type without `text` field in attachment, `AttachmentData` without `text`

- [ ] **Step 1: Remove `text` and `warnings` from AttachmentData**

In `frontend/src/store/chatStore.ts`, modify the `AttachmentData` interface:

```typescript
export interface AttachmentData {
  name: string
  size: number
  fileType: 'pdf' | 'doc' | 'image'
  previewUrl?: string
}
```

- [ ] **Step 2: Update partialize to strip all PII fields**

```typescript
partialize: (state) => ({
  sessions: state.sessions.map(s => ({
    ...s,
    messages: s.messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      attachment: m.attachment ? {
        name: m.attachment.name,
        size: m.attachment.size,
        fileType: m.attachment.fileType,
      } : undefined,
      timestamp: m.timestamp,
    })),
  })),
  currentSessionId: state.currentSessionId,
  resumeText: '',
}),
```

- [ ] **Step 3: Add theme state to store**

```typescript
export type Theme = 'light' | 'dark'

interface ChatState {
  sessions: Session[]
  currentSessionId: string | null
  resumeText: string
  theme: Theme
  // ... existing actions
  setTheme: (theme: Theme) => void
}
```

In the store implementation:

```typescript
theme: (typeof window !== 'undefined' && localStorage.getItem('job-advisor-theme') as Theme) || 'dark',

setTheme: (theme: Theme) => {
  set({ theme })
  localStorage.setItem('job-advisor-theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
},
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/store/chatStore.ts
git commit -m "security: strip PII from persisted chat data, add theme state"
```

---

## Task 3: Create Sanitization Utility

**Files:**
- Create: `frontend/src/utils/sanitize.ts`

**Interfaces:**
- Consumes: `dompurify`
- Produces: `sanitizeHtml(html: string): string`

- [ ] **Step 1: Create sanitize utility**

```typescript
import DOMPurify from 'dompurify'

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/utils/sanitize.ts
git commit -m "feat: add DOMPurify sanitization utility"
```

---

## Task 4: Redesign CSS with Theme Support

**Files:**
- Modify: `frontend/src/styles/global.css`

**Interfaces:**
- Consumes: CSS custom properties
- Produces: Theme-aware styling

- [ ] **Step 1: Add CSS custom properties for themes**

At the top of `global.css`, add:

```css
:root,
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent-blue: #60a5fa;
  --accent-purple: #a78bfa;
  --accent-gradient: linear-gradient(135deg, #3b82f6, #6366f1);
  --border-color: rgba(148, 163, 184, 0.1);
  --border-hover: rgba(96, 165, 250, 0.5);
  --user-msg-bg: linear-gradient(135deg, #3b82f6, #6366f1);
  --assistant-msg-bg: transparent;
  --input-bg: #1e293b;
  --sidebar-bg: #0f172a;
  --card-bg: #1e293b;
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --accent-blue: #3b82f6;
  --accent-purple: #7c3aed;
  --accent-gradient: linear-gradient(135deg, #3b82f6, #6366f1);
  --border-color: rgba(0, 0, 0, 0.1);
  --border-hover: rgba(59, 130, 246, 0.5);
  --user-msg-bg: linear-gradient(135deg, #3b82f6, #6366f1);
  --assistant-msg-bg: transparent;
  --input-bg: #f1f5f9;
  --sidebar-bg: #ffffff;
  --card-bg: #f8fafc;
}
```

- [ ] **Step 2: Replace hardcoded colors with CSS variables**

Replace all hardcoded colors throughout the file. Key replacements:

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
}

.header {
  background: var(--bg-primary);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  /* ... rest unchanged */
}

.message.user .message-content {
  background: var(--user-msg-bg);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message.assistant .message-content {
  background: var(--assistant-msg-bg);
  border-bottom-left-radius: 0.25rem;
}

.chat-input-container {
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
}

.chat-input-row input[type="text"] {
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.chat-sidebar {
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
}
```

- [ ] **Step 3: Update assistant message to remove background box**

```css
.message.assistant .message-content {
  background: transparent;
  border: none;
  padding: 0.5rem 0;
}
```

- [ ] **Step 4: Add theme toggle styles**

```css
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.theme-toggle:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
```

- [ ] **Step 5: Redesign input area to pill-shaped**

```css
.chat-input-container {
  padding: 0.75rem 1.5rem 1rem;
}

.chat-input-row {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 0.375rem 0.375rem 0.375rem 1rem;
  transition: border-color 0.2s;
}

.chat-input-row:focus-within {
  border-color: var(--border-hover);
}

.chat-input-row input[type="text"] {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.5rem 0.75rem;
  color: var(--text-primary);
  font-size: 0.9375rem;
  outline: none;
}

.upload-chat-btn {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--text-muted);
  /* ... rest unchanged */
}

.send-btn {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--accent-gradient);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

- [ ] **Step 6: Commit**

```bash
git add frontend/src/styles/global.css
git commit -m "feat: add CSS custom properties for light/dark theming"
```

---

## Task 5: Update Header with Theme Toggle

**Files:**
- Modify: `frontend/src/components/Header.tsx`

**Interfaces:**
- Consumes: `useChatStore` (theme, setTheme)
- Produces: Theme toggle button in header

- [ ] **Step 1: Add theme toggle to Header**

```typescript
import { useChatStore } from '../store/chatStore'

type Tab = 'chat' | 'resume-analyzer' | 'resume-builder'

interface HeaderProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  onMenuClick: () => void
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'chat', label: 'Job Advisor', icon: '💼' },
  { id: 'resume-analyzer', label: 'Resume Analyzer', icon: '📊' },
  { id: 'resume-builder', label: 'Resume Builder', icon: '📝' },
]

export function Header({ activeTab, onTabChange, onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useChatStore()

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {activeTab === 'chat' && (
            <button className="sidebar-toggle" onClick={onMenuClick} title="Chat History">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <h1>Job Advisor AI</h1>
          </div>
        </div>
        <div className="header-right">
          <nav className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Add header-right styles**

```css
.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Header.tsx
git commit -m "feat: add theme toggle button to header"
```

---

## Task 6: Update ChatInterface with Gemini-inspired UI

**Files:**
- Modify: `frontend/src/components/ChatInterface.tsx`

**Interfaces:**
- Consumes: `useChatStore`, `sanitizeHtml`
- Produces: Gemini-inspired chat UI with sanitized rendering

- [ ] **Step 1: Add sanitizeHtml import and apply to message rendering**

```typescript
import { sanitizeHtml } from '../utils/sanitize'
```

In the message rendering section:

```typescript
{msg.content && (
  <div
    className="message-text"
    dangerouslySetInnerHTML={{ __html: sanitizeHtml(msg.content) }}
  />
)}
```

- [ ] **Step 2: Update message styling classes**

```typescript
{messages.map((msg) => (
  <div key={msg.id} className={`message ${msg.role}`}>
    {msg.role === 'assistant' && (
      <div className="message-avatar assistant-avatar">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z" />
          <circle cx="9" cy="15" r="1" fill="currentColor" />
          <circle cx="15" cy="15" r="1" fill="currentColor" />
        </svg>
      </div>
    )}
    <div className={`message-content ${msg.role === 'user' && msg.attachment ? 'message-with-attachment' : ''}`}>
      {msg.attachment && <AttachmentPill attachment={msg.attachment} />}
      {msg.content && (
        <div
          className="message-text"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(msg.content) }}
        />
      )}
    </div>
    {msg.role === 'user' && (
      <div className="message-avatar user-avatar">U</div>
    )}
  </div>
))}
```

- [ ] **Step 3: Update input to send button with arrow icon**

Replace the Send button:

```typescript
<button className="send-btn" onClick={sendMessage} disabled={loading || (!inputText.trim() && !pendingAttachment)}>
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
</button>
```

- [ ] **Step 4: Add Gemini-inspired message styles**

```css
.message {
  display: flex;
  gap: 0.75rem;
  max-width: 80%;
  align-items: flex-start;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.assistant {
  align-self: flex-start;
}

.message-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.assistant-avatar {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--accent-blue);
}

.user-avatar {
  background: var(--accent-gradient);
  color: white;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  line-height: 1.6;
}

.message.user .message-content {
  background: var(--user-msg-bg);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message.assistant .message-content {
  background: transparent;
  border: none;
  padding: 0.5rem 0;
}

.message-text {
  white-space: pre-wrap;
}

.message-text b, .message-text strong {
  font-weight: 600;
  color: var(--text-primary);
}

.message-text ul, .message-text ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.message-text li {
  margin: 0.25rem 0;
}

.message-text code {
  background: var(--bg-secondary);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875em;
}

.message-text pre {
  background: var(--bg-secondary);
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.message-text pre code {
  background: none;
  padding: 0;
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ChatInterface.tsx
git commit -m "feat: implement Gemini-inspired UI with XSS sanitization"
```

---

## Task 7: Update App.tsx Layout

**Files:**
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Consumes: `useChatStore` (theme)
- Produces: Theme-aware root layout

- [ ] **Step 1: Apply theme on mount**

```typescript
import { useEffect } from 'react'
import { useChatStore } from './store/chatStore'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useChatStore()

  useEffect(() => {
    const savedTheme = localStorage.getItem('job-advisor-theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <div className="app-body">
        {activeTab === 'chat' && (
          <ChatSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <main className="main-content">
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'resume-analyzer' && <ResumeAnalyzer />}
          {activeTab === 'resume-builder' && <ResumeBuilder />}
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat: apply theme on mount with system preference fallback"
```

---

## Task 8: Verify and Test

**Files:**
- None (verification only)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Passing typecheck and visual verification

- [ ] **Step 1: Run TypeScript typecheck**

```bash
cd D:\Desktop\Project\Ai_Job_Recommendation_Chatbot\frontend
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 2: Start dev server and verify**

```bash
npm run dev
```

Open http://localhost:5173 and verify:
- Theme toggle switches between light and dark
- Chat history persists across tab switches
- Messages render with markdown styling
- No XSS vulnerabilities (test with `<script>alert('xss')</script>` in chat)
- Sidebar shows session history
- New Chat button creates fresh session

- [ ] **Step 3: Commit all changes**

```bash
git add -A
git commit -m "feat: complete comprehensive UI overhaul with security and theming"
```
