/**
 * Netlify Serverless Function for Gemini Chatbot
 * This function acts as a proxy to keep API key secure
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

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

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { message, sessionId } = body;

    if (!message?.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Message required' }),
      };
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_GENERATIVE_AI_API_KEY is not configured');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    let responseText = '';
    let confidence = 0.8;

    try {
      // Call Gemini API
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
        const errorData = await geminiResponse.json();
        throw new Error(
          `Gemini API error: ${errorData.error?.message || geminiResponse.statusText}`
        );
      }

      const data = await geminiResponse.json();
      responseText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response generated';
      confidence = 0.95;
    } catch (aiError: any) {
      console.error('[Netlify] AI call failed:', aiError);

      // Fallback response (NO price/stock info)
      responseText = `Xin lỗi, hệ thống tạm thời gặp sự cố. 😅

Bạn có thể liên hệ hotline **0901 234 567** để được hỗ trợ trực tiếp.

Hoặc hãy thử hỏi:
• "Gợi ý cây trong nhà"
• "Cây nào lọc không khí tốt?"
• "Cách tưới nước cho cây"`;
      confidence = 0.3;
    }

    const currentTimeMs = Date.now();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: {
          id: `msg_${currentTimeMs}`,
          sessionId: sessionId || `session_${currentTimeMs}`,
          role: 'assistant',
          content: responseText,
          timestamp: null,
          confidence,
        },
      }),
    };
  } catch (error: any) {
    console.error('[Netlify] Chatbot error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

