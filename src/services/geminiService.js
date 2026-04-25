/**
 * Gemini API Service for Interview Prep Chatbot
 * Handles keyword filtering and API calls to Google's Gemini
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function getGeminiApiUrl(modelName) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
}

// Allowed topics for the chatbot
const ALLOWED_KEYWORDS = [
  'java',
  'spring',
  'spring boot',
  'react',
  'hooks',
  'jpa',
  'hibernate',
  'microservices',
  'stream',
  'optional',
  'lambda',
  'functional interface',
  'component',
  'props',
  'state',
  'jsx',
  'virtual dom',
  'useeffect',
  'usestate',
  'usecontext',
  'useref',
  'redux',
  'rest',
  'api',
  'bean',
  'autowired',
  'controller',
  'service',
  'repository',
  'entity',
  'transactional',
  'aop',
  'dependency injection',
  'ioc',
  'maven',
  'gradle',
  'junit',
  'mockito',
  'jdbc',
  'servlet',
  'jsp',
  'thymeleaf',
  'security',
  'jwt',
  'oauth',
  'docker',
  'kubernetes',
  'kafka',
  'rabbitmq',
  'database',
  'sql',
  'nosql',
  'mongodb',
  'redis',
  'caching',
  'multithreading',
  'concurrency',
  'synchronized',
  'executor',
  'completablefuture',
  'design pattern',
  'singleton',
  'factory',
  'builder',
  'mvc',
  'mvvm',
  'solid',
  'oops',
  'inheritance',
  'polymorphism',
  'encapsulation',
  'abstraction',
  'interface',
  'abstract class',
  'exception',
  'collection',
  'arraylist',
  'hashmap',
  'hashset',
  'treemap',
  'comparator',
  'comparable',
  'generics',
  'annotation',
  'reflection',
  'serialization',
  'cloning',
  'garbage collection',
  'jvm',
  'jdk',
  'jre',
  'classloader',
  'memory',
  'heap',
  'stack',
  'string',
  'stringbuilder',
  'stringbuffer',
  'immutable',
  'final',
  'static',
  'volatile',
  'transient',
  'wrapper',
  'autoboxing',
  'enum',
  'record',
  'sealed',
  'pattern matching',
  'switch expression',
  'module',
  'var',
  'local variable type inference',
];

const RESTRICTED_MESSAGE =
  'I can only answer questions related to Java, Spring, and React interview topics.';

/**
 * Check if the user query contains allowed keywords
 */
function isQueryAllowed(query) {
  const lowerQuery = query.toLowerCase();
  return ALLOWED_KEYWORDS.some((keyword) => lowerQuery.includes(keyword));
}

/**
 * Generate a structured interview-style prompt for Gemini
 */
function buildPrompt(userQuery) {
  return `You are an expert technical interviewer specializing in Java, Spring Boot, and React. Answer the following interview question strictly in this structured format:

**Definition:** Brief definition of the concept.
**Key Points:** 3-5 bullet points highlighting important interview points.
**Example:** A concise code example in Java or React (where applicable) with best practices.

Rules:
- Keep the entire answer under 300 words.
- Focus on real-world usage and best practices.
- Prefer Java 8+ features (Streams, Optional, Lambda, etc.) where relevant.
- Avoid unnecessary theory.

Question: ${userQuery}`;
}

/**
 * Call Gemini API with the user query
 */
export async function sendMessageToGemini(userQuery, modelName = 'gemini-3.1-flash-lite-preview') {
  // Step 1: Keyword filtering
  if (!isQueryAllowed(userQuery)) {
    return {
      ok: true,
      text: RESTRICTED_MESSAGE,
      fromBot: true,
    };
  }

  // Step 2: Validate API key
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return {
      ok: false,
      text: 'Gemini API key is not configured. Please add your API key to the .env file.',
      fromBot: true,
    };
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
                  text: buildPrompt(userQuery),
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.3,
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
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response generated. Please try again.';

    return {
      ok: true,
      text: generatedText.trim(),
      fromBot: true,
    };
  } catch (err) {
    return {
      ok: false,
      text: `Error: ${err.message || 'Something went wrong. Please try again later.'}`,
      fromBot: true,
    };
  }
}

