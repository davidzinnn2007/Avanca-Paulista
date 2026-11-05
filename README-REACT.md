# AVANÇA PAULISTA | React + Vite

Migração do projeto original para React com Vite e React Router DOM.

## Requisitos
- Node.js 20 ou superior
- npm

## Executar
```bash
npm install
npm run dev
```

## Gerar versão de produção
```bash
npm run build
npm run preview
```

## Funcionalidades
- Página inicial mantendo a identidade visual original.
- Cadastro e login demonstrativos.
- Cadastro realiza login automaticamente e direciona para Minha área.
- Cabeçalho condicional: visitantes veem Entrar/Criar conta; usuários autenticados veem Minha área/Sair.
- Tema claro/escuro com preferência persistida.
- Pesquisa, filtros e salvamento de oportunidades por usuário.
- Dashboard com edição de perfil e oportunidades salvas.
- Recuperação demonstrativa de senha.

## Observação de segurança
Esta versão é front-end demonstrativa. Os dados ficam no navegador e não substituem autenticação de produção. Para produção, implemente uma API, banco de dados, hash de senhas no servidor, sessões seguras e fluxo real de recuperação de senha. A recuperação local não comprova a identidade do usuário.
