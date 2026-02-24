import Anthropic from '@anthropic-ai/sdk'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST')
    return new Response('Method Not Allowed', { status: 405 })

  const { headlines } = await req.json() as { headlines: string[] }
  if (!headlines?.length)
    return new Response(JSON.stringify({ brief: '' }), { status: 200 })

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content:
        `Bạn là trợ lý phân tích tin tức Việt Nam. Dựa trên các tiêu đề tin tức dưới đây, ` +
        `hãy viết một bản tóm tắt ngắn gọn bằng tiếng Việt (4-6 câu), nêu bật các chủ đề ` +
        `và sự kiện quan trọng nhất trong ngày. Phong cách chuyên nghiệp, súc tích.\n\n` +
        headlines.slice(0, 30).map((h, i) => `${i + 1}. ${h}`).join('\n'),
    }],
  })

  const brief = (msg.content[0] as { text: string }).text
  return new Response(JSON.stringify({ brief }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
