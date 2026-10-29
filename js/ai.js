// Жаңа QADAM Worker жарияланған соң URL-ін тек осы жерге енгізіңіз.
// QADAM үшін бөлек жарияланған Cloudflare Worker.
const AI_API_URL = "https://crimson-dawn-2eda.vp5vy7g7db.workers.dev/";

window.askQadamAI = async function (messages) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40000);

  try {
    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages.slice(-6) }),
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "AI уақытша жауап бере алмады.");
    }

    if (typeof data.answer !== "string") {
      throw new Error("Жауап алынбады. Кейінірек қайталап көр.");
    }

    return data.answer;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Жауап күту уақыты аяқталды. Кейінірек қайталап көр.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
