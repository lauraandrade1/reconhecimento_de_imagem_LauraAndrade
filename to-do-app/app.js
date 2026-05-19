// ============================================================
//  TaskFlow — app.js  (v2)
//  Etapas: Auth + CRUD + Filtros + Busca + Edição + Toast + Modal
// ============================================================

// ─────────────────────────────────────────────
// 1. CAMADA DE DADOS (db)
// ─────────────────────────────────────────────
const db = {
    getUsers:        ()  => JSON.parse(localStorage.getItem('users'))       || [],
    saveUsers:       (u) => localStorage.setItem('users',       JSON.stringify(u)),

    getTodos:        ()  => JSON.parse(localStorage.getItem('todos'))       || [],
    saveTodos:       (t) => localStorage.setItem('todos',       JSON.stringify(t)),

    getCurrentUser:  ()  => JSON.parse(localStorage.getItem('currentUser')) || null,
    setCurrentUser:  (u) => localStorage.setItem('currentUser', JSON.stringify(u)),
    clearCurrentUser:()  => localStorage.removeItem('currentUser')
};

// ─────────────────────────────────────────────
// 2. MAPEAMENTO DA UI (ui)
// ─────────────────────────────────────────────
const ui = {
    screens: {
        login:     document.getElementById('login-screen'),
        register:  document.getElementById('register-screen'),
        dashboard: document.getElementById('dashboard-screen')
    },
    forms: {
        login:    document.getElementById('login-form'),
        register: document.getElementById('register-form'),
        todo:     document.getElementById('todo-form')
    },
    inputs: {
        loginEmail:       document.getElementById('login-email'),
        loginPassword:    document.getElementById('login-password'),
        registerName:     document.getElementById('register-name'),
        registerEmail:    document.getElementById('register-email'),
        registerPassword: document.getElementById('register-password'),
        todoTitle:        document.getElementById('todo-title'),
        todoType:         document.getElementById('todo-type'),
        todoDescription:  document.getElementById('todo-description'),
        search:           document.getElementById('search-input')
    },
    errors: {
        login:    document.getElementById('login-error'),
        register: document.getElementById('register-error'),
        todo:     document.getElementById('todo-error')
    },
    elements: {
        userGreeting:     document.getElementById('user-greeting'),
        todoList:         document.getElementById('todo-list'),
        emptyState:       document.getElementById('empty-state'),
        emptyFilterState: document.getElementById('empty-filter-state'),
        statTotal:        document.getElementById('stat-total'),
        statDone:         document.getElementById('stat-done'),
        statPending:      document.getElementById('stat-pending'),
        filterCount:      document.getElementById('filter-count'),
        // Formulário
        formTitle:        document.getElementById('form-title'),
        submitLabel:      document.getElementById('submit-label'),
        submitIcon:       document.getElementById('submit-icon'),
        cancelEditBtn:    document.getElementById('cancel-edit-btn'),
        searchClear:      document.getElementById('search-clear'),
        // Toast
        toast:            document.getElementById('toast'),
        toastIcon:        document.getElementById('toast-icon'),
        toastMessage:     document.getElementById('toast-message'),
        // Modal
        confirmModal:     document.getElementById('confirm-modal'),
        confirmTaskName:  document.getElementById('confirm-task-name'),
        confirmDeleteBtn: document.getElementById('confirm-delete-btn'),
        confirmCancelBtn: document.getElementById('confirm-cancel-btn')
    },
    links: {
        goToRegister: document.getElementById('go-to-register'),
        goToLogin:    document.getElementById('go-to-login')
    },
    buttons: {
        logout: document.getElementById('logout-btn')
    }
};

// ─────────────────────────────────────────────
// 3. ESTADO DOS FILTROS E EDIÇÃO
// ─────────────────────────────────────────────
const state = {
    filter: { status: 'all', type: 'all', search: '' },
    editingId: null,          // id da tarefa em edição (null = modo criação)
    pendingDeleteId: null     // id esperando confirmação de exclusão
};

