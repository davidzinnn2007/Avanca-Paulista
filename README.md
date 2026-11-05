# AVANÇA PAULISTA

### Plataforma de cursos, capacitação e oportunidades profissionais

<p align="center">
  <img src="public/assets/logo-avanca-paulista.png" alt="Logo AVANÇA PAULISTA" width="260">
</p>

<p align="center">
  <strong>Conectando pessoas a oportunidades de desenvolvimento profissional.</strong>
</p>

---

## 1. Sobre o projeto

O **AVANÇA PAULISTA** é um projeto acadêmico de desenvolvimento web que propõe uma plataforma digital voltada à apresentação e organização de cursos de capacitação, oportunidades profissionais e conteúdos relacionados ao desenvolvimento pessoal e profissional.

A proposta é oferecer um ambiente digital intuitivo, acessível e organizado, facilitando a consulta de informações e a navegação entre diferentes áreas de interesse.

A plataforma reúne recursos de apresentação de oportunidades, consulta de cursos, gerenciamento de perfil e interação com conteúdos, proporcionando uma experiência integrada ao usuário.

O projeto possui caráter independente e demonstrativo, sendo desenvolvido para fins educacionais e aplicação prática dos conhecimentos adquiridos durante a formação acadêmica.

## 2. Identificação acadêmica

**Grupo:** 1 — Jovem Paulista  
**Tema:** 1 — Mentoria, Emprego e Protagonismo Juvenil

### Integrantes

| Nº | Nome | Matrícula |
|:--:|---|:--:|
| 1 | Caio Peryandro Tavares | 01756197 |
| 2 | David Rodrigues | 01847148 |
| 3 | Igor Bernardo | 01846617 |
| 4 | Roberto Eugênio Palácios Gomes | 01241270 |
| 5 | Ruan Luiz | 01821025 |

## 3. Objetivos

- Desenvolver uma plataforma web com interface moderna e intuitiva.
- Centralizar a apresentação de cursos e oportunidades profissionais.
- Facilitar a consulta de conteúdos por categorias, localização e modalidade.
- Implementar funcionalidades de cadastro e autenticação de usuários.
- Disponibilizar uma área individual para gerenciamento de perfil.
- Aplicar conceitos de desenvolvimento front-end, componentização e organização de código.
- Proporcionar uma experiência responsiva em diferentes dispositivos.

## 4. Funcionalidades

### Página inicial
- Apresentação da plataforma e de sua proposta.
- Acesso às principais áreas do sistema.
- Navegação integrada entre as seções.

### Oportunidades
- Apresentação de oportunidades profissionais.
- Pesquisa e filtragem de conteúdos.
- Organização por categorias e características.
- Possibilidade de salvar oportunidades na conta do usuário.

### Cursos
- Página independente para apresentação de cursos.
- Organização de conteúdos por áreas de interesse.
- Apresentação de informações sobre capacitação e desenvolvimento profissional.

### Sobre
- Apresentação da proposta do AVANÇA PAULISTA.
- Informações sobre os objetivos e a finalidade da plataforma.

### Cadastro e autenticação
- Cadastro de novos usuários.
- Login com validação de credenciais.
- Gerenciamento de sessão.
- Redirecionamento conforme o estado de autenticação.
- Atualização dinâmica do cabeçalho após login ou cadastro.
- Encerramento de sessão por meio da opção de sair.

### Minha área
- Visualização e edição de informações do perfil.
- Acompanhamento de oportunidades salvas.
- Acesso aos recursos individuais do usuário.

### Recuperação de senha
- Interface para recuperação demonstrativa de acesso.

### Interface e experiência do usuário
- Layout responsivo.
- Tema claro e escuro.
- Navegação entre páginas utilizando rotas.
- Identidade visual consistente em toda a plataforma.

