const DEFAULT_ORIGINS = [
  'https://iouiouuoity-maker.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000'
];

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || DEFAULT_ORIGINS.join(','))
    .split(',')
    .map(value => value.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

function responseHeaders(origin, env) {
  const normalized = origin.replace(/\/$/, '');
  const allowed = allowedOrigins(env);
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Vary': 'Origin'
  };
  if (allowed.includes(normalized)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = responseHeaders(origin, env);
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (origin && !allowedOrigins(env).includes(normalizedOrigin)) {
      return json({ error: 'Бұл origin рұқсат етілмеген.' }, 403, headers);
    }

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method === 'GET') {
      return json({ ok: true, service: 'QADAM AI mentor' }, 200, headers);
    }
    if (request.method !== 'POST') {
      return json({ error: 'Тек POST сұрауы қабылданады.' }, 405, headers);
    }

    try {
      const body = await request.json();
      if (!Array.isArray(body.messages)) {
        return json({ error: 'messages массиві қажет.' }, 400, headers);
      }

      const messages = body.messages
        .slice(-8)
        .filter(item => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string')
        .map(item => ({ role: item.role, content: item.content.trim().slice(0, 3000) }))
        .filter(item => item.content);
      const totalLength = messages.reduce((sum, item) => sum + item.content.length, 0);
      if (!messages.length || totalLength > 9000) {
        return json({ error: 'Сұрақ бос немесе тым ұзын.' }, 400, headers);
      }

      const system = {
        role: 'system',
        content: [
          'Сен QADAM платформасының 5–6 сынып математика менторысың.',
          'Негізгі тіл — қазақ тілі. Оқушы басқа тілде сұраса, сол тілде қысқа жауап бер.',
          'Алдымен бір бағыттаушы ишара бер; оқушы сұрамайынша дайын жауапты бірден ашпа.',
          'Берілген есеп контекстін, тексерілген жауапты және шешу жолын ескер.',
          'Қате қадамды нақты ата, есептеуді қайта тексер және жеке дерек сұрама.',
          'Жауапты 180 сөзден асырма.'
        ].join(' ')
      };
      const model = env.MODEL || '@cf/meta/llama-3.1-8b-instruct';
      const result = await env.AI.run(model, { messages: [system, ...messages], max_tokens: 350 });
      const answer = typeof result?.response === 'string' ? result.response.trim() : '';
      if (!answer) return json({ error: 'Модель бос жауап қайтарды.' }, 502, headers);
      return json({ answer }, 200, headers);
    } catch (error) {
      return json({ error: 'AI сұрауын өңдеу сәтсіз аяқталды.', detail: String(error?.message || error) }, 500, headers);
    }
  }
};
