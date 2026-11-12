# QADAM AI Worker

Бұл бума QADAM-ның AI менторына арналған толық Cloudflare Worker кодын қамтиды. Негізгі GitHub Pages сайты AI-сыз да жұмыс істейді; менторды қосу үшін Worker-ді жеке жариялау қажет.

## Жариялау

1. Терминалда осы бумаға өтіңіз: `cd qadam-ai-worker`.
2. `npm install` орындаңыз.
3. `npx wrangler login` арқылы өз Cloudflare аккаунтыңызға кіріңіз.
4. `npm run deploy` орындаңыз.
5. Шыққан `https://qadam-ai-worker....workers.dev/` URL-ін көшіріңіз.
6. Сайт түбіріндегі `js/config.js` файлына URL-ді `AI_API_URL` мәні ретінде енгізіңіз.

Егер GitHub Pages адресі өзгерсе, `wrangler.jsonc` ішіндегі `ALLOWED_ORIGINS` мәнін де өзгертіңіз. Мұнда толық бет адресін емес, origin жазыңыз: мысалы, `https://USERNAME.github.io`.

## Тексеру

- `npm run check` — Worker JavaScript синтаксисін тексереді.
- `npm run deploy:dry` — Cloudflare-ға жіберілетін жинақты жарияламай дайындайды.
- Жарияланған URL-ді браузерде ашқанда `{ "ok": true, ... }` жауабы шығуы керек.

Workers AI қолданылуы Cloudflare аккаунтының лимиті мен тарифіне байланысты. API кілті браузер кодына салынбайды.
