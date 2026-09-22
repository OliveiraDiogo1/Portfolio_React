export const estimateProject = {
  id: 'estimate',
  name: 'EstiMate',
  status: { en: 'Private client application', pt: 'Aplicação privada de cliente' },
  summary: {
    en: 'Turns manual project estimates into a fast, repeatable workflow.',
    pt: 'Transforma orçamentos manuais num processo rápido e repetível.',
  },
  story: {
    en: 'A prospect was building every project estimate by hand. I identified the need, built the application with Vue.js and Supabase, and they became a paying client. Estimates are now generated from structured data instead of copy-paste.',
    pt: 'Um potencial cliente fazia todos os orçamentos à mão. Identifiquei a necessidade, construí a aplicação com Vue.js e Supabase, e tornou-se cliente. Os orçamentos passaram a ser gerados a partir de dados estruturados, sem copy-paste.',
  },
  stack: ['Vue.js', 'Supabase', 'PostgreSQL'],
  images: [
    { src: '/assets/projects/Estimates/Estimate1.png', alt: { en: 'EstiMate — estimate list', pt: 'EstiMate — lista de orçamentos' } },
    { src: '/assets/projects/Estimates/Estimate2.png', alt: { en: 'EstiMate — estimate builder', pt: 'EstiMate — criação de orçamento' } },
    { src: '/assets/projects/Estimates/Estimate3.png', alt: { en: 'EstiMate — item details', pt: 'EstiMate — detalhe de itens' } },
    { src: '/assets/projects/Estimates/Estimate4.png', alt: { en: 'EstiMate — pricing summary', pt: 'EstiMate — resumo de preços' } },
    { src: '/assets/projects/Estimates/Estimate5.png', alt: { en: 'EstiMate — exported document', pt: 'EstiMate — documento exportado' } },
  ],
};

export const githubFeed = {
  username: 'OliveiraDiogo1',
  selected: [
    {
      name: 'Portfolio_React',
      url: 'https://github.com/OliveiraDiogo1/Portfolio_React',
      description: {
        en: 'This portfolio — React, Vite, Tailwind, i18n and a design system of its own.',
        pt: 'Este portfólio — React, Vite, Tailwind, i18n e um design system próprio.',
      },
    },
    {
      name: 'GOFTS',
      url: 'https://github.com/OliveiraDiogo1/GOFTS',
      description: {
        en: 'Game built for a university project, focused on gameplay logic and state.',
        pt: 'Jogo construído para um projeto universitário, focado em lógica de jogo e estado.',
      },
    },
    {
      name: 'git_test',
      url: 'https://github.com/OliveiraDiogo1/git_test',
      description: {
        en: 'The Odin Project exercises — the start of the road into web development.',
        pt: 'Exercícios do The Odin Project — o início do caminho no desenvolvimento web.',
      },
    },
  ],
};