## 5. Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| React | Construção de interfaces por componentes |
| Vite | Ambiente de desenvolvimento e build |
| JavaScript (ES6+) | Lógica e interatividade |
| HTML5 | Estruturação do documento |
| CSS3 | Estilização e responsividade |
| React Router DOM | Gerenciamento de rotas e navegação |
| Web Storage API | Persistência local de dados e sessões |
| Git e GitHub | Controle de versão e colaboração |

## 6. Arquitetura e organização

O projeto utiliza uma estrutura baseada em componentes React, separando páginas, contextos, componentes reutilizáveis e arquivos de estilo.

```text
AVANCA-PAULISTA/
│
├── public/
│   └── assets/
│       ├── favicon.svg
│       └── logo-avanca-paulista.png
│
├── src/
│   ├── components/
│   │   └── Layout.jsx
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Opportunities.jsx
│   │   ├── Courses.jsx
│   │   ├── About.jsx
│   │   ├── AuthPages.jsx
│   │   └── Dashboard.jsx
│   │
│   ├── styles/
│   │   ├── app.css
│   │   ├── legacy.css
│   │   ├── dashboard.css
│   │   └── recovery.css
│   │
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

### Organização dos componentes

- **components:** componentes compartilhados pela aplicação, como cabeçalho e rodapé.
- **contexts:** gerenciamento global de autenticação e preferências de tema.
- **pages:** páginas e interfaces principais da plataforma.
- **styles:** arquivos CSS responsáveis pela identidade visual e estilização.
- **public/assets:** imagens, logotipo e demais recursos estáticos.

## 7. Instalação e execução

### Pré-requisitos

Antes de executar o projeto, é necessário possuir:

- [Node.js](https://nodejs.org/) instalado.
- npm, disponibilizado junto com o Node.js.
- Git (opcional, para clonar o repositório).

### Clonar o repositório

```bash
git clone https://github.com/davidzinnn2007/Avanca-Paulista.git
```

Entre na pasta do projeto:

```bash
cd Avanca-Paulista
```

### Instalar as dependências

```bash
npm install
```

### Executar em ambiente de desenvolvimento

```bash
npm run dev
```

Após iniciar o servidor, acesse o endereço disponibilizado pelo Vite no terminal. Normalmente:

```text
http://localhost:5173
```

### Gerar versão de produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

Para visualizar a versão de produção localmente:

```bash
npm run preview
```

## 8. Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm install` | Instala as dependências do projeto |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Executa uma prévia da versão de produção |

## 9. Persistência e limitações

Esta versão utiliza recursos de armazenamento do próprio navegador para demonstrar funcionalidades de cadastro, autenticação, sessão, perfil e oportunidades salvas.

**Importante:** a aplicação é exclusivamente front-end e não possui integração com uma API ou banco de dados remoto.

Consequentemente:

- Os dados são armazenados localmente no navegador.
- As informações não são compartilhadas automaticamente entre dispositivos.
- A autenticação possui finalidade demonstrativa e não substitui um sistema de segurança de produção.
- A recuperação de senha não representa um fluxo real de envio e validação por e-mail.

Uma futura evolução poderá contemplar uma API, banco de dados e autenticação segura no servidor.

## 10. Controle de versão e colaboração

O desenvolvimento utiliza Git para controle de versão e GitHub para hospedagem do código-fonte e colaboração entre os integrantes.

As dependências são definidas nos arquivos `package.json` e `package-lock.json`. A pasta `node_modules` não deve ser versionada, pois pode ser reconstruída utilizando o comando `npm install`.

## 11. Considerações finais

O AVANÇA PAULISTA representa a aplicação prática de conhecimentos de desenvolvimento web, organização de interfaces, componentização, navegação e gerenciamento de estado.

A plataforma foi estruturada para demonstrar como tecnologias modernas podem ser utilizadas na construção de soluções digitais voltadas à organização e apresentação de informações sobre capacitação e oportunidades profissionais.

---

<p align="center">
  <strong>AVANÇA PAULISTA</strong><br>
  Projeto acadêmico de desenvolvimento web.
</p>