// ─────────────────────────────────────────────
// 4. NAVEGAÇÃO E HELPERS DE UI
// ─────────────────────────────────────────────
const navigateTo = (screenKey) => {
    Object.values(ui.screens).forEach(s => s.classList.add('hidden-screen'));
    ui.screens[screenKey].classList.remove('hidden-screen');
    clearErrors();
    ui.forms.login.reset();
    ui.forms.register.reset();
};

const clearErrors = () => {
    Object.values(ui.errors).forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });
};

const showError = (errorEl, message) => {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    errorEl.style.animation = 'none';
    errorEl.offsetHeight;
    errorEl.style.animation = 'shake 0.35s ease';
};

// Injeta keyframes uma vez
const styleTag = document.createElement('style');
styleTag.textContent = `
    @keyframes shake {
        0%,100%{ transform:translateX(0) }
        20%    { transform:translateX(-6px) }
        40%    { transform:translateX(6px) }
        60%    { transform:translateX(-4px) }
        80%    { transform:translateX(4px) }
    }
`;
document.head.appendChild(styleTag);

// ─────────────────────────────────────────────
// 5. SISTEMA DE TOAST
// ─────────────────────────────────────────────
let toastTimer = null;

const TOAST_TYPES = {
    success: {
        bg:    'bg-emerald-500/20 border border-emerald-500/30',
        text:  'text-emerald-300',
        icon:  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>'
    },
    error: {
        bg:    'bg-rose-500/20 border border-rose-500/30',
        text:  'text-rose-300',
        icon:  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
    },
    info: {
        bg:    'bg-blue-500/20 border border-blue-500/30',
        text:  'text-blue-300',
        icon:  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z"/>'
    }
};

const showToast = (message, type = 'success') => {
    const cfg = TOAST_TYPES[type];
    const { toast, toastIcon, toastMessage } = ui.elements;

    // Reset classes dinâmicas
    toast.className = `fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold shadow-2xl transition-all duration-300 ${cfg.bg} ${cfg.text}`;
    toastIcon.innerHTML = cfg.icon;
    toastMessage.textContent = message;

    // Mostra
    requestAnimationFrame(() => {
        toast.style.transform  = 'translateY(0)';
        toast.style.opacity    = '1';
        toast.style.pointerEvents = 'auto';
    });

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.transform  = 'translateY(4rem)';
        toast.style.opacity    = '0';
        toast.style.pointerEvents = 'none';
    }, 2800);
};

// ─────────────────────────────────────────────
// 6. MODAL DE CONFIRMAÇÃO DE EXCLUSÃO
// ─────────────────────────────────────────────
const openConfirmModal = (todoId) => {
    const todo = db.getTodos().find(t => t.id === todoId);
    if (!todo) return;

    state.pendingDeleteId = todoId;
    ui.elements.confirmTaskName.textContent = `"${todo.title}"`;
    ui.elements.confirmModal.classList.remove('hidden');
};

const closeConfirmModal = () => {
    state.pendingDeleteId = null;
    ui.elements.confirmModal.classList.add('hidden');
};

ui.elements.confirmCancelBtn.addEventListener('click', closeConfirmModal);
ui.elements.confirmModal.addEventListener('click', (e) => {
    if (e.target === ui.elements.confirmModal) closeConfirmModal();
});
ui.elements.confirmDeleteBtn.addEventListener('click', () => {
    if (!state.pendingDeleteId) return;
    const todos   = db.getTodos();
    const deleted = todos.find(t => t.id === state.pendingDeleteId);
    db.saveTodos(todos.filter(t => t.id !== state.pendingDeleteId));
    closeConfirmModal();
    renderTodos();
    showToast(`"${deleted?.title}" excluída.`, 'error');
});

// Fecha modal com Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeConfirmModal();
});

