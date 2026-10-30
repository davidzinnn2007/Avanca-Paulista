
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recoveryForm");
    const emailInput = document.getElementById("email");
    const passwordFields = document.getElementById("passwordFields");
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const message = document.getElementById("recoveryMessage");
    const button = document.getElementById("recoveryButton");

    const stepOne = document.getElementById("stepOne");
    const stepTwo = document.getElementById("stepTwo");
    const stepLine = document.getElementById("stepLine");

    let emailConfirmed = false;

    /* TEMA CLARO E ESCURO */

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const themeLabel = document.getElementById("themeLabel");

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;

        const dark = theme === "dark";

        themeIcon.textContent = dark ? "☀" : "☾";
        themeLabel.textContent = dark ? "Tema claro" : "Tema escuro";

        themeToggle.setAttribute(
            "aria-label",
            dark ? "Ativar tema claro" : "Ativar tema escuro"
        );

        localStorage.setItem("avancaTheme", theme);
    }

    const savedTheme = localStorage.getItem("avancaTheme") || "light";
    applyTheme(savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.dataset.theme;
        applyTheme(currentTheme === "dark" ? "light" : "dark");
    });

    /* MOSTRAR E OCULTAR SENHA */

    document.querySelectorAll(".password-toggle").forEach(toggle => {
        toggle.addEventListener("click", () => {
            const input = document.getElementById(toggle.dataset.target);

            if (!input) return;

            const showing = input.type === "text";
            input.type = showing ? "password" : "text";

            toggle.setAttribute(
                "aria-label",
                showing ? "Mostrar senha" : "Ocultar senha"
            );
        });
    });

    /* DADOS DOS USUÁRIOS */

    function readUsers() {
        try {
            const users = JSON.parse(
                localStorage.getItem("avancaUsers") || "[]"
            );

            return Array.isArray(users) ? users : [];
        } catch {
            return [];
        }
    }

    function showMessage(text, type = "") {
        message.textContent = text;
        message.className = `recovery-message ${type}`;
    }

    function activatePasswordStep() {
        stepOne.classList.remove("active");
        stepOne.classList.add("completed");

        stepTwo.classList.add("active");
        stepLine.classList.add("completed");
    }

    /* RECUPERAÇÃO DE SENHA */

    form.addEventListener("submit", event => {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();

        if (!emailConfirmed) {
            if (!email || !emailInput.validity.valid) {
                showMessage("Informe um endereço de e-mail válido.", "error");
                emailInput.focus();
                return;
            }

            const users = readUsers();

            const userExists = users.some(user =>
                String(user.email || "").trim().toLowerCase() === email
            );

            if (!userExists) {
                showMessage(
                    "Não encontramos uma conta com esse e-mail.",
                    "error"
                );
                return;
            }

            emailConfirmed = true;
            emailInput.readOnly = true;

            passwordFields.hidden = false;

            newPassword.required = true;
            confirmPassword.required = true;

            button.querySelector("span:first-child").textContent =
                "Salvar nova senha";

            activatePasswordStep();

            showMessage(
                "Conta encontrada! Agora informe sua nova senha.",
                "success"
            );

            newPassword.focus();
            return;
        }

        const password = newPassword.value;
        const confirmation = confirmPassword.value;

        if (password.length < 8) {
            showMessage(
                "A senha precisa ter pelo menos 8 caracteres.",
                "error"
            );
            newPassword.focus();
            return;
        }

        if (password !== confirmation) {
            showMessage("As senhas não coincidem.", "error");
            confirmPassword.focus();
            return;
        }

        const users = readUsers();

        const userIndex = users.findIndex(user =>
            String(user.email || "").trim().toLowerCase() === email
        );

        if (userIndex === -1) {
            showMessage(
                "Não foi possível localizar sua conta.",
                "error"
            );
            return;
        }

        users[userIndex].password = password;

        try {
            localStorage.setItem("avancaUsers", JSON.stringify(users));
        } catch {
            showMessage(
                "Não foi possível salvar a nova senha neste navegador.",
                "error"
            );
            return;
        }

        showMessage(
            "Senha alterada com sucesso! Redirecionando para o login...",
            "success"
        );

        button.disabled = true;
        button.querySelector("span:first-child").textContent = "Senha atualizada";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });
});
