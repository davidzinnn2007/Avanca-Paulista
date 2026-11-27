# Guia técnico de desenvolvimento | AVANÇA PAULISTA

<p align="center">
  <img src="public/assets/logo-avanca-paulista.png" alt="Logotipo do AVANÇA PAULISTA" width="220" />
</p>

<p align="center">
  <strong>Documentação técnica da aplicação React + Vite</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18%2B-149ECA?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=222" alt="JavaScript" />
</p>

> Este documento descreve a implementação presente no repositório. O projeto é um protótipo acadêmico front-end: cadastro, login, recuperação de senha e persistência são demonstrativos e não constituem autenticação adequada para produção.

## 1. Stack atual

| Tecnologia/recurso | Responsabilidade no projeto |
|---|---|
| React | Composição da interface por componentes. |
| Vite | Ambiente de desenvolvimento e geração do build. |
| JavaScript com ES Modules | Lógica da aplicação e organização dos módulos. |
| React Router DOM | Definição das rotas e navegação. |
| Context API | Compartilhamento dos estados de autenticação e tema. |
| CSS | Estilos globais, estilos específicos e temas. |
| Web Storage API | Armazenamento local dos dados demonstrativos. |

As dependências e os comandos disponíveis estão declarados em `package.json`. O projeto utiliza os scripts `dev`, `build` e `preview`.

## 2. Requisitos de ambiente

- Node.js instalado.
- npm, incluído na instalação do Node.js.

Confira o ambiente:

```bash
node --version
npm --version
```

O `package.json` atual não fixa uma versão mínima de Node.js. Em caso de incompatibilidade, consulte a versão suportada pela versão do Vite instalada.

## 3. Instalação e execução

Na raiz do repositório:

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite no terminal, normalmente `http://localhost:5173`.

Para gerar e visualizar o build:

```bash
npm run build
npm run preview
```

O build é gerado na pasta `dist/`.

## 4. Organização do código

```text
src/
├── components/
│   └── Layout.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/
│   ├── About.jsx
│   ├── AuthPages.jsx
│   ├── Courses.jsx
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   └── Opportunities.jsx
├── styles/
│   ├── app.css
│   ├── dashboard.css
│   ├── legacy.css
│   └── recovery.css
└── main.jsx
```

### Responsabilidade dos diretórios

| Caminho | Responsabilidade |
|---|---|
| `src/components/` | Componentes compartilhados, incluindo a estrutura de navegação do site. |
| `src/contexts/` | Estados compartilhados de autenticação e preferência de tema. |
| `src/pages/` | Componentes que representam as páginas e os fluxos da aplicação. |
| `src/styles/` | Folhas de estilo globais e específicas. |
| `public/assets/` | Arquivos estáticos públicos, como logotipo e favicon. |
| `src/main.jsx` | Ponto de entrada React, providers e configuração das rotas. |

## 5. Inicialização e rotas

As rotas são declaradas em `src/main.jsx` com React Router DOM. Os providers `ThemeProvider` e `AuthProvider` envolvem a aplicação.

| Rota | Componente | Regra de acesso |
|---|---|---|
| `/` | `Home` | Pública |
| `/oportunidades` | `Opportunities` | Pública |
| `/cursos` | `Courses` | Pública |
| `/sobre` | `About` | Pública |
| `/login` | `Login` | Visitantes |
| `/cadastro` | `Register` | Visitantes |
| `/recuperar-senha` | `Recovery` | Visitantes |
| `/dashboard` | `Dashboard` | Protegida por `RequireAuth` |

O componente `GuestOnly` redireciona usuários autenticados para `/dashboard`. O componente `RequireAuth` direciona visitantes não autenticados para `/login?next=/dashboard`.

Rotas não reconhecidas apresentam uma página de erro com link para retornar à página inicial.

## 6. Contextos da aplicação

### 6.1. AuthContext

Arquivo: `src/contexts/AuthContext.jsx`

O contexto centraliza as operações do fluxo de conta e disponibiliza:

- `user`: usuário atualmente autenticado.
- `register(...)`: registra uma conta local.
- `login(...)`: valida os dados locais e inicia a sessão.
- `logout()`: encerra a sessão local.
- `updateProfile(...)`: atualiza os dados do perfil.
- `resetPassword(...)`: altera a senha armazenada localmente.
- `readLocal(...)` e `writeLocal(...)`: utilitários de leitura e gravação no armazenamento local.
- `SAVED_KEY_NAME`: chave utilizada para armazenar oportunidades salvas.

As chaves de armazenamento utilizadas incluem `avancaUsers`, `avancaSession`, `avancaProfile` e `avancaSavedOpportunities`.

### 6.2. ThemeContext

Arquivo: `src/contexts/ThemeContext.jsx`

O contexto disponibiliza `theme` e `toggleTheme()`. A preferência é mantida na chave `avancaTheme` do `localStorage` e aplicada ao atributo `data-theme` do elemento raiz do documento.

