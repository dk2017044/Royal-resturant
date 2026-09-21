import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const groqApiKey = env.GROQ_API_KEY || env.VITE_GROQ_API_KEY || '';

  return {
    plugins: [
      react(),
      {
        name: 'local-api-ai-middleware',
        configureServer(server) {
          server.middlewares.use('/api/ai', (req, res) => {
            if (req.method === 'POST') {
              let bodyStr = '';
              let totalBytes = 0;
              const MAX_BYTES = 4096;
              let isTooLarge = false;

              req.on('data', (chunk: Buffer) => {
                totalBytes += chunk.length;
                if (totalBytes > MAX_BYTES) {
                  isTooLarge = true;
                } else {
                  bodyStr += chunk.toString();
                }
              });

              req.on('end', async () => {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('X-Content-Type-Options', 'nosniff');
                res.setHeader('X-Frame-Options', 'DENY');

                if (isTooLarge) {
                  res.statusCode = 413;
                  res.end(JSON.stringify({ error: 'Payload Too Large (LPDoS defense)' }));
                  return;
                }

                if (!groqApiKey) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'GROQ_API_KEY not configured.' }));
                  return;
                }

                try {
                  const parsed = JSON.parse(bodyStr || '{}');
                  const sanitizedMessages = (parsed.messages || []).slice(-8).map((m: any) => ({
                    role: m.role === 'assistant' || m.role === 'system' ? m.role : 'user',
                    content: String(m.content || '')
                      .slice(0, 500)
                      .replace(/\{\{/g, '&#123;&#123;')
                      .replace(/\}\}/g, '&#125;&#125;')
                      .replace(/\$\{/g, '&#36;&#123;'),
                  }));

                  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${groqApiKey}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      model: 'qwen/qwen3.8-27b',
                      messages: sanitizedMessages,
                      temperature: 0.5,
                      max_tokens: 350,
                    }),
                  });

                  if (!groqRes.ok) {
                    const errText = await groqRes.text();
                    res.statusCode = groqRes.status;
                    res.end(JSON.stringify({ error: 'Upstream AI error', details: errText.slice(0, 200) }));
                    return;
                  }

                  const data = (await groqRes.json()) as any;
                  res.statusCode = 200;
                  res.end(JSON.stringify({ reply: data.choices?.[0]?.message?.content || '' }));
                } catch (e: any) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message || 'Internal server error' }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            }
          });
        },
      },
    ],
  };
});
