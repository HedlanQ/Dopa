// app.js — dopa. Single-Page Gamified Tracker

// ═══════════════ MOTIVATIONAL QUOTES ═══════════════
const QUOTES = [
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act but a habit.", author: "Aristotle" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
];

let quoteIndex = Math.floor(Math.random() * QUOTES.length);
let quoteTimer = null;

// ═══════════════ BADGE ICONS ═══════════════
const SVG_ICONS = {
  shield: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/></svg>`,
  crown:  `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z"/></svg>`,
  star:   `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg>`,
  flame:  `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12c2 -2.96 0 -7 -1.8 -9c-.2 .5 -.3 1.1 -.2 1.7c.1 .7 .4 1.3 .8 1.9c.7 1.1 .9 2.2 .5 3.3c-.4 1.1 -1.4 1.8 -2.5 1.8c-1 0 -1.8 -.5 -2.4 -1.2c-.6 -.7 -.8 -1.7 -.5 -2.7c-1.8 1.8 -2.9 4.3 -2.9 7.1a7 7 0 1 0 14 0c0 -2.1 -.6 -4.1 -1.7 -5.8c-.3 1 -1.1 1.8 -2.1 2.2c-1 .4 -2.1 .3 -2.7 -.8z"/></svg>`,
  bolt:   `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 3l0 10l6 0l-8 8l0 -10l-6 0z"/></svg>`,
  target: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="9"/></svg>`,
  gem:    `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 5h12l3 5l-8.5 9.5a1 1 0 0 1 -1 0l-8.5 -9.5z"/><path d="M10 12l-2 -2.2l.6 -4.8"/><path d="M14 12l2 -2.2l-.6 -4.8"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 21l8 0"/><path d="M12 17l0 4"/><path d="M7 4l10 0"/><path d="M17 4v8a5 5 0 0 1 -10 0v-8"/><path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/></svg>`
};

const BADGES = [
  { id: 'level_5',   name: 'Novice Adept',      desc: 'Reach level 5',            icon: 'shield', condition: s => s.user.level >= 5 },
  { id: 'level_10',  name: 'Focus Master',       desc: 'Reach level 10',           icon: 'crown',  condition: s => s.user.level >= 10 },
  { id: 'level_25',  name: 'Dopamine Legend',    desc: 'Reach level 25',           icon: 'star',   condition: s => s.user.level >= 25 },
  { id: 'streak_7',  name: 'Consistent',         desc: '7-day habit streak',       icon: 'flame',  condition: s => s.stats.longestStreak >= 7 },
  { id: 'streak_30', name: 'Unstoppable',        desc: '30-day habit streak',      icon: 'bolt',   condition: s => s.stats.longestStreak >= 30 },
  { id: 'tasks_10',  name: 'Getter Done',        desc: 'Complete 10 tasks total',  icon: 'target', condition: s => s.stats.totalTasksCompleted >= 10 },
  { id: 'tasks_50',  name: 'Productivity Beast', desc: 'Complete 50 tasks total',  icon: 'gem',    condition: s => s.stats.totalTasksCompleted >= 50 },
  { id: 'tasks_100', name: 'Ascended',           desc: 'Complete 100 tasks total', icon: 'trophy', condition: s => s.stats.totalTasksCompleted >= 100 }
];

// ═══════════════ STATE ═══════════════
let state = {
  user: { username: 'User', level: 1, xp: 0, totalXp: 0 },
  stats: { totalTasksCompleted: 0, longestStreak: 0 },
  tasks: [],
  habits: [],
  completionHistory: {},   // { 'YYYY-MM-DD': count }
  badgesUnlocked: [],
  lastResetDate: ''
};

let calendarView = { year: new Date().getFullYear(), month: new Date().getMonth() };

// ═══════════════ DATE UTILS ═══════════════
function getLocalDateString(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().split('T')[0];
}

function getDaysDifference(d1str, d2str) {
  return Math.floor((new Date(d2str) - new Date(d1str)) / 86400000);
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// ═══════════════ STORAGE ═══════════════
function loadState() {
  try {
    const saved = localStorage.getItem('dopa_state');
    if (saved) {
      state = JSON.parse(saved);
      if (!state.stats)             state.stats = { totalTasksCompleted: 0, longestStreak: 0 };
      if (!state.completionHistory) state.completionHistory = {};
      if (!state.badgesUnlocked)    state.badgesUnlocked = [];
    }
  } catch (e) { console.error('State load error', e); }
}

function saveState() {
  localStorage.setItem('dopa_state', JSON.stringify(state));
}

// ═══════════════ INIT ═══════════════
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  dailyMaintenance();
  recalcGlobalStreak();
  initForms();
  initProfileEdit();
  initMonthNav();
  initQuotes();
  renderAll();
});

// ═══════════════ DAILY MAINTENANCE ═══════════════
function dailyMaintenance() {
  const today = getLocalDateString();
  if (state.lastResetDate !== today) {
    state.tasks.forEach(t => { if (t.recurring) { t.completed = false; t.completedDate = null; } });
    state.lastResetDate = today;
  }
  state.habits.forEach(h => {
    if (h.lastCompletedDate && getDaysDifference(h.lastCompletedDate, today) > 1) {
      h.streak = 0;
    }
  });
  saveState();
}

// ═══════════════ QUOTES ═══════════════
function initQuotes() {
  buildQuoteDots();
  showQuote(quoteIndex);
  quoteTimer = setInterval(() => {
    quoteIndex = (quoteIndex + 1) % QUOTES.length;
    showQuote(quoteIndex);
  }, 8000);
}

function buildQuoteDots() {
  const dotsEl = document.getElementById('quote-dots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  QUOTES.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'quote-dot' + (i === quoteIndex ? ' active' : '');
    dot.addEventListener('click', () => {
      quoteIndex = i;
      showQuote(i);
      clearInterval(quoteTimer);
      quoteTimer = setInterval(() => {
        quoteIndex = (quoteIndex + 1) % QUOTES.length;
        showQuote(quoteIndex);
      }, 8000);
    });
    dotsEl.appendChild(dot);
  });
}

function showQuote(idx) {
  const q = QUOTES[idx];
  const textEl    = document.getElementById('quote-text');
  const authorEl  = document.getElementById('quote-author');
  const contentEl = document.getElementById('quote-content');
  if (!textEl || !authorEl) return;

  // Re-trigger CSS animation
  contentEl.style.animation = 'none';
  contentEl.offsetHeight; // force reflow
  contentEl.style.animation = '';

  textEl.textContent   = q.text;
  authorEl.textContent = '— ' + q.author;

  document.querySelectorAll('.quote-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

// ═══════════════ SMART INPUT PARSER ═══════════════
// Parses "[todo] <title> [easy|medium|hard]" from a single string
function parseTodoInput(raw) {
  let text = raw.trim();

  // Strip optional leading "todo" keyword (case-insensitive)
  text = text.replace(/^todo\s+/i, '').trim();

  // Detect trailing difficulty keyword
  const diffMap = { easy: 'easy', medium: 'medium', hard: 'hard' };
  const words = text.split(/\s+/);
  const lastWord = words[words.length - 1].toLowerCase();
  let difficulty = null;

  if (diffMap[lastWord]) {
    difficulty = diffMap[lastWord];
    words.pop();
    text = words.join(' ').trim();
  }

  return { title: text, difficulty };
}

// ═══════════════ FORMS ═══════════════
function initForms() {
  const titleInput      = document.getElementById('todo-title');
  const diffSelect      = document.getElementById('todo-difficulty');
  const hintEl          = document.getElementById('todo-parse-hint');

  // Live preview hint as user types
  titleInput.addEventListener('input', () => {
    const raw = titleInput.value;
    if (!raw.trim()) { hintEl.textContent = ''; hintEl.className = 'todo-hint'; return; }
    const { title, difficulty } = parseTodoInput(raw);
    if (difficulty) {
      hintEl.textContent = `"${title}" · ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
      hintEl.className = `todo-hint hint-${difficulty}`;
      diffSelect.value = difficulty;
    } else {
      hintEl.textContent = `"${title}" · using selected difficulty`;
      hintEl.className = 'todo-hint hint-default';
      diffSelect.value = diffSelect.value; // keep current
    }
  });

  // Todo form submit
  document.getElementById('todo-form').addEventListener('submit', e => {
    e.preventDefault();
    const raw       = titleInput.value.trim();
    const recurring = document.getElementById('todo-recurring').checked;
    if (!raw) return;

    const { title, difficulty: parsedDiff } = parseTodoInput(raw);
    if (!title) return;

    const difficulty = parsedDiff || diffSelect.value;

    state.tasks.push({ id: Date.now().toString(), title, difficulty, recurring, completed: false, completedDate: null });
    saveState();
    renderTasks();
    e.target.reset();
    hintEl.textContent = '';
    hintEl.className = 'todo-hint';
    diffSelect.value = 'medium';
  });

  // Habit form
  document.getElementById('habit-form').addEventListener('submit', e => {
    e.preventDefault();
    const name       = document.getElementById('habit-name').value.trim();
    const difficulty = document.getElementById('habit-difficulty').value;
    if (!name) return;
    state.habits.push({ id: Date.now().toString(), name, difficulty, streak: 0, longestStreak: 0, lastCompletedDate: null, completedDates: [] });
    saveState();
    renderHabitsCalendar();
    e.target.reset();
  });
}

