export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for college recommendations." },
        { role: "user", content: question },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return res.status(500).json({ error: errorText });
  }

  const data = await response.json();
  res.status(200).json({ answer: data.choices[0].message.content });
}
