export const LANGUAGES = ['pt', 'en'];

export const navSections = [
  { id: 'home', labelKey: 'home', type: 'anchor' },
  { id: 'about', labelKey: 'about', type: 'anchor' },
  { id: 'experience', labelKey: 'experience', type: 'anchor' },
  { id: 'skills', labelKey: 'skills', type: 'anchor' },
  { id: 'projects', labelKey: 'projects', type: 'anchor' },
  { id: 'contact', labelKey: 'contact', type: 'route' },
];

export const ui = {
  skipToContent: { en: 'Skip to content', pt: 'Saltar para o conteúdo' },
  nav: {
    home: { en: 'Home', pt: 'Início' },
    about: { en: 'About', pt: 'Sobre' },
    experience: { en: 'Experience', pt: 'Experiência' },
    skills: { en: 'Skills', pt: 'Competências' },
    projects: { en: 'Projects', pt: 'Projetos' },
    contact: { en: 'Contact', pt: 'Contacto' },
  },
  hero: {
    role: {
      en: 'Full-stack developer. From requirements to production.',
      pt: 'Desenvolvedor full-stack. Do requisito à produção.',
    },
    intro: {
      en: 'I build and ship software end to end: React and Vue interfaces, .NET and Python services, SQL that holds up, and the pipelines that put it all in production on AWS and Google Cloud.',
      pt: 'Construo e coloco software em produção de ponta a ponta: interfaces React e Vue, serviços .NET e Python, SQL que aguenta, e os pipelines que levam tudo isto à AWS e ao Google Cloud.',
    },
    contactCta: { en: 'Start a conversation', pt: 'Falar comigo' },
    cvCta: { en: 'Download CV', pt: 'Descarregar CV' },
    currentlyLabel: { en: 'Currently', pt: 'Atualmente' },
    currentRole: { en: 'Full-Stack Developer at F.Rego', pt: 'Full-Stack Developer na F.Rego' },
    currentStudy: {
      en: 'MSc in Software Engineering at ISEP, part-time',
      pt: 'Mestrado em Engenharia de Software no ISEP, pós-laboral',
    },
    stackLabel: { en: 'Core stack', pt: 'Stack principal' },
    status: { en: 'Open to conversations', pt: 'Aberto a conversas' },
  },
  about: {
    title: { en: 'About', pt: 'Sobre' },
    paragraphs: [
      {
        en: 'I am a full-stack developer based in Porto, Portugal. For the past few years I have been building software for manufacturing ERP, insurance and defence-cloud projects — systems where the data has to be right and the interface has to survive a factory floor.',
        pt: 'Sou desenvolvedor full-stack no Porto. Nos últimos anos tenho construído software para ERP industrial, seguros e projetos de cloud europeus — sistemas em que os dados têm de estar certos e a interface tem de sobreviver a um chão de fábrica.',
      },
      {
        en: 'My work tends to span the whole stack: gathering requirements, designing the data model, building the API and shipping the release through a CI/CD pipeline. I care about clean interfaces, fast queries and code the next person can read.',
        pt: 'O meu trabalho ocupa normalmente a stack inteira: levantar requisitos, desenhar o modelo de dados, construir a API e colocar a release em produção por um pipeline de CI/CD. Interessam-me interfaces limpas, queries rápidas e código que a próxima pessoa consegue ler.',
      },
    ],
    factsTitle: { en: 'Details', pt: 'Detalhes' },
    languagesTitle: { en: 'Languages', pt: 'Línguas' },
    educationTitle: { en: 'Education', pt: 'Educação' },
    locationLabel: { en: 'Location', pt: 'Localização' },
    emailLabel: { en: 'Email', pt: 'Email' },
    linksLabel: { en: 'Elsewhere', pt: 'Noutros sítios' },
  },
  experience: {
    title: { en: 'Experience', pt: 'Experiência' },
    stackLabel: { en: 'Stack', pt: 'Stack' },
  },
  skills: {
    title: { en: 'Skills', pt: 'Competências' },
    note: {
      en: 'The stack I use to take a project from an empty repository to production, and to keep it running once it is there.',
      pt: 'A stack que uso para levar um projeto de um repositório vazio até à produção, e para o manter a funcionar depois disso.',
    },
  },
  projects: {
    title: { en: 'Projects', pt: 'Projetos' },
    estimate: {
      status: { en: 'Private client application', pt: 'Aplicação privada de cliente' },
      summary: {
        en: 'Turns manual project estimates into a fast, repeatable workflow.',
        pt: 'Transforma orçamentos manuais num processo rápido e repetível.',
      },
      story: {
        en: 'A prospect was building every project estimate by hand. I identified the need, built the application with Vue.js and Supabase, and they became a paying client. Estimates are now generated from structured data instead of copy-paste.',
        pt: 'Um potencial cliente fazia todos os orçamentos à mão. Identifiquei a necessidade, construí a aplicação com Vue.js e Supabase, e tornou-se cliente. Os orçamentos passaram a ser gerados a partir de dados estruturados, sem copy-paste.',
      },
      screensLabel: { en: 'Screens', pt: 'Ecrãs' },
      previous: { en: 'Previous screen', pt: 'Ecrã anterior' },
      next: { en: 'Next screen', pt: 'Ecrã seguinte' },
      goTo: { en: 'Go to screen {index}', pt: 'Ir para o ecrã {index}' },
      counter: { en: 'Screen {current} of {total}', pt: 'Ecrã {current} de {total}' },
    },
  },
  contactCta: {
    title: { en: 'Let us build something that ships', pt: 'Vamos construir algo que chega a produção' },
    body: {
      en: 'I am open to conversations about full-stack work, cloud and DevOps, or hard problems in existing systems.',
      pt: 'Estou disponível para conversas sobre trabalho full-stack, cloud e DevOps, ou problemas difíceis em sistemas existentes.',
    },
    emailCta: { en: 'Send an email', pt: 'Enviar email' },
    formCta: { en: 'Use the contact form', pt: 'Usar o formulário' },
  },
  contact: {
    title: { en: 'Tell me what you are working on', pt: 'Conta-me o que andas a construir' },
    subtitle: {
      en: 'I usually reply within a couple of days.',
      pt: 'Respondo normalmente em dois ou três dias.',
    },
    name: { en: 'Name', pt: 'Nome' },
    email: { en: 'Email', pt: 'Email' },
    message: { en: 'Message', pt: 'Mensagem' },
    namePlaceholder: { en: 'Your name', pt: 'O teu nome' },
    emailPlaceholder: { en: 'you@company.com', pt: 'tu@empresa.pt' },
    messagePlaceholder: {
      en: 'What are you building, and where can I help?',
      pt: 'O que estás a construir e onde posso ajudar?',
    },
    send: { en: 'Send message', pt: 'Enviar mensagem' },
    sending: { en: 'Sending…', pt: 'A enviar…' },
    success: {
      en: 'Message sent. Thanks for reaching out — I will get back to you soon.',
      pt: 'Mensagem enviada. Obrigado pelo contacto — respondo assim que puder.',
    },
    fallbackNote: { en: 'If the form fails, email me at', pt: 'Se o formulário falhar, escreve para' },
  },
  validation: {
    nameRequired: { en: 'Enter your name.', pt: 'Indica o teu nome.' },
    nameLength: {
      en: 'Name must be between 2 and 50 characters.',
      pt: 'O nome deve ter entre 2 e 50 caracteres.',
    },
    nameChars: { en: 'Name contains invalid characters.', pt: 'O nome contém caracteres inválidos.' },
    emailRequired: { en: 'Enter your email address.', pt: 'Indica o teu email.' },
    emailInvalid: { en: 'Enter a valid email address.', pt: 'Introduz um email válido.' },
    emailLength: { en: 'Email address is too long.', pt: 'O email é demasiado longo.' },
    messageRequired: { en: 'Write a message.', pt: 'Escreve uma mensagem.' },
    messageLength: {
      en: 'Message must be at least 10 characters.',
      pt: 'A mensagem deve ter pelo menos 10 caracteres.',
    },
    messageMax: {
      en: 'Message is too long (2000 characters maximum).',
      pt: 'A mensagem é demasiado longa (máximo 2000 caracteres).',
    },
    rateLimited: {
      en: 'Too many requests. Try again in a few minutes.',
      pt: 'Demasiados pedidos. Tenta novamente dentro de alguns minutos.',
    },
    captcha: { en: 'Confirm you are not a robot.', pt: 'Confirma que não és um robô.' },
    origin: {
      en: 'This form only works from the portfolio site itself.',
      pt: 'Este formulário só funciona a partir do próprio site.',
    },
    notConfigured: {
      en: 'Email sending is not configured. Write to {email} instead.',
      pt: 'O envio de email não está configurado. Escreve para {email}.',
    },
    sendFailed: {
      en: 'Could not send the message. Try again, or email {email} directly.',
      pt: 'Não foi possível enviar a mensagem. Tenta novamente ou escreve para {email}.',
    },
  },
  footer: {
    builtWith: {
      en: 'Built with React, Vite and Tailwind CSS. Deployed on Vercel.',
      pt: 'Feito com React, Vite e Tailwind CSS. Alojado na Vercel.',
    },
    rights: { en: 'All rights reserved.', pt: 'Todos os direitos reservados.' },
    backToTop: { en: 'Back to top', pt: 'Voltar ao topo' },
  },
  a11y: {
    openMenu: { en: 'Open menu', pt: 'Abrir menu' },
    closeMenu: { en: 'Close menu', pt: 'Fechar menu' },
    toggleThemeToLight: { en: 'Switch to light theme', pt: 'Mudar para tema claro' },
    toggleThemeToDark: { en: 'Switch to dark theme', pt: 'Mudar para tema escuro' },
    switchToEnglish: { en: 'Switch to English', pt: 'Mudar para inglês' },
    switchToPortuguese: { en: 'Switch to Portuguese', pt: 'Mudar para português' },
  },
};
