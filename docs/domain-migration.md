# Migração de domínio: devdiogo-portfolio.com → devdiogo.pt

Estado: `devdiogo.pt` registado na dominios.pt. Site alojado na Vercel.

## 1. Vercel

1. Projeto → Settings → Domains → adicionar `devdiogo.pt` e `www.devdiogo.pt`.
2. Confirmar no painel os valores de DNS que a Vercel indica (podem mudar; usar sempre o que o painel mostrar).
3. Manter `devdiogo-portfolio.com` associado ao projeto e defini-lo como redirect 301 para `devdiogo.pt` até expirar.

Valores por omissão da Vercel (confirmar antes de gravar):

| Tipo | Nome | Valor | TTL |
| --- | --- | --- | --- |
| A | `@` | `76.76.21.21` | 3600 |
| CNAME | `www` | `cname.vercel-dns.com` | 3600 |

## 2. dominios.pt

1. Área de cliente → Gestão de DNS da zona `devdiogo.pt`.
2. Criar os dois registos da tabela acima.
3. Remover registos de parking/parque da dominios.pt que entrem em conflito com o `@`.

## 3. Variáveis de ambiente (Vercel)

`VITE_PLAUSIBLE_DOMAIN=devdiogo.pt` em Production (e Preview). Redeploy depois de gravar.

## 4. Verificação

```bash
nslookup devdiogo.pt
curl -I https://devdiogo.pt
curl -I https://www.devdiogo.pt
```

- Esperar 200 e certificado válido para ambos.
- Preview de partilha: `https://www.opengraph.xyz/url/https%3A%2F%2Fdevdiogo.pt`.
- Confirmar que `https://devdiogo-portfolio.com` responde 301 para `https://devdiogo.pt`.
- Search Console: adicionar a propriedade `devdiogo.pt` e submeter `https://devdiogo.pt/sitemap.xml`.