// ─────────────────────────────────────────────
// 7. AUTENTICAÇÃO
// ─────────────────────────────────────────────
const handleRegister = (e) => {
    e.preventDefault();
    clearErrors();

    const name     = ui.inputs.registerName.value.trim();
    const email    = ui.inputs.registerEmail.value.trim().toLowerCase();
    const password = ui.inputs.registerPassword.value;

    if (!name || !email || !password) {
        showError(ui.errors.register, 'Todos os campos são obrigatórios.');
        return;
    }
    if (password.length < 6) {
        showError(ui.errors.register, 'A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    const users = db.getUsers();
    if (users.some(u => u.email === email)) {
        showError(ui.errors.register, 'Este e-mail já está cadastrado.');
        return;
    }

    const newUser = { id: Date.now().toString(), name, email, password };
    db.saveUsers([...users, newUser]);
    db.setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    loadDashboard();
};

const handleLogin = (e) => {
    e.preventDefault();
    clearErrors();

    const email    = ui.inputs.loginEmail.value.trim().toLowerCase();
    const password = ui.inputs.loginPassword.value;

    if (!email || !password) {
        showError(ui.errors.login, 'Preencha e-mail e senha para continuar.');
        return;
    }

    const user = db.getUsers().find(u => u.email === email && u.password === password);
    if (!user) {
        showError(ui.errors.login, 'E-mail não cadastrado ou senha incorreta.');
        return;
    }

    db.setCurrentUser({ id: user.id, name: user.name, email: user.email });
    loadDashboard();
};

const handleLogout = () => {
    db.clearCurrentUser();
    resetEditMode();
    navigateTo('login');
};

// ─────────────────────────────────────────────
// 8. MODO EDIÇÃO DO FORMULÁRIO
// ─────────────────────────────────────────────
const enterEditMode = (todoId) => {
    const todo = db.getTodos().find(t => t.id === todoId);
    if (!todo) return;

    state.editingId = todoId;

    // Preenche formulário
    ui.inputs.todoTitle.value       = todo.title;
    ui.inputs.todoType.value        = todo.type;
    ui.inputs.todoDescription.value = todo.description;

    // Atualiza visual do formulário
    ui.elements.formTitle.childNodes[ui.elements.formTitle.childNodes.length - 1].textContent = ' Editar Tarefa';
    ui.elements.submitLabel.textContent  = 'Salvar Alterações';
    ui.elements.submitIcon.innerHTML     = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>';
    ui.elements.cancelEditBtn.classList.remove('hidden');

    // Scroll suave ao formulário
    document.getElementById('todo-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    ui.inputs.todoTitle.focus();
};

const resetEditMode = () => {
    state.editingId = null;
    ui.forms.todo.reset();
    ui.elements.formTitle.childNodes[ui.elements.formTitle.childNodes.length - 1].textContent = ' Nova Tarefa';
    ui.elements.submitLabel.textContent  = 'Adicionar Tarefa';
    ui.elements.submitIcon.innerHTML     = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>';
    ui.elements.cancelEditBtn.classList.add('hidden');
    clearErrors();
};

ui.elements.cancelEditBtn.addEventListener('click', resetEditMode);

// ─────────────────────────────────────────────
// 9. CRUD DE TAREFAS
// ─────────────────────────────────────────────
const handleAddTodo = (e) => {
    e.preventDefault();
    clearErrors();

    const title       = ui.inputs.todoTitle.value.trim();
    const type        = ui.inputs.todoType.value;
    const description = ui.inputs.todoDescription.value.trim();
    const currentUser = db.getCurrentUser();

    if (!title) {
        showError(ui.errors.todo, 'O título da tarefa é obrigatório.');
        return;
    }

    const todos = db.getTodos();

    if (state.editingId) {
        // MODO EDIÇÃO — atualiza tarefa existente
        const updated = todos.map(t =>
            t.id === state.editingId
                ? { ...t, title, type, description }
                : t
        );
        db.saveTodos(updated);
        resetEditMode();
        renderTodos();
        showToast('Tarefa atualizada com sucesso!', 'info');
    } else {
        // MODO CRIAÇÃO — adiciona nova tarefa
        const newTodo = {
            id:          Date.now().toString(),
            userId:      currentUser.email,
            title,
            type,
            description,
            done:        false,
            createdAt:   new Date().toISOString()
        };
        db.saveTodos([...todos, newTodo]);
        ui.forms.todo.reset();
        renderTodos();
        showToast('Tarefa adicionada!', 'success');
    }
};

const toggleTodoDone = (todoId) => {
    const todos   = db.getTodos();
    const updated = todos.map(t => t.id === todoId ? { ...t, done: !t.done } : t);
    db.saveTodos(updated);

    const task  = updated.find(t => t.id === todoId);
    showToast(task.done ? 'Tarefa concluída! ✓' : 'Tarefa reaberta.', task.done ? 'success' : 'info');
    renderTodos();
};

// ─────────────────────────────────────────────
// 10. FILTROS E BUSCA
// ─────────────────────────────────────────────
const applyFilters = (todos) => {
    const { status, type, search } = state.filter;
    return todos
        .filter(t => {
            if (status === 'pending') return !t.done;
            if (status === 'done')    return t.done;
            return true;
        })
        .filter(t => type === 'all' || t.type === type)
        .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase())
                             || t.description.toLowerCase().includes(search.toLowerCase()));
};

// Delegação para os botões de filtro
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;

    const group = btn.dataset.filter;
    const value = btn.dataset.value;

    state.filter[group] = value;

    // Atualiza visual dos botões do mesmo grupo
    document.querySelectorAll(`[data-filter="${group}"]`).forEach(b => {
        b.classList.toggle('active', b.dataset.value === value);
    });

    renderTodos();
});

