# Loja Fábio Cell: landing page

Site estático (HTML + CSS + JS puro). Sem build, sem dependências: o Vercel publica a pasta como está.

## Estrutura

```
/
├── index.html            página principal (CSS embutido, já minificado)
├── 404.html              página de erro personalizada (noindex)
├── main.js               menu, carrossel, formulários, horário, animações (defer)
├── logo-h.png            logo do cabeçalho e do rodapé
├── favicon.ico           32x32
├── favicon.svg           ícone vetorial do navegador
├── apple-touch-icon.png  180x180
├── icon-192.png          ícone do manifest
├── icon-512.png          ícone do manifest
├── site.webmanifest
├── og-image.jpg          imagem de compartilhamento 1200x630
├── robots.txt
├── sitemap.xml
├── vercel.json           URLs limpas e cache das imagens
├── scripts/set-site-url.mjs   troca o SITE_URL em todos os arquivos
└── img/                  fotos tratadas em WebP (cada uma com versões .w480/.w800/.w1200)
```

## Depois do primeiro deploy: trocar o SITE_URL

O endereço do site aparece como `https://TROCAR-PELO-LINK-DO-VERCEL.vercel.app`. Troque nestes pontos:

| Arquivo | Linha | O que é |
|---|---|---|
| index.html | 13 | canonical |
| index.html | 29 | og:url |
| index.html | 30 | og:image |
| index.html | 37 | twitter:image |
| index.html | 54, 55, 56 | url, image e logo do JSON-LD |
| robots.txt | 6 | endereço do sitemap |
| sitemap.xml | 5 | URL da página inicial |

Atalho (troca tudo de uma vez, precisa do Node instalado):

```
node scripts/set-site-url.mjs https://seu-projeto.vercel.app
```

Depois faça commit e push. O Vercel publica de novo sozinho.

## Itens para conferir ou preencher

| Item | Onde | O que fazer |
|---|---|---|
| SITE_URL | ver tabela acima | Trocar pelo link de produção |
| og-image.jpg | raiz | Já existe uma versão com o logo. Se quiser, troque por uma arte 1200x630 px com o mesmo nome |
| favicon.svg | raiz | Hoje é o logo redondo embutido. Se tiver o logo em SVG vetorial, substitua mantendo o nome |
| Coordenadas e link do Maps | index.html, linha 75 | Opcional: adicionar `geo` e `hasMap` ao JSON-LD |
| Instagram | index.html (rodapé e JSON-LD) | Conferir se o @ é `fabiocellagudo` (lido no letreiro da loja) |
| Número da loja | todo o site | Usei 5555996626654, que aparece no letreiro da fachada |
| Endereço | todo o site | Usei Rua Ramiro Barcelos, 517, Sala 2 (Google e flyer). Se for 512, trocar em index.html |

## Publicar no Vercel via GitHub

1. Crie um repositório no GitHub e envie todos os arquivos desta pasta (a raiz do repositório é a pasta que contém o `index.html`).
2. No Vercel: Add New › Project › importe o repositório.
3. Framework Preset: **Other**. Build Command e Output Directory: deixe vazios.
4. Deploy.

## Pegar o link e trocar a URL

1. Em Project › Domains, copie o domínio de produção (`seu-projeto.vercel.app`). Não use links de preview: eles ficam com noindex por padrão, o que é normal.
2. Troque o SITE_URL (tabela acima ou o script), faça commit e push.
3. Abra no link de produção e confira:
   - `https://seu-projeto.vercel.app/robots.txt` mostra o Sitemap com o link certo
   - `https://seu-projeto.vercel.app/sitemap.xml` mostra a URL certa
   - um endereço qualquer, como `/teste`, abre a página 404

## Google Search Console

1. Acesse search.google.com/search-console e adicione uma propriedade do tipo **Prefixo do URL** com o link de produção.
2. Verifique pelo método **Tag HTML**: cole a meta tag recebida dentro do `<head>` do `index.html`, faça push e clique em Verificar.
3. Em Sitemaps, envie `sitemap.xml`.
4. Em Inspeção de URL, cole a home e clique em **Solicitar indexação**.

A indexação depende da avaliação do próprio Google e pode levar de dias a semanas.

## Se conectar um domínio próprio no futuro

1. No Vercel, adicione o domínio em Project › Domains e configure o DNS como o Vercel indicar.
2. Marque o domínio novo como principal e configure o `.vercel.app` para **redirecionar (308)** para ele.
3. Rode `node scripts/set-site-url.mjs https://seudominio.com.br`. Como o script procura o texto antigo, troque antes o valor de `PLACEHOLDER` no script pelo link `.vercel.app` que está no site.
4. No Search Console, adicione a propriedade do domínio novo, envie o sitemap de novo e use a ferramenta **Mudança de endereço** a partir da propriedade antiga.

## Como editar

O `index.html` é gerado a partir de uma versão-fonte com Tailwind compilado. Para mudar textos, links ou fotos, edite direto o `index.html`. Para mudar estilos, procure a classe no bloco `<style>`.
