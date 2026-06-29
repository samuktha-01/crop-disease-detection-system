import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

function buildPrompt(context) {
  return `You are KrishiDoc, an expert Indian agricultural plant pathologist. ${context}

Respond ONLY with valid JSON — no markdown, no prose, no backticks.

JSON schema:
{
  "diagnosis": {
    "condition": "disease/pest/deficiency name",
    "type": "disease|pest|deficiency|healthy",
    "severity": "high|medium|low",
    "confidence": 85,
    "description": "2-3 sentences on what you observe"
  },
  "cause": "causative agent in 1-2 sentences",
  "symptoms_visible": "specific symptoms confirming diagnosis",
  "spread_risk": "high|medium|low",
  "urgency_days": 7,
  "treatments": [
    {
      "type": "organic",
      "name": "treatment name",
      "detail": "dosage, timing, application method",
      "cost_estimate": "₹XX per acre or Free",
      "availability": "where to get it in India"
    },
    {
      "type": "chemical",
      "name": "chemical name + Indian brand",
      "detail": "active ingredient, dosage, safety notes",
      "cost_estimate": "₹XXX per acre",
      "availability": "agri input dealers / IFFCO outlets"
    },
    {
      "type": "cultural",
      "name": "cultural practice",
      "detail": "specific agronomic action",
      "cost_estimate": "Free / labour only",
      "availability": "no purchase needed"
    }
  ],
  "prevention": "2-3 India-specific prevention sentences",
  "icar_reference": "relevant ICAR or KVK recommendation",
  "affected_crops_nearby": ["other crops at risk"]
}`
}

/* ── Crop Diagnosis ── */
export async function diagnoseCrop({ base64Image, mimeType, crop, stage, region, budget }) {
  const context = `Crop: ${crop || 'unspecified'}. Stage: ${stage || 'unspecified'}. Region: ${region || 'India'}. Budget: ${budget || 'medium'}. Prioritise organic solutions first.`

  let result

  if (base64Image) {
    const imagePart = { inlineData: { data: base64Image, mimeType: mimeType || 'image/jpeg' } }
    const textPart = { text: buildPrompt(context) }
    result = await model.generateContent([imagePart, textPart])
  } else {
    result = await model.generateContent(buildPrompt(context + ' No image provided — give a realistic example diagnosis for this crop and region.'))
  }

  const raw = result.response.text().replace(/```json|```/g, '').trim()
  return JSON.parse(raw)
}

/* ── Follow-up Q&A ── */
export async function askFollowUp({ question, diagnosisContext }) {
  const prompt = `You are KrishiDoc, an expert Indian agricultural advisor. Answer this farmer's question with practical India-specific advice referencing locally available products and ICAR guidelines where relevant. Be concise and actionable.

Diagnosis context: ${JSON.stringify(diagnosisContext)}

Farmer's question: ${question}`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

/* ── Seasonal Tips ── */
export async function getSeasonalTips({ region, crop }) {
  const prompt = `You are KrishiDoc, an Indian agricultural advisor. Give seasonal crop protection tips for Region: ${region || 'India'}, Crop: ${crop || 'general'}.

Respond ONLY with valid JSON — no markdown, no backticks.

Schema:
{
  "season": "current season name",
  "tips": [
    { "category": "string", "icon": "water|bug|leaf|sun|shield|calendar", "title": "string", "detail": "2 sentences" }
  ],
  "alert": "urgent advisory string or null"
}`

  const result = await model.generateContent(prompt)
  const raw = result.response.text().replace(/```json|```/g, '').trim()
  return JSON.parse(raw)
}