// Busca em tempo real
ui.inputs.search.addEventListener('input', () => {
    state.filter.search = ui.inputs.search.value.trim();
    ui.elements.searchClear.classList.toggle('hidden', !state.filter.search);
    renderTodos();
});

ui.elements.searchClear.addEventListener('click', () => {
    ui.inputs.search.value = '';
    state.filter.search    = '';
    ui.elements.searchClear.classList.add('hidden');
    renderTodos();
});

// ─────────────────────────────────────────────
// 11. CONFIGURAÇÃO DOS TIPOS
// ─────────────────────────────────────────────
const TYPE_CONFIG = {
    work:     { label: 'Trabalho', badgeClass: 'badge-work',     cardClass: 'work'     },
    personal: { label: 'Pessoal',  badgeClass: 'badge-personal', cardClass: 'personal' },
    study:    { label: 'Estudos',  badgeClass: 'badge-study',    cardClass: 'study'    }
};

// ─────────────────────────────────────────────
// 12. RENDERIZAÇÃO
// ─────────────────────────────────────────────
const buildTaskCard = (todo) => {
    const config = TYPE_CONFIG[todo.type] || TYPE_CONFIG.work;
    const card   = document.createElement('div');

    card.className = `task-card ${config.cardClass} ${todo.done ? 'done' : ''} rounded-xl p-5 fade-in`;
    card.dataset.id = todo.id;

    card.innerHTML = `
        <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                    <span class="${config.badgeClass} text-xs font-semibold px-2.5 py-1 rounded-full">
                        ${config.label}
                    </span>
                    ${todo.done
                        ? `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">✓ Concluída</span>`
                        : ''}
                </div>
                <h3 class="font-semibold text-sm leading-snug ${todo.done ? 'task-done-title' : 'text-white'}">
                    ${escapeHtml(todo.title)}
                </h3>
                ${todo.description
                    ? `<p class="text-slate-500 text-xs mt-1.5 leading-relaxed">${escapeHtml(todo.description)}</p>`
                    : ''}
            </div>

            <!-- Ações -->
            <div class="flex items-center gap-2 shrink-0">
                ${!todo.done ? `
                <button
                    data-action="edit"
                    data-id="${todo.id}"
                    title="Editar tarefa"
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                           bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20"
                >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </button>` : ''}
                <button
                    data-action="toggle"
                    data-id="${todo.id}"
                    title="${todo.done ? 'Reabrir tarefa' : 'Marcar como concluída'}"
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                           ${todo.done
                               ? 'bg-slate-700/60 hover:bg-slate-700 text-slate-400'
                               : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/25'}"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </button>
                <button
                    data-action="delete"
                    data-id="${todo.id}"
                    title="Excluir tarefa"
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                           bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    return card;
};