// ═══════════════ PROFILE EDIT ═══════════════
function initProfileEdit() {
  const input = document.getElementById('username-input');
  input.value = state.user.username;
  syncAvatarAndName();

  input.addEventListener('blur', () => {
    const val = input.value.trim();
    if (val) { state.user.username = val; saveState(); syncAvatarAndName(); }
    else input.value = state.user.username;
  });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
}

function syncAvatarAndName() {
  const letter = state.user.username.charAt(0).toUpperCase();
  document.getElementById('topbar-avatar').textContent = letter;
  document.getElementById('username-input').value = state.user.username;
}

// ═══════════════ MONTH NAVIGATION ═══════════════
function initMonthNav() {
  document.getElementById('month-prev').addEventListener('click', () => {
    calendarView.month--;
    if (calendarView.month < 0) { calendarView.month = 11; calendarView.year--; }
    renderHabitsCalendar();
  });
  document.getElementById('month-next').addEventListener('click', () => {
    calendarView.month++;
    if (calendarView.month > 11) { calendarView.month = 0; calendarView.year++; }
    renderHabitsCalendar();
  });
}

// ═══════════════ XP & LEVELLING ═══════════════
const XP_MAP = { easy: 10, medium: 20, hard: 40 };

function addXp(amount) {
  state.user.totalXp += amount;
  let xp  = state.user.xp + amount;
  let lvl = state.user.level;
  let levelled = false;
  while (xp >= lvl * 100) {
    xp -= lvl * 100;
    lvl++;
    levelled = true;
  }
  state.user.xp    = xp;
  state.user.level = lvl;
  saveState();
  renderTopbar();
  if (levelled) triggerLevelUpModal(lvl);
}

