/**
 * Vercel Serverless Function for Gemini Chatbot
 * This function acts as a proxy to keep API key secure
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT = `Bạn là trợ lý AI tư vấn cây cảnh của Greenie.

QUY TẮC NGHIÊM NGẶT:
1. CHỈ trả lời câu hỏi về cây cảnh mà website đang bán
2. KHÔNG BAO GIỜ đề cập đến giá tiền hoặc số lượng tồn kho
3. Nếu người dùng hỏi về giá hoặc số lượng, hướng dẫn họ xem trên website
4. Từ chối lịch sự các câu hỏi không liên quan đến cây cảnh

KIẾN THỨC:
- Cây cảnh trong nhà: lưỡi hổ, phú quý, kim tiền, vạn lộc, trầu bà Đế Vương Xanh, bình an, trầu bà Thanh Xuân
- Cây ăn quả: nho thân gỗ, sơ ri, cóc, cam Nhật, Chanh Vàng Mỹ, Vú sữa
- Cây bông hoa: bông giấy, hoa lài, chuối mỏ két, tuyết sơn phi hồng

CÁCH TRẢ LỜI:
- KHÔNG sử dụng markdown formatting (không dùng **, *, __, _, \`, #)
- Sử dụng chấm (.) hoặc gạch đầu dòng (-) cho danh sách
- Sử dụng số thứ tự (1., 2., 3.) cho các bước
- Tư vấn về đặc điểm, lợi ích, cách chăm sóc
- Gợi ý cây phù hợp với không gian và điều kiện
- Hướng dẫn chi tiết về ánh sáng, nước, vị trí đặt
- Tránh tuyệt đối: giá tiền, tồn kho, số lượng

Trả lời ngắn gọn, thân thiện, sử dụng emoji phù hợp, chỉ dùng plain text không có markdown.`;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  let sessionId: string | undefined; // ✅ FIX SCOPE
  let responseText = '';
  let confidence = 0.8;

  try {
    const body = request.body || {};
    const message = body.message;
    sessionId = body.sessionId;

    if (!message?.trim()) {
      return response.status(400).json({ error: 'Message required' });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_GENERATIVE_AI_API_KEY is not configured');
      return response.status(500).json({ error: 'Server configuration error' });
    }

    // Retry logic for overloaded model
    const maxRetries = 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = 1000 * attempt;
          console.log(
            `[Vercel] Retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`
          );
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: message }],
                },
              ],
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }],
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
              },
            }),
          }
        );

        if (!geminiResponse.ok) {
          const errorData = await geminiResponse.json().catch(() => ({}));
          const errorMessage = errorData.error?.message || geminiResponse.statusText;

          if (errorMessage.includes('overloaded') && attempt < maxRetries) {
            console.log('[Vercel] Model overloaded, will retry...');
            lastError = new Error(errorMessage);
            continue;
          }

          throw new Error(`Gemini API error: ${errorMessage}`);
        }

        const data = await geminiResponse.json();
        responseText =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          'Xin lỗi, tôi chưa thể tạo câu trả lời phù hợp. 😅';

        confidence = 0.95;
        break;
      } catch (aiError: any) {
        lastError = aiError;

        if (attempt === maxRetries) {
          break;
        }

        if (!aiError.message?.includes('overloaded')) {
          break;
        }
      }
    }

    if (!responseText && lastError) {
      throw lastError;
    }

  } catch (error: any) {
    console.error('[Vercel] AI call failed:', error);

    responseText = `Xin lỗi, hệ thống tạm thời gặp sự cố. 😅

Bạn có thể thử hỏi:
- Gợi ý cây trong nhà
- Cây nào lọc không khí tốt?
- Cách tưới nước cho cây`;

    confidence = 0.3;
  }

  const currentTimeMs = Date.now();

  return response.status(200).json({
    success: true,
    message: {
      id: `msg_${currentTimeMs}`,
      sessionId: sessionId || `session_${currentTimeMs}`,
      role: 'assistant',
      content: responseText,
      timestamp: null,
      confidence,
    },
  });
}