const renderTodos = () => {
    const currentUser = db.getCurrentUser();
    if (!currentUser) return;

    const allTodos  = db.getTodos();
    const userTodos = allTodos.filter(t => t.userId === currentUser.email);

    // Estatísticas (sempre sobre todos, sem filtro)
    const doneCount    = userTodos.filter(t => t.done).length;
    const pendingCount = userTodos.length - doneCount;
    ui.elements.statTotal.textContent   = userTodos.length;
    ui.elements.statDone.textContent    = doneCount;
    ui.elements.statPending.textContent = pendingCount;

    // Aplica filtros
    const filtered = applyFilters(userTodos);

    // Ordena: pendentes primeiro, concluídas ao final
    const sorted = [
        ...filtered.filter(t => !t.done),
        ...filtered.filter(t => t.done)
    ];

    // Atualiza contador de resultados do filtro
    const hasActiveFilter = state.filter.status !== 'all'
                         || state.filter.type   !== 'all'
                         || state.filter.search !== '';
    ui.elements.filterCount.textContent = hasActiveFilter
        ? `(${sorted.length} de ${userTodos.length})`
        : '';

    // Gerencia estados de vazio
    ui.elements.todoList.innerHTML = '';
    ui.elements.emptyState.classList.add('hidden');
    ui.elements.emptyFilterState.classList.add('hidden');

    if (userTodos.length === 0) {
        ui.elements.emptyState.classList.remove('hidden');
        return;
    }
    if (sorted.length === 0) {
        ui.elements.emptyFilterState.classList.remove('hidden');
        return;
    }

    // Renderiza os cards
    sorted.forEach(todo => ui.elements.todoList.appendChild(buildTaskCard(todo)));
};

// Delegação de eventos nos cards
ui.elements.todoList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id     = btn.dataset.id;

    if (action === 'toggle') toggleTodoDone(id);
    if (action === 'delete') openConfirmModal(id);
    if (action === 'edit')   enterEditMode(id);
});

// ─────────────────────────────────────────────
// 13. INICIALIZAÇÃO DO DASHBOARD
// ─────────────────────────────────────────────
const loadDashboard = () => {
    const currentUser = db.getCurrentUser();
    if (!currentUser) { navigateTo('login'); return; }

    ui.elements.userGreeting.textContent = currentUser.name;
    navigateTo('dashboard');
    resetEditMode();
    renderTodos();
};

// ─────────────────────────────────────────────
// 14. UTILITÁRIOS
// ─────────────────────────────────────────────
const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

// ─────────────────────────────────────────────
// 15. EVENT LISTENERS GLOBAIS
// ─────────────────────────────────────────────
ui.links.goToRegister.addEventListener('click', (e) => { e.preventDefault(); navigateTo('register'); });
ui.links.goToLogin.addEventListener('click',    (e) => { e.preventDefault(); navigateTo('login');    });

ui.forms.register.addEventListener('submit', handleRegister);
ui.forms.login.addEventListener('submit',    handleLogin);
ui.forms.todo.addEventListener('submit',     handleAddTodo);
ui.buttons.logout.addEventListener('click',  handleLogout);

// ─────────────────────────────────────────────
// 16. BOOT
// ─────────────────────────────────────────────
const init = () => {
    const currentUser = db.getCurrentUser();
    if (currentUser) {
        loadDashboard();
    } else {
        navigateTo('login');
    }
};

init();