function removeXp(amount) {
  state.user.totalXp = Math.max(0, state.user.totalXp - amount);
  state.user.xp      = Math.max(0, state.user.xp - amount);
  saveState();
  renderTopbar();
}

// ═══════════════ BADGE CHECKS ═══════════════
function checkBadges() {
  const newly = [];
  BADGES.forEach(b => {
    if (!state.badgesUnlocked.includes(b.id) && b.condition(state)) {
      state.badgesUnlocked.push(b.id);
      newly.push(b);
    }
  });
  if (newly.length) saveState();
  return newly;
}

// ═══════════════ LEVEL UP MODAL ═══════════════
function triggerLevelUpModal(newLevel) {
  const newBadges = checkBadges();
  document.getElementById('modal-level-num').textContent = newLevel;
  const ann = document.getElementById('modal-badge-announcement');
  if (newBadges.length > 0) {
    const b = newBadges[0];
    ann.style.display = 'block';
    document.getElementById('modal-badge-showcase').innerHTML = `
      ${SVG_ICONS[b.icon]}
      <div>
        <div class="badge-showcase-title">${b.name}</div>
        <div class="badge-showcase-desc">${b.desc}</div>
      </div>`;
  } else {
    ann.style.display = 'none';
  }
  const modal = document.getElementById('level-up-modal');
  modal.classList.add('active');
  const close = document.getElementById('modal-close-btn');
  const handler = () => { modal.classList.remove('active'); close.removeEventListener('click', handler); };
  close.addEventListener('click', handler);
}

