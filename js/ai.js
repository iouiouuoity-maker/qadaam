const AI_API_URL = String(window.QADAM_CONFIG?.AI_API_URL || '').trim();

window.askQadamAI = async function (messages) {
  if (!AI_API_URL) {
    throw new Error('AI әлі қосылмаған. qadam-ai-worker бумасындағы Worker-ді жариялап, оның URL-ін js/config.js файлына енгізіңіз.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40000);

  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages.slice(-8) }),
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'AI уақытша жауап бере алмады.');
    const answer = typeof data.answer === 'string' ? data.answer : data.response;
    if (typeof answer !== 'string' || !answer.trim()) throw new Error('AI-дан мәтіндік жауап алынбады.');
    return answer.trim();
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Жауап күту уақыты аяқталды. Кейінірек қайталап көр.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
