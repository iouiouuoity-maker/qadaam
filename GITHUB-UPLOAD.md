# GitHub-қа дәл жүктеу нұсқаулығы

Репозиторий: `https://github.com/iouiouuoity-maker/qadaam`

Жарияланған сайт: `https://iouiouuoity-maker.github.io/qadaam/`

## Браузер арқылы (ең оңай жол)

1. Дайын ZIP-ті жүктеп, екі рет басып ашыңыз.
2. Ашылған `QADAM-complete` бумасының **ішіне** кіріңіз. Сіз `index.html`, `tasks.html`, `js`, `data`, `assets`, `qadam-ai-worker` бумаларын көруіңіз керек.
3. GitHub-та `iouiouuoity-maker/qadaam` репозиторийін ашыңыз.
4. Резервтік көшірме үшін алдымен **Code → Download ZIP** басыңыз.
5. Репозиторийдің басты бетінде **Add file → Upload files** таңдаңыз.
6. `QADAM-complete` бумасының өзін емес, **оның ішіндегі барлық файлдар мен бумаларды** жүктеу аймағына сүйреп апарыңыз. `index.html` репозиторий түбірінде қалуы тиіс.
7. Төмендегі commit мәтініне `QADAM 3.0: redesign complete 2400-question site` жазыңыз.
8. **Commit changes** басыңыз.
9. GitHub-та **Settings → Pages** ашыңыз.
10. **Build and deployment → Source: Deploy from a branch** таңдаңыз.
11. Branch: **main**, Folder: **/(root)** таңдаңыз да **Save** басыңыз.
12. 1–5 минуттан кейін `https://iouiouuoity-maker.github.io/qadaam/` ашып, басты бет, есептер банкі, бір есептің жауабы және сынақты тексеріңіз.

Егер GitHub 2FA кодын сұраса, оны тек GitHub-тың өз терезесіне енгізіңіз. Кодты ешкімге жібермеңіз. 2FA-дан өте алмасаңыз, ZIP дайын күйінде қалады, бірақ аккаунтқа кірмей репозиторийге жүктеу мүмкін емес.

## Git арқылы балама

```bash
git clone https://github.com/iouiouuoity-maker/qadaam.git
cd qadaam
cp -R /PATH/TO/QADAM-complete/. .
git add -A
git commit -m "QADAM 3.0: redesign complete 2400-question site"
git push origin main
```

`/PATH/TO/QADAM-complete` орнына ашылған дайын буманың нақты жолын қойыңыз.

## AI менторды қосу

Негізгі сайт AI-сыз бірден жұмыс істейді. AI үшін:

1. Терминалда `qadam-ai-worker` бумасына кіріңіз.
2. `npm install` орындаңыз.
3. `npx wrangler login` орындап, Cloudflare аккаунтын растаңыз.
4. `npm run deploy` орындаңыз.
5. Шыққан `workers.dev` URL-ін көшіріңіз.
6. Түбірдегі `js/config.js` файлын ашып, `AI_API_URL` мәніне сол URL-ді жазыңыз.
7. Өзгертілген `js/config.js` файлын GitHub-қа қайта жүктеп, commit жасаңыз.

Worker жарияланбайынша AI беті нақты әрі түсінікті «AI әлі қосылмаған» хабарын көрсетеді; қалған сайт толық жұмыс істейді.