// ═══════════════ ACTIVITY HISTORY ═══════════════
function logCompletion(dateStr) {
  state.completionHistory[dateStr] = (state.completionHistory[dateStr] || 0) + 1;
  saveState();
  renderActivityGraph();
}

function removeCompletion(dateStr) {
  if (state.completionHistory[dateStr] > 0) {
    state.completionHistory[dateStr]--;
    if (state.completionHistory[dateStr] === 0) delete state.completionHistory[dateStr];
    saveState();
    renderActivityGraph();
  }
}

// ═══════════════ TASKS ═══════════════
function toggleTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  const today = getLocalDateString();
  const xp    = XP_MAP[task.difficulty] || 20;

  if (!task.completed) {
    task.completed    = true;
    task.completedDate = today;
    state.stats.totalTasksCompleted++;
    addXp(xp);
    logCompletion(today);
    checkBadges();
  } else {
    task.completed     = false;
    task.completedDate = null;
    state.stats.totalTasksCompleted = Math.max(0, state.stats.totalTasksCompleted - 1);
    removeXp(xp);
    removeCompletion(today);
  }
  saveState();
  renderTasks();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveState();
  renderTasks();
}

// ═══════════════ HABITS ═══════════════

// Returns true if every habit has been completed on dateStr
function allHabitsDoneOn(dateStr) {
  if (state.habits.length === 0) return false;
  return state.habits.every(h => h.completedDates.includes(dateStr));
}

// Recalculates the global streak: consecutive days where ALL habits were done,
// counting backwards from today (today counts even if not yet finished).
function recalcGlobalStreak() {
  let streak = 0;
  const cur  = new Date();

  for (let i = 0; i < 400; i++) {
    const dateStr = getLocalDateString(cur);
    if (allHabitsDoneOn(dateStr)) {
      streak++;
    } else if (i === 0) {
      // Today is incomplete — don't break yet, check yesterday
      cur.setDate(cur.getDate() - 1);
      continue;
    } else {
      break;
    }
    cur.setDate(cur.getDate() - 1);
  }

  state.stats.currentStreak = streak;
  state.stats.longestStreak = Math.max(state.stats.longestStreak || 0, streak);
}

function toggleHabitDay(habitId, dateStr, checked) {
  const habit = state.habits.find(h => h.id === habitId);
  if (!habit) return;
  const xp = XP_MAP[habit.difficulty] || 20;

  if (checked) {
    if (!habit.completedDates.includes(dateStr)) habit.completedDates.push(dateStr);
    habit.lastCompletedDate = dateStr;
    logCompletion(dateStr);

    // Award base XP, plus a +5 bonus if this check completes ALL habits for today
    const completedAll = allHabitsDoneOn(dateStr);
    addXp(xp + (completedAll ? 5 : 0));
  } else {
    habit.completedDates    = habit.completedDates.filter(d => d !== dateStr);
    habit.lastCompletedDate = habit.completedDates.length
      ? habit.completedDates[habit.completedDates.length - 1]
      : null;
    removeXp(xp);
    removeCompletion(dateStr);
  }

  recalcGlobalStreak();
  checkBadges();
  saveState();
  renderTopbar();
  renderHabitsCalendar();
}

function recalcHabitStreak(habit) {
  const sorted = [...habit.completedDates].sort();
  if (!sorted.length) { habit.streak = 0; habit.longestStreak = 0; return; }

  let maxStreak = 1, cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (getDaysDifference(sorted[i - 1], sorted[i]) === 1) cur++;
    else cur = 1;
    if (cur > maxStreak) maxStreak = cur;
  }
  habit.longestStreak = maxStreak;

  const today  = getLocalDateString();
  const latest = sorted[sorted.length - 1];
  if (getDaysDifference(latest, today) > 1) { habit.streak = 0; return; }

  let streak = 1;
  for (let i = sorted.length - 2; i >= 0; i--) {
    if (getDaysDifference(sorted[i], sorted[i + 1]) === 1) streak++;
    else break;
  }
  habit.streak = streak;
}

