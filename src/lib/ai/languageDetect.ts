// Language detection utilities

// Common language patterns for detection
const languagePatterns: Record<string, RegExp[]> = {
  zh: [
    /[\u4e00-\u9fff]/, // Chinese characters
    /我|你|他|她|它|们|的|是|有|在|不|了|和|人|这|中|大|为|上|个|国|要|会|可|好|请|谢|对|没|来|能|说|去|做|看|知道|可以|需要|想要|怎么|什么|多少|哪里|哪个|谁|吗|呢|啊|吧/,
  ],
  de: [
    /\b(der|die|das|und|ist|ein|eine|ich|du|er|sie|es|wir|ihr|Sie|nicht|haben|sein|werden|können|sollen|müssen|dürfen|wollen|mögen|bitte|danke|ja|nein|für|mit|von|auf|an|bei|nach|zu|aus|über|unter|vor|hinter|neben|zwischen)\b/i,
  ],
  fr: [
    /\b(le|la|les|un|une|des|et|est|en|que|qui|dans|ce|il|elle|on|nous|vous|ils|elles|pas|ne|avoir|être|faire|aller|voir|savoir|pouvoir|vouloir|falloir|dire|mettre|prendre|donner|aller|venir|s'il|merci|bonjour)\b/i,
  ],
  es: [
    /\b(el|la|los|las|un|una|unos|unas|y|o|pero|si|que|quien|cual|donde|cuando|como|porque|en|de|a|por|con|sin|sobre|entre|hacia|hasta|desde|es|son|está|están|ser|estar|tener|haber|hacer|poder|decir|ir|ver|dar|saber|querer|llegar|pasar|deber|poner|parecer|quedar|creer|hablar|llevar|dejar|seguir|encontrar|llamar|venir|pensar|salir|volver|tomar|conocer|querer|gracias|hola|por favor)\b/i,
  ],
  ru: [
    /[\u0400-\u04ff]/, // Cyrillic characters
    /\b(и|в|не|на|я|что|он|с|как|а|то|все|она|так|его|но|да|ты|к|у|же|вы|за|бы|по|только|её|мне|было|вот|от|меня|ещё|нет|о|из|ему|теперь|когда|уже|для|вас|ни|чем|или|этот|без|да|нет|спасибо|пожалуйста)\b/i,
  ],
  ja: [
    /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/, // Hiragana, Katakana, and Kanji
    /です|ます|して|ない|ある|いる|この|その|あの|これ|それ|あれ|どこ|なに|だれ|いつ|いくら|ください|ありがとう|すみません/,
  ],
  ko: [
    /[\uac00-\ud7af]/, // Korean characters
    /입니다|있습니다|없습니다|합니다|주세요|감사합니다|안녕하세요|어떻게|무엇|얼마|어디|누구|언제/,
  ],
  pt: [
    /\b(o|a|os|as|um|uma|e|ou|mas|em|de|para|com|por|sem|sobre|entre|é|são|estar|ter|ser|ir|fazer|poder|dizer|ver|dar|saber|querer|chegar|passar|dever|pôr|parecer|ficar|crer|falar|levar|deixar|seguir|encontrar|chamar|vir|pensar|sair|voltar|tomar|conhecer|obrigado|obrigada|por favor|olá)\b/i,
  ],
  it: [
    /\b(il|lo|la|i|gli|le|un|uno|una|e|o|ma|se|che|chi|quale|dove|quando|come|perché|in|di|a|da|con|su|per|tra|fra|è|sono|essere|avere|fare|andare|venire|dire|potere|volere|sapere|dovere|vedere|dare|stare|tenere|dovere|potere|volere|grazie|per favore|ciao)\b/i,
  ],
  nl: [
    /\b(de|het|een|en|of|maar|in|op|aan|voor|met|zonder|om|door|uit|over|onder|naar|van|bij|ik|jij|hij|zij|wij|jullie|u|heb|ben|is|was|worden|kunnen|moeten|willen|zullen|mogen|weten|zien|komen|gaan|staan|liggen|zitten|doen|laten|danken|alstublieft|ja|nee)\b/i,
  ],
}

// Language names in their native form
export const languageNames: Record<string, string> = {
  en: 'English',
  zh: '中文',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  pt: 'Português',
  it: 'Italiano',
  nl: 'Nederlands',
}

/**
 * Detect the language of a text
 * Returns ISO 639-1 language code
 */
export function detectLanguage(text: string): string {
  if (!text || text.trim().length === 0) {
    return 'en'
  }

  const cleanText = text.trim()
  const scores: Record<string, number> = {}
  
  // Count matches for each language
  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    scores[lang] = 0
    for (const pattern of patterns) {
      const matches = cleanText.match(pattern)
      if (matches) {
        scores[lang] += matches.length
      }
    }
  }

  // Find the language with the highest score
  let maxScore = 0
  let detectedLang = 'en'

  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      detectedLang = lang
    }
  }

  // If no language patterns matched, default to English
  if (maxScore === 0) {
    return 'en'
  }

  return detectedLang
}

/**
 * Detect if text contains multiple languages
 */
export function hasMultipleLanguages(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return false
  }

  const detectedLanguages: string[] = []
  
  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    for (const pattern of patterns) {
      const matches = text.match(pattern)
      if (matches && matches.length > 0) {
        if (!detectedLanguages.includes(lang)) {
          detectedLanguages.push(lang)
        }
        break // Only need one match per language
      }
    }
  }

  return detectedLanguages.length > 1
}

/**
 * Get the response language based on user input
 * Returns 'en' if multiple languages detected, otherwise returns detected language
 */
export function getResponseLanguage(userMessage: string): string {
  // Check for multiple languages first
  if (hasMultipleLanguages(userMessage)) {
    return 'en'
  }
  
  // Detect single language
  const detected = detectLanguage(userMessage)
  return detected
}

/**
 * Get language instruction for system prompt
 */
export function getLanguageInstruction(responseLang: string): string {
  if (responseLang === 'en') {
    return 'Respond in English.'
  }

  const langName = languageNames[responseLang] || 'English'
  
  const instructions: Record<string, string> = {
    zh: '用中文回复。使用专业的商务中文，保持友好和专业的语气。',
    de: 'Antworten Sie auf Deutsch. Verwenden Sie professionelles Geschäftsdeutsch.',
    fr: 'Répondez en français. Utilisez un français professionnel et courtois.',
    es: 'Responda en español. Use español profesional y cortés.',
    ru: 'Отвечайте на русском языке. Используйте профессиональный деловой русский.',
    ja: '日本語で返信してください。丁寧なビジネス日本語を使用してください。',
    ko: '한국어로 답변해 주세요. 정중한 비즈니스 한국어를 사용하세요.',
    pt: 'Responda em português. Use português profissional e cortês.',
    it: 'Risponda in italiano. Usi un italiano professionale e cortese.',
    nl: 'Antwoord in het Nederlands. Gebruik professioneel zakelijk Nederlands.',
  }

  return instructions[responseLang] || `Respond in ${langName}.`
}