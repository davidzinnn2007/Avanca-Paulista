/* =========================================
   AVANÇA PAULISTA
   FUNCIONALIDADES DO PAINEL
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const SESSION_KEY = "avancaSession";
    const USERS_KEY = "avancaUsers";
    const PROFILE_KEY = "avancaProfile";
    const SAVED_KEY = "avancaSavedOpportunities";

    const getJSON = (key, fallback) => {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? fallback;
        } catch {
            return fallback;
        }
    };

    function getSession() {
        return getJSON(SESSION_KEY, null) ||
            JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    }

    function getSaved() {
        return getJSON(SAVED_KEY, []);
    }

    function getProfile() {
        return getJSON(PROFILE_KEY, {});
    }

    function getUsers() {
        return getJSON(USERS_KEY, []);
    }

    function saveProfile(profile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

        const users = getUsers();
        const session = getSession();

        const updatedUsers = users.map(user => {
            if (session && user.id === session.userId) {
                return {
                    ...user,
                    name: profile.name,
                    email: profile.email,
                    area: profile.area
                };
            }

            return user;
        });

        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

        if (session) {
            session.name = profile.name;
            session.email = profile.email;

            const savedSession = JSON.stringify(session);

            if (localStorage.getItem(SESSION_KEY)) {
                localStorage.setItem(SESSION_KEY, savedSession);
            } else {
                sessionStorage.setItem(SESSION_KEY, savedSession);
            }
        }
    }

    // PROTEÇÃO SIMPLES DA PÁGINA
    const session = getSession();

    if (!session) {
        alert("Você precisa entrar na sua conta para acessar sua área.");
        window.location.href = "login.html";
        return;
    }

    // ELEMENTOS
    const userName = document.querySelector("#userName");
    const profileName = document.querySelector("#profileName");
    const profileEmail = document.querySelector("#profileEmail");
    const profileArea = document.querySelector("#profileArea");
    const profileAvatar = document.querySelector("#profileAvatar");
    const profileForm = document.querySelector("#profileForm");

    const availableCount = document.querySelector("#availableCount");
    const savedCount = document.querySelector("#savedCount");
    const savedCounter = document.querySelector("#savedCounter");
    const profileStatus = document.querySelector("#profileStatus");

    const savedContainer = document.querySelector("#savedOpportunities");
    const logoutButton = document.querySelector("#logoutButton");

    // CARREGAR PERFIL
    let profile = getProfile();

    if (!profile.name) {
        profile = {
            name: session.name || "",
            email: session.email || "",
            area: ""
        };
    }

    function updateProfileDisplay() {
        const firstName = profile.name.trim().split(" ")[0] || "jovem";

        userName.textContent = firstName;
        profileName.value = profile.name;
        profileEmail.value = profile.email;
        profileArea.value = profile.area || "";

        profileAvatar.textContent = firstName.charAt(0).toUpperCase();

        const complete = Boolean(
            profile.name.trim() &&
            profile.email.trim() &&
            profile.area
        );

        profileStatus.textContent = complete ? "Completo" : "Incompleto";
    }

    updateProfileDisplay();

    // SALVAR ALTERAÇÕES DO PERFIL
    profileForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = profileName.value.trim();
        const email = profileEmail.value.trim().toLowerCase();
        const area = profileArea.value;

        if (name.length < 3) {
            alert("Digite seu nome completo.");
            return;
        }

        if (!email) {
            alert("Informe um e-mail válido.");
            return;
        }

        profile = { ...profile, name, email, area };

        saveProfile(profile);
        updateProfileDisplay();

        alert("Seu perfil foi atualizado!");
    });

    // CONTADOR DE OPORTUNIDADES
    const totalOpportunities = Number(
        localStorage.getItem("avancaOpportunityCount")
    ) || 6;

    availableCount.textContent = totalOpportunities;

    // OPORTUNIDADES SALVAS
    function renderSavedOpportunities() {
        const saved = getSaved();

        savedCount.textContent = saved.length;
        savedCounter.textContent = saved.length;

        if (saved.length === 0) {
            savedContainer.innerHTML = `
                <div class="saved-empty">
                    <strong>Nenhuma oportunidade salva.</strong>
                    Explore as oportunidades e salve aquelas que despertarem seu interesse.
                </div>
            `;
            return;
        }

        savedContainer.innerHTML = saved.map((item, index) => `
            <article class="saved-opportunity">
                <h3>${escapeHTML(item.title)}</h3>
                <p>${escapeHTML(item.company || "Empresa não informada")}</p>

                <div class="saved-opportunity-footer">
                    <span class="saved-category">${escapeHTML(item.category || "Oportunidade")}</span>
                    <button
                        type="button"
                        class="remove-saved"
                        data-index="${index}"
                    >
                        Remover
                    </button>
                </div>
            </article>
        `).join("");

        savedContainer.querySelectorAll(".remove-saved").forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);
                const currentSaved = getSaved();

                currentSaved.splice(index, 1);

                localStorage.setItem(
                    SAVED_KEY,
                    JSON.stringify(currentSaved)
                );

                renderSavedOpportunities();
            });
        });
    }

    // Evita inserir HTML digitado pelo usuário diretamente na página
    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entities[character];
        });
    }

    renderSavedOpportunities();

    // SAIR DA CONTA
    logoutButton.addEventListener("click", () => {
        const confirmed = confirm("Deseja realmente sair da sua conta?");

        if (!confirmed) return;

        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);

        window.location.href = "login.html";
    });
});