function deleteHabit(id) {
  state.habits = state.habits.filter(h => h.id !== id);
  recalcGlobalStreak();
  saveState();
  renderHabitsCalendar();
  renderTopbar();
}

// ═══════════════ RENDER TOPBAR ═══════════════
function renderTopbar() {
  const lvl    = state.user.level;
  const xp     = state.user.xp;
  const needed = lvl * 100;
  const pct    = Math.min(100, Math.round((xp / needed) * 100));

  document.getElementById('level-display').textContent = lvl;
  document.getElementById('xp-bar-fill').style.width   = pct + '%';
  document.getElementById('xp-current').textContent    = xp + ' XP';
  document.getElementById('xp-needed').textContent     = '/ ' + needed + ' XP to next level';
  document.getElementById('longest-streak-display').textContent = state.stats.currentStreak || 0;
}

// ═══════════════ RENDER TASKS ═══════════════
function renderTasks() {
  const activeList     = document.getElementById('active-todo-list');
  const completedList  = document.getElementById('completed-todo-list');
  const activeCount    = document.getElementById('active-tasks-count');
  const activeCount2   = document.getElementById('active-tasks-count-2');
  const completedCount = document.getElementById('completed-tasks-count');
  const totalCount     = document.getElementById('total-tasks-count');

  activeList.innerHTML = '';
  completedList.innerHTML = '';

  let ac = 0, cc = 0;

  state.tasks.forEach(task => {
    ac += task.completed ? 0 : 1;
    cc += task.completed ? 1 : 0;

    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
      <label class="task-checkbox-wrap" title="${task.completed ? 'Undo' : 'Complete'}">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
        <span class="task-checkbox-mark"></span>
      </label>
      <div class="task-body">
        <div class="task-title">${escHtml(task.title)}</div>
        <div class="task-meta">
          <span class="diff-badge ${task.difficulty}">${task.difficulty}</span>
          ${task.recurring ? '<span class="recur-badge">Daily</span>' : ''}
        </div>
      </div>
      <button class="task-delete" onclick="deleteTask('${task.id}')" title="Delete">×</button>
    `;

    if (task.completed) completedList.appendChild(card);
    else activeList.appendChild(card);
  });

  if (ac === 0) activeList.innerHTML = '<div class="empty-state">No active tasks</div>';

  activeCount.textContent   = ac;
  activeCount2.textContent  = ac;
  completedCount.textContent = cc;
  totalCount.textContent    = state.tasks.length;
}

// ═══════════════ RENDER HABITS CALENDAR ═══════════════
function renderHabitsCalendar() {
  const { year, month } = calendarView;
  const dayCount  = daysInMonth(year, month);
  const today     = getLocalDateString();
  const todayDate = new Date();

  const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  document.getElementById('habits-month-label').textContent = monthName;

  const calendar = document.getElementById('habits-calendar');

  if (state.habits.length === 0) {
    calendar.style.gridTemplateColumns = '';
    calendar.innerHTML = '<div class="habits-empty">No habits yet — add one above ↑</div>';
    return;
  }

  const cols = `190px repeat(${dayCount}, 30px) 50px`;
  calendar.style.gridTemplateColumns = cols;
  calendar.innerHTML = '';

  // ── Header row ──────────────────────
  const thName = document.createElement('div');
  thName.className = 'hcal-th-name';
  thName.textContent = 'Habit';
  calendar.appendChild(thName);

  for (let d = 1; d <= dayCount; d++) {
    const isToday = (year === todayDate.getFullYear() && month === todayDate.getMonth() && d === todayDate.getDate());
    const th = document.createElement('div');
    th.className = 'hcal-th-day' + (isToday ? ' today-header' : '');
    th.textContent = d;
    calendar.appendChild(th);
  }

  const thStreak = document.createElement('div');
  thStreak.className = 'hcal-th-streak';
  thStreak.textContent = '🔥';
  calendar.appendChild(thStreak);

  // ── Habit rows ──────────────────────
  state.habits.forEach(habit => {
    const tdName = document.createElement('div');
    tdName.className = 'hcal-td-name';
    tdName.innerHTML = `
      <span class="hcal-habit-name" title="${escHtml(habit.name)}">${escHtml(habit.name)}</span>
      <button class="hcal-habit-del" onclick="deleteHabit('${habit.id}')" title="Delete habit">×</button>
    `;
    calendar.appendChild(tdName);

    for (let d = 1; d <= dayCount; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isFuture = dateStr > today;
      const isToday  = dateStr === today;
      const checked  = habit.completedDates.includes(dateStr);

      const td = document.createElement('div');
      td.className = 'hcal-td-day' + (isFuture ? ' future-day' : '') + (isToday ? ' today-col' : '');

      if (!isFuture) {
        td.innerHTML = `
          <label class="cal-checkbox">
            <input type="checkbox" ${checked ? 'checked' : ''}
              onchange="toggleHabitDay('${habit.id}', '${dateStr}', this.checked)">
            <span class="cal-checkbox-mark"></span>
          </label>`;
      }
      calendar.appendChild(td);
    }

    const tdStreak = document.createElement('div');
    tdStreak.className = 'hcal-td-streak' + (habit.streak === 0 ? ' zero' : '');
    tdStreak.textContent = habit.streak > 0 ? habit.streak : '—';
    calendar.appendChild(tdStreak);
  });
}

// ═══════════════ RENDER ACTIVITY GRAPH ═══════════════
function renderActivityGraph() {
  const grid      = document.getElementById('activity-grid');
  const monthsRow = document.getElementById('graph-months');
  const tooltip   = document.getElementById('graph-tooltip');

  grid.innerHTML = '';
  monthsRow.innerHTML = '';

  const totalCells = 371;
  const startDate  = new Date();
  startDate.setDate(startDate.getDate() - totalCells + 1);

  const cells = [];
  const cur   = new Date(startDate);
  for (let i = 0; i < totalCells; i++) {
    cells.push({ dateStr: getLocalDateString(cur), dateObj: new Date(cur) });
    cur.setDate(cur.getDate() + 1);
  }

  // Month labels
  let lastMonth = -1;
  for (let col = 0; col < 53; col++) {
    const d    = cells[col * 7].dateObj;
    const span = document.createElement('span');
    if (d.getMonth() !== lastMonth) {
      span.textContent = d.toLocaleString('default', { month: 'short' });
      lastMonth = d.getMonth();
    }
    monthsRow.appendChild(span);
  }

  // Cells
  cells.forEach(cell => {
    const count = state.completionHistory[cell.dateStr] || 0;
    let lvl = 0;
    if (count >= 1 && count <= 2) lvl = 1;
    else if (count >= 3 && count <= 5) lvl = 2;
    else if (count >= 6) lvl = 3;

    const div = document.createElement('div');
    div.className  = 'activity-cell';
    div.dataset.level = lvl;

    div.addEventListener('mouseenter', () => {
      const rect   = div.getBoundingClientRect();
      const label  = count === 0 ? 'No completions' : count === 1 ? '1 completion' : `${count} completions`;
      const date   = cell.dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      tooltip.textContent = `${label} · ${date}`;
      tooltip.classList.add('visible');
      tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top  = (rect.top - tooltip.offsetHeight - 6) + 'px';
    });

    div.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
    grid.appendChild(div);
  });
}

// ═══════════════ RENDER ALL ═══════════════
function renderAll() {
  renderTopbar();
  renderTasks();
  renderHabitsCalendar();
  renderActivityGraph();
}

// ═══════════════ UTILS ═══════════════
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Expose to global for inline handlers
window.toggleTask     = toggleTask;
window.deleteTask     = deleteTask;
window.toggleHabitDay = toggleHabitDay;
window.deleteHabit    = deleteHabit;
