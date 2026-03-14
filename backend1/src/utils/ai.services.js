export const askClaude = async (messages, systemPrompt) => {

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "Study Helper AI"
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    }),
  });

  const data = await res.json();

  // console.log("OpenRouter response:", data);

  if (!res.ok) {
    throw new Error(data?.error?.message || "AI request failed");
  }

  return data?.choices?.[0]?.message?.content || "No response";
};