## 7. Funcionalidades e fluxos

### Página inicial

Componente: `src/pages/Home.jsx`

Apresenta a proposta da plataforma e utiliza imagens de fundo presentes no diretório `assets/`. Também contém comportamento de entrada de elementos na área visível da página por meio de `IntersectionObserver`.

### Oportunidades

Componente: `src/pages/Opportunities.jsx`

A página trabalha com registros demonstrativos definidos no próprio código e oferece:

- Pesquisa textual.
- Filtro por categoria.
- Categorias de empregos, estágios, cursos e empreendedorismo.
- Salvamento e remoção de oportunidades para o usuário autenticado.
- Redirecionamento para login quando um visitante tenta salvar um item.

Os registros exibidos são exemplos e não representam oportunidades verificadas.

### Cursos

Componente: `src/pages/Courses.jsx`

Apresenta conteúdos e áreas de capacitação profissional.

### Sobre

Componente: `src/pages/About.jsx`

Apresenta informações sobre a proposta do AVANÇA PAULISTA.

### Cadastro e autenticação

Componente: `src/pages/AuthPages.jsx`

Reúne os fluxos de login, cadastro e recuperação demonstrativa de senha. O cadastro valida os campos, exige senha com pelo menos oito caracteres, verifica a confirmação e exige o aceite dos termos. Após o cadastro, o fluxo realiza o login local e encaminha o usuário à área autenticada.

### Minha área

Componente: `src/pages/Dashboard.jsx`

Disponibiliza:

- Resumo de oportunidades disponíveis e salvas.
- Edição do nome e da área de interesse.
- Consulta das oportunidades salvas.
- Remoção de itens salvos.
- Encerramento da sessão local.

## 8. Persistência e segurança

A persistência atual ocorre no navegador. Essa abordagem atende à demonstração local, mas possui limitações:

- Não existe sincronização centralizada entre usuários ou dispositivos.
- O usuário pode inspecionar ou modificar os dados armazenados no próprio navegador.
- Hash SHA-256 calculado no cliente não substitui o armazenamento de senhas no servidor com algoritmo próprio para senhas.
- A recuperação de senha local não envia mensagem nem verifica a posse do e-mail.
- A proteção de rotas no front-end não substitui autorização no servidor.

**Não utilize esta implementação para contas reais, dados sensíveis ou operação pública.**

Uma arquitetura de produção deve mover autenticação, autorização e regras de negócio para uma API, persistir os dados em banco de dados e aplicar controles de segurança no servidor.

## 9. Dados demonstrativos

A página de oportunidades contém registros de exemplo definidos no código. Eles demonstram listagem, pesquisa, filtros e salvamento. Não representam anúncios verificados nem devem ser divulgados como vagas reais.

## 10. Estilos e identidade visual

Os estilos estão organizados em `src/styles/`:

- `app.css`: estilos principais da aplicação.
- `dashboard.css`: estilos da área do usuário.
- `legacy.css`: estilos complementares e reaproveitados.
- `recovery.css`: estilos relacionados à recuperação de acesso.

O tema claro/escuro é controlado pelo `ThemeContext`. Ao realizar alterações visuais, preserve a consistência dos componentes e verifique os dois temas e diferentes larguras de tela.

## 11. Fluxo recomendado para alterações

1. Identifique a página, componente ou contexto responsável pela funcionalidade.
2. Verifique se o estado deve ser local ou compartilhado pela Context API.
3. Preserve os caminhos, nomes e contratos utilizados por outros componentes.
4. Mantenha os estilos alinhados à organização existente e evite regras duplicadas.
5. Teste o fluxo em telas grandes e pequenas.
6. Verifique navegação, estados vazios, mensagens de erro e acessibilidade por teclado.
7. Execute `npm run build` antes de considerar a alteração concluída.

## 12. Checklist de validação manual

Marque cada item somente depois de executar a verificação no ambiente local.

- [ ] A página inicial abre sem erros.
- [ ] Os links de navegação levam às rotas corretas.
- [ ] O cadastro valida os campos e cria uma conta demonstrativa.
- [ ] O login aceita uma conta cadastrada no mesmo navegador.
- [ ] A opção de lembrar sessão respeita o armazenamento escolhido.
- [ ] A rota `/dashboard` exige autenticação.
- [ ] O perfil pode ser atualizado.
- [ ] Oportunidades podem ser pesquisadas e filtradas.
- [ ] Oportunidades podem ser salvas e removidas.
- [ ] O tema selecionado persiste após atualizar a página.
- [ ] O layout continua utilizável em telas menores.
- [ ] `npm run build` termina sem erros.

## 13. Comandos de referência

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Gerar build
npm run build

# Visualizar o build localmente
npm run preview
```

---

<p align="center">
  <strong>AVANÇA PAULISTA</strong><br />
  Guia técnico da aplicação React + Vite.
</p>
