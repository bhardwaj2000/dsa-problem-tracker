/**
 * AI Metadata Service for Interview Prep Chatbot
 * Calls Gemini to auto-generate question metadata (topic, difficulty, tags)
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function getGeminiApiUrl(modelName) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
}

const ALLOWED_TOPICS = ['Java', 'Spring', 'Database', 'Kafka', 'CICD', 'ReactJS', 'AI', 'Tricky'];
const ALLOWED_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

/**
 * Build the prompt for metadata generation
 */
function buildMetadataPrompt(userQuestion, botAnswer) {
  return `Analyze this interview Q&A and return ONLY a valid JSON object with these exact keys:
{
  "refinedQuestion": "a polished, clear interview question",
  "topic": "one of: Java, Spring, Database, Kafka, CICD, ReactJS, AI, Tricky",
  "difficulty": "one of: Easy, Medium, Hard",
  "tags": ["tag1", "tag2", "tag3"]
}

User's original question: ${userQuestion}

Bot's answer: ${botAnswer}

Rules:
- refinedQuestion should be concise and interview-ready (1 sentence)
- topic must be EXACTLY one of the allowed values listed above
- difficulty based on conceptual depth:
  * Easy = factual recall, basic syntax, simple definitions
  * Medium = conceptual understanding, comparisons, common patterns
  * Hard = deep internals, architectural decisions, edge cases, optimization
- tags: 2-4 subtopic-specific keywords that describe the exact concept
  * Examples of good tags: "string", "collections", "threading", "spring transaction", "spring aop", "jpa", "hibernate", "microservices", "streams", "optional", "lambda", "virtual dom", "hooks", "useState", "dependency injection", "bean lifecycle", "garbage collection", "jvm internals"
  * Tags should be specific subtopic names, NOT generic words like "interview" or "question"
  * Use lowercase, hyphenated for multi-word tags

Return ONLY the JSON object. No markdown, no explanation, no code blocks.`;
}

/**
 * Safely parse JSON from Gemini response
 */
function safeJsonParse(text) {
  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    text = codeBlockMatch[1].trim();
  }

  // Try to find JSON object boundaries
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    text = text.slice(jsonStart, jsonEnd + 1);
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Validate and sanitize metadata from AI
 */
function sanitizeMetadata(raw) {
  const metadata = {
    refinedQuestion: '',
    topic: 'Java',
    difficulty: 'Medium',
    tags: [],
  };

  if (typeof raw.refinedQuestion === 'string' && raw.refinedQuestion.trim()) {
    metadata.refinedQuestion = raw.refinedQuestion.trim();
  }

  if (ALLOWED_TOPICS.includes(raw.topic)) {
    metadata.topic = raw.topic;
  } else if (typeof raw.topic === 'string') {
    // Try case-insensitive match
    const matched = ALLOWED_TOPICS.find(
      (t) => t.toLowerCase() === raw.topic.toLowerCase()
    );
    if (matched) metadata.topic = matched;
  }

  if (ALLOWED_DIFFICULTIES.includes(raw.difficulty)) {
    metadata.difficulty = raw.difficulty;
  } else if (typeof raw.difficulty === 'string') {
    const matched = ALLOWED_DIFFICULTIES.find(
      (d) => d.toLowerCase() === raw.difficulty.toLowerCase()
    );
    if (matched) metadata.difficulty = matched;
  }

  if (Array.isArray(raw.tags)) {
    metadata.tags = raw.tags
      .filter((t) => typeof t === 'string' && t.trim())
      .map((t) => t.trim().toLowerCase())
      .slice(0, 4);
  }

  return metadata;
}

/**
 * Generate question metadata using Gemini AI
 * @param {string} userQuestion - The original question asked by user
 * @param {string} botAnswer - The answer provided by the chatbot
 * @param {string} modelName - Gemini model to use
 * @returns {Promise<{refinedQuestion: string, topic: string, difficulty: string, tags: string[]}>}
 */
export async function generateQuestionMetadata(userQuestion, botAnswer, modelName = 'gemini-3.1-flash-lite-preview') {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured.');
  }

  try {
    const response = await fetch(
      `${getGeminiApiUrl(modelName)}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildMetadataPrompt(userQuestion, botAnswer),
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg =
        errorData?.error?.message || `API request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();

    const generatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const rawMetadata = safeJsonParse(generatedText);

    if (!rawMetadata) {
      throw new Error('Failed to parse AI metadata response.');
    }

    return sanitizeMetadata(rawMetadata);
  } catch (err) {
    throw new Error(err.message || 'Failed to generate question metadata.');
  }
}

