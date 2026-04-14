class AppHeader extends HTMLElement {
    connectedCallback() {
        this.render();
        this.bindEvents();
        this.applyTheme(this.getSavedTheme());
    }

    render() {
        const title = this.getAttribute('title') || 'Sistema Universitario';
        const subtitle = this.getAttribute('subtitle') || '';
        const backUrl = this.getAttribute('back-url');
        const logoutUrl = this.getAttribute('logout-url');
        const helpUrl = this.getAttribute('help-url');

        const backButton = backUrl ? `<button type="button" id="headerBackBtn" class="btn btn-info btn-sm">Atrás</button>` : '';
        const logoutButton = logoutUrl ? `<button type="button" id="headerLogoutBtn" class="btn btn-primary btn-sm">Cerrar Sesión</button>` : '';
        const helpButton = helpUrl ? `<a class="btn btn-outline-light btn-sm" href="${helpUrl}">Ayuda</a>` : '';

        this.innerHTML = `
            <header>
                <nav class="navbar navbar_Logo">
                    <div class="container-fluid">
                        <a class="navbar-brand d-flex align-items-center" href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="80" viewBox="0 0 16 16" class="Logo_NAV">
                                <path fill-rule="evenodd" d="M8.5.134a1 1 0 0 0-1 0l-6 3.577a1 1 0 0 0-.5.866v6.846a1 1 0 0 0 .5.866l6 3.577a1 1 0 0 0 1 0l6-3.577a1 1 0 0 0 .5-.866V4.577a1 1 0 0 0-.5-.866z"/>
                            </svg>
                            <span class="texto_nav">${title}</span>
                        </a>
                        <div class="ms-auto d-flex gap-2 align-items-center flex-wrap">
                            ${backButton}
                            ${logoutButton}
                            ${helpButton}
                            <button type="button" class="btn btn-outline-light btn-sm theme-toggle-btn" id="themeToggleBtn">Modo Claro</button>
                        </div>
                    </div>
                </nav>
                <div class="logo_cul"></div>
                ${subtitle ? `<div class="header-subtitle p-4"><p>${subtitle}</p></div>` : ''}
            </header>
        `;
    }

    bindEvents() {
        const backBtn = this.querySelector('#headerBackBtn');
        const logoutBtn = this.querySelector('#headerLogoutBtn');
        const themeBtn = this.querySelector('#themeToggleBtn');

        const backUrl = this.getAttribute('back-url');
        const logoutUrl = this.getAttribute('logout-url');

        if (backBtn && backUrl) {
            backBtn.addEventListener('click', () => {
                if (backUrl.startsWith('javascript:')) {
                    const code = backUrl.replace(/^javascript:/, '');
                    new Function(code)();
                } else {
                    window.location.href = backUrl;
                }
            });
        }

        if (logoutBtn && logoutUrl) {
            logoutBtn.addEventListener('click', () => {
                window.location.href = logoutUrl;
            });
        }

        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    getSavedTheme() {
        const saved = localStorage.getItem('siteTheme');
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
        const body = document.body;
        const themeBtn = this.querySelector('#themeToggleBtn');
        const selectedTheme = theme === 'light' ? 'light' : 'dark';

        body.dataset.theme = selectedTheme;
        localStorage.setItem('siteTheme', selectedTheme);

        if (themeBtn) {
            themeBtn.textContent = selectedTheme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
            themeBtn.classList.toggle('btn-outline-dark', selectedTheme === 'light');
            themeBtn.classList.toggle('btn-outline-light', selectedTheme === 'dark');
        }
    }

    toggleTheme() {
        const current = document.body.dataset.theme || this.getSavedTheme();
        this.applyTheme(current === 'dark' ? 'light' : 'dark');
    }
}

function applyPageTheme() {
    const savedTheme = localStorage.getItem('siteTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (prefersDark ? 'dark' : 'light');
    document.body.dataset.theme = theme;
}

document.addEventListener('DOMContentLoaded', applyPageTheme);

class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <p>&copy; 2026 Richar Romero. Todos los derechos reservados.</p>
            </footer>
        `;
    }
}

class PageHero extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const subtitle = this.getAttribute('subtitle') || '';
        this.innerHTML = `
            <section class="page-hero mb-4">
                <div>
                    <h1>${title}</h1>
                    <p>${subtitle}</p>
                </div>
            </section>
        `;
    }
}

class StatsSummary extends HTMLElement {
    connectedCallback() {
        const prefix = this.getAttribute('prefix') || '';
        const cards = [
            { label: 'Total Personas', id: 'totalPersonas' },
            { label: 'Total Materias', id: 'totalMaterias' },
            { label: 'Total Programas', id: 'totalProgramas' },
            { label: 'Total Instalaciones', id: 'totalInstalaciones' },
            { label: 'Total Campus', id: 'totalCampus' },
            { label: 'Total Roles', id: 'totalRoles' },
            { label: 'Total Bloques', id: 'totalBloques' },
            { label: 'Áreas Funcionales', id: 'totalAreasFuncionales' },
            { label: 'Horarios Instalación', id: 'totalHorariosInstalacion' },
            { label: 'Estados Instalación', id: 'totalEstadoInstalacion' }
        ];

        this.innerHTML = `
            <div class="row g-4 mb-4">
                ${cards.map(card => {
                    const cardId = prefix ? `${prefix}${card.id.charAt(0).toUpperCase()}${card.id.slice(1)}` : card.id;
                    return `
                    <div class="col-md-3">
                        <div class="stats_card">
                            <p>${card.label}</p>
                            <h2 id="${cardId}">0</h2>
                        </div>
                    </div>
                `;
                }).join('')}
            </div>
        `;
    }
}

// ============= NUEVO: DATA TABLE COMPONENT =============
class DataTable extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        const entity = this.getAttribute('entity') || 'tabla';
        const title = this.getAttribute('title') || `Gestión de ${entity}`;
        const mode = this.getAttribute('mode') || 'admin';
        const buttonText = this.getAttribute('button-text') || 'Agregar';
        const buttonClass = this.getAttribute('button-class') || 'btn-primary';
        const buttonFunction = this.getAttribute('button-function');
        const headersJson = this.getAttribute('headers');
        const tableId = this.getAttribute('table-id') || `${entity}Table`;
        const bodyId = this.getAttribute('body-id') || `${entity}TableBody`;

        const headers = headersJson ? JSON.parse(headersJson) : [];
        
        const addButton = (mode === 'admin' && buttonFunction) ? 
            `<button class="btn ${buttonClass}" onclick="${buttonFunction}()">${buttonText}</button>` : 
            (mode === 'user' ? `<button class="btn btn-primary btn-sm" onclick="userLoad${entity.charAt(0).toUpperCase()}${entity.slice(1)}()">Recargar</button>` : '');

        const headerCells = headers.map(h => `<th>${h}</th>`).join('');
        
        this.innerHTML = `
            <div class="table_card">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="titulo_h4">${title}</h4>
                    ${addButton}
                </div>
                <table class="table table-dark table-hover align-middle" id="${tableId}">
                    <thead>
                        <tr>${headerCells}</tr>
                    </thead>
                    <tbody id="${bodyId}"></tbody>
                </table>
            </div>
        `;
    }
}

// ============= NUEVO: TABS CONTAINER COMPONENT =============
class TabsContainer extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        const mode = this.getAttribute('mode') || 'admin';
        const tabsJson = this.getAttribute('tabs');
        
        if (!tabsJson) {
            this.innerHTML = '<p class="text-danger">Error: No tabs configuradas</p>';
            return;
        }

        const tabs = JSON.parse(tabsJson);
        
        // Generar botones de tabs
        const tabButtons = tabs.map((tab, index) => `
            <li class="nav-item" role="presentation">
                <button class="nav-link ${index === 0 ? 'active' : ''}" 
                        id="${tab.id}-tab" 
                        data-bs-toggle="tab" 
                        data-bs-target="#${tab.id}" 
                        type="button" 
                        role="tab">
                    ${tab.label}
                </button>
            </li>
        `).join('');

        // Generar contenido de tabs con data-tables
        const tabContent = tabs.map((tab, index) => `
            <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" 
                 id="${tab.id}" 
                 role="tabpanel">
                <data-table entity="${tab.entity}" 
                           title="${tab.label}" 
                           mode="${mode}"
                           table-id="${tab.tableId}"
                           body-id="${tab.bodyId}"
                           button-text="${tab.buttonText}"
                           button-class="${tab.buttonClass}"
                           button-function="${tab.buttonFunction}"
                           headers='${JSON.stringify(tab.headers)}'></data-table>
            </div>
        `).join('');

        this.innerHTML = `
            <ul class="nav nav-tabs mb-4" id="dataTabs" role="tablist">
                ${tabButtons}
            </ul>
            <div class="tab-content" id="dataTabsContent">
                ${tabContent}
            </div>
        `;
    }
}

// ============= NUEVO: ADMIN PANEL COMPONENT =============
class AdminPanel extends HTMLElement {
    connectedCallback() {
        // Observar cambios en el atributo 'tabs'
        this.mutationObserver = new MutationObserver(() => this.render());
        this.mutationObserver.observe(this, { attributes: true });
        this.render();
    }

    disconnectedCallback() {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
    }

    render() {
        this.innerHTML = `
            <app-header title="Panel Admin" logout-url="index.html"></app-header>
            <main class="admin_panel">
                <div class="container">
                    <page-hero title="Gestión Universitaria" 
                               subtitle="Administra personas, materias y programas académicos del sistema universitario."></page-hero>
                    <stats-summary prefix=""></stats-summary>
                    ${this.getAttribute('tabs') ? `<tabs-container mode="admin" tabs='${this.getAttribute('tabs')}'></tabs-container>` : ''}
                </div>
            </main>
            <app-footer></app-footer>
        `;
    }
}

// ============= NUEVO: USER PANEL COMPONENT =============
class UserPanel extends HTMLElement {
    connectedCallback() {
        // Observar cambios en el atributo 'tabs'
        this.mutationObserver = new MutationObserver(() => this.render());
        this.mutationObserver.observe(this, { attributes: true });
        this.render();
    }

    disconnectedCallback() {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
    }

    render() {
        this.innerHTML = `
            <app-header title="Consulta Universitaria" 
                       back-url="javascript:history.back()" 
                       logout-url="index.html"></app-header>
            <main class="admin_panel">
                <div class="container">
                    <page-hero title="Consulta de Datos Universitarios" 
                               subtitle="Visualiza la información de personas, materias, programas y más. (Solo lectura)"></page-hero>
                    <stats-summary prefix="user"></stats-summary>
                    ${this.getAttribute('tabs') ? `<tabs-container mode="user" tabs='${this.getAttribute('tabs')}'></tabs-container>` : ''}
                </div>
            </main>
            <app-footer></app-footer>
        `;
    }
}

customElements.define('app-header', AppHeader);
customElements.define('app-footer', AppFooter);
customElements.define('page-hero', PageHero);
customElements.define('stats-summary', StatsSummary);
customElements.define('data-table', DataTable);
customElements.define('tabs-container', TabsContainer);
customElements.define('admin-panel', AdminPanel);
customElements.define('user-panel', UserPanel);
