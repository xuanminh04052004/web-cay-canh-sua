/**
 * LLM Service with business logic and system prompt
 * This service provides the system prompt and handles message formatting
 */

import { callChatbotAPI } from "./gemini-service";

export const systemPrompt = `Bạn là trợ lý AI tư vấn cây cảnh của Greenie.

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

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMConfig {
  temperature?: number;
  maxTokens?: number;
}

/**
 * Call LLM through the Flask backend
 */
export async function callLLM(
  message: string,
  sessionId?: string,
  config?: LLMConfig
): Promise<string> {
  try {
    const response = await callChatbotAPI(message, sessionId);
    
    if (response.success && response.message.content) {
      return response.message.content;
    }
    
    throw new Error("No response from chatbot");
  } catch (error) {
    console.error("[LLM Service] Error calling chatbot:", error);
    throw error;
  }
}

