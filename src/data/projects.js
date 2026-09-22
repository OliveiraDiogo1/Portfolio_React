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
