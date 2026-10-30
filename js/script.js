
document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector, context = document) =>
        context.querySelector(selector);

    const $$ = (selector, context = document) =>
        [...context.querySelectorAll(selector)];

    // ==========================================
    // CONFIGURAÇÕES E ARMAZENAMENTO
    // ==========================================

    const STORAGE = {
        users: "avancaUsers",
        session: "avancaSession",
        profile: "avancaProfile",
        theme: "avancaTheme",
        saved: "avancaSavedOpportunities"
    };

    function readStorage(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch {
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }

    function generateId() {
        if (window.crypto && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        return `user-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;
    }

    function normalizeUsers() {
        const users = readStorage(STORAGE.users, []);

        if (!Array.isArray(users)) {
            return [];
        }

        let changed = false;

        users.forEach(user => {
            if (!user.id) {
                user.id = generateId();
                changed = true;
            }

            if (user.email) {
                const normalizedEmail = user.email.trim().toLowerCase();

                if (user.email !== normalizedEmail) {
                    user.email = normalizedEmail;
                    changed = true;
                }
            }
        });

        if (changed) {
            writeStorage(STORAGE.users, users);
        }

        return users;
    }

    // ==========================================
    // TEMA CLARO E ESCURO
    // ==========================================

    function applyTheme(theme) {
        const selectedTheme = theme === "dark" ? "dark" : "light";

        document.documentElement.dataset.theme = selectedTheme;

        $$("[data-theme-toggle]").forEach(button => {
            button.textContent =
                selectedTheme === "dark" ? "☀" : "◐";

            button.setAttribute(
                "aria-label",
                selectedTheme === "dark"
                    ? "Ativar tema claro"
                    : "Ativar tema escuro"
            );
        });
    }

    const savedTheme = localStorage.getItem(STORAGE.theme) || "light";

    applyTheme(savedTheme);

    $$("[data-theme-toggle]").forEach(button => {
        button.addEventListener("click", () => {
            const current =
                document.documentElement.dataset.theme;

            const next = current === "dark" ? "light" : "dark";

            localStorage.setItem(STORAGE.theme, next);
            applyTheme(next);
        });
    });

    // ==========================================
    // MENU RESPONSIVO
    // ==========================================

    const menuToggle = $("#menuToggle");
    const mainNav = $("#mainNav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.textContent = isOpen ? "×" : "☰";
        });

        $$(".main-nav a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            });
        });
    }

    // ==========================================
    // ANO AUTOMÁTICO
    // ==========================================

    $$("[data-year]").forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    // ==========================================
    // ANIMAÇÕES DE ENTRADA
    // ==========================================

    const revealElements = $$(
        ".section-heading, .opportunity-card, " +
        ".courses-content, .courses-decoration, " +
        ".about-points article, .cta-section, " +
        ".form-card, .welcome, .opportunity-item, " +
        ".filter-area, .results-header, .search-box"
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !reduceMotion) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        revealElements.forEach(element => {
            element.setAttribute("data-reveal", "");
            observer.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });
    }

    // ==========================================
    // TRANSIÇÃO ENTRE PÁGINAS
    // ==========================================

    $$('a[href]').forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                link.target === "_blank" ||
                link.hasAttribute("download") ||
                link.dataset.noTransition !== undefined ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const destination = new URL(href, location.href);

            if (destination.origin !== location.origin) {
                return;
            }

            if (
                destination.pathname === location.pathname &&
                destination.search === location.search
            ) {
                return;
            }

            event.preventDefault();

            document.body.classList.add("is-leaving");

            setTimeout(() => {
                location.href = destination.href;
            }, 180);
        });
    });

    // ==========================================
    // CADASTRO
    // ==========================================

    const registerForm = $("#registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", event => {
            event.preventDefault();

            const name = $("#name").value.trim();
            const email = $("#email").value.trim().toLowerCase();
            const password = $("#password").value;
            const confirmation = $("#confirmPassword").value;
            const terms = $("#terms");

            if (name.length < 3) {
                alert("Informe seu nome completo.");
                return;
            }

            if (!email || !$("#email").validity.valid) {
                alert("Informe um e-mail válido.");
                return;
            }

            if (password.length < 8) {
                alert("A senha precisa ter pelo menos 8 caracteres.");
                return;
            }

            if (password !== confirmation) {
                alert("As senhas não coincidem.");
                return;
            }

            if (terms && !terms.checked) {
                alert("É necessário aceitar os termos para continuar.");
                return;
            }

            const users = normalizeUsers();

            const existingUser = users.some(user =>
                user.email.toLowerCase() === email
            );

            if (existingUser) {
                alert("Este e-mail já possui cadastro. Faça login.");
                return;
            }

            const newUser = {
                id: generateId(),
                name,
                email,
                password,
                area: ""
            };

            users.push(newUser);

            if (!writeStorage(STORAGE.users, users)) {
                alert("Não foi possível salvar seu cadastro neste navegador.");
                return;
            }

            writeStorage(STORAGE.profile, {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                area: ""
            });

            alert("Cadastro realizado com sucesso!");

            location.href = "login.html";
        });
    }

    // ==========================================
    // LOGIN
    // ==========================================

    const loginForm = $("#loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", event => {
            event.preventDefault();

            const email = $("#email").value.trim().toLowerCase();
            const password = $("#password").value;
            const remember = $("#remember");

            const users = normalizeUsers();

            const user = users.find(item =>
                item.email.toLowerCase() === email &&
                item.password === password
            );

            if (!user) {
                alert("E-mail ou senha incorretos. Verifique seus dados.");
                return;
            }

            const session = {
                userId: user.id,
                name: user.name,
                email: user.email
            };

            const profile = {
                id: user.id,
                name: user.name,
                email: user.email,
                area: user.area || ""
            };

            if (!writeStorage(STORAGE.profile, profile)) {
                alert("Não foi possível iniciar sua sessão.");
                return;
            }

            try {
                if (remember && remember.checked) {
                    localStorage.setItem(
                        STORAGE.session,
                        JSON.stringify(session)
                    );

                    sessionStorage.removeItem(STORAGE.session);
                } else {
                    sessionStorage.setItem(
                        STORAGE.session,
                        JSON.stringify(session)
                    );

                    localStorage.removeItem(STORAGE.session);
                }
            } catch {
                alert("Não foi possível iniciar sua sessão neste navegador.");
                return;
            }

            location.href = "dashboard.html";
        });
    }

    // ==========================================
    // FILTROS E PESQUISA DE OPORTUNIDADES
    // ==========================================

    const searchInput = $("#searchInput");
    const searchButton = $("#searchButton");

    const opportunityItems = $$(".opportunity-item");
    const filterButtons = $$(".filter-button, [data-filter]");

    const resultsCount = $("#resultsCount");
    const emptyResults = $("#emptyResults");

    if (opportunityItems.length) {
        const validFilters = [
            "todos",
            "emprego",
            "estagio",
            "curso",
            "empreendedorismo"
        ];

        const requestedCategory =
            new URLSearchParams(location.search).get("categoria");

        let activeFilter = validFilters.includes(requestedCategory)
            ? requestedCategory
            : "todos";

        function filterOpportunities() {
            const searchTerm = searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";

            let visibleCount = 0;

            opportunityItems.forEach(item => {
                const category = (
                    item.dataset.category || "todos"
                ).toLowerCase();

                const content = item.textContent.toLowerCase();

                const matchesCategory =
                    activeFilter === "todos" ||
                    category === activeFilter;

                const matchesSearch =
                    content.includes(searchTerm);

                const visible = matchesCategory && matchesSearch;

                item.hidden = !visible;

                if (visible) visibleCount++;
            });

            if (resultsCount) {
                resultsCount.textContent =
                    `${visibleCount} ${
                        visibleCount === 1
                            ? "oportunidade encontrada"
                            : "oportunidades encontradas"
                    }`;
            }

            if (emptyResults) {
                emptyResults.hidden = visibleCount !== 0;
            }
        }

        filterButtons.forEach(button => {
            const filter = button.dataset.filter;

            button.classList.toggle(
                "active",
                filter === activeFilter
            );

            button.addEventListener("click", () => {
                if (!validFilters.includes(filter)) return;

                activeFilter = filter;

                filterButtons.forEach(item => {
                    item.classList.toggle(
                        "active",
                        item.dataset.filter === activeFilter
                    );
                });

                filterOpportunities();
            });
        });

        searchInput?.addEventListener(
            "input",
            filterOpportunities
        );

        searchButton?.addEventListener(
            "click",
            filterOpportunities
        );

        searchInput?.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                filterOpportunities();
            }
        });

        filterOpportunities();
    }

    // ==========================================
    // SALVAR OPORTUNIDADES
    // ==========================================

    const savedKey = STORAGE.saved;

    function getSavedOpportunities() {
        const saved = readStorage(savedKey, []);
        return Array.isArray(saved) ? saved : [];
    }

    function updateSaveButton(button) {
        const saved = getSavedOpportunities();

        const isSaved = saved.some(item =>
            item.id === button.dataset.id
        );

        button.classList.toggle("saved", isSaved);

        button.textContent = isSaved
            ? "✓ Salva"
            : "♡ Salvar oportunidade";
    }

    $$(".save-opportunity-button").forEach(button => {
        updateSaveButton(button);

        button.addEventListener("click", () => {
            const saved = getSavedOpportunities();

            const index = saved.findIndex(item =>
                item.id === button.dataset.id
            );

            if (index >= 0) {
                saved.splice(index, 1);
            } else {
                saved.push({
                    id: button.dataset.id,
                    title: button.dataset.title || "Oportunidade",
                    company: button.dataset.company || "",
                    category: button.dataset.category || ""
                });
            }

            if (!writeStorage(savedKey, saved)) {
                alert("Não foi possível atualizar suas oportunidades salvas.");
                return;
            }

            updateSaveButton(button);
        });
    });
});
