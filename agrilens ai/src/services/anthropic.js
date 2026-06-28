// ── services/anthropic.js ──
// All Claude API calls live here. Add your API key to .env as VITE_ANTHROPIC_API_KEY

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL   = 'claude-sonnet-4-6'

async function callClaude({ system, messages, maxTokens = 1500 }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Missing VITE_ANTHROPIC_API_KEY in .env file')

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${res.status}`)
  }

  const data = await res.json()
  const raw = data.content.map(b => b.text || '').join('')
  return raw.replace(/```json|```/g, '').trim()
}

/* ── Crop Diagnosis ── */
export async function diagnoseCrop({ base64Image, mimeType, crop, stage, region, budget }) {
  const system = `You are CropHealth AI, an expert Indian agricultural plant pathologist and crop pest management specialist with 20 years experience across all Indian agro-climatic zones. You are deeply familiar with ICAR guidelines, state agriculture department recommendations, and locally available products across India.

Respond ONLY with valid JSON — no prose, no markdown, no explanation outside the JSON.

JSON schema:
{
  "diagnosis": {
    "condition": "string — exact disease/pest/deficiency name",
    "type": "disease|pest|deficiency|healthy",
    "severity": "high|medium|low",
    "confidence": 0-100,
    "description": "2-3 sentences explaining what you observe and why you made this diagnosis"
  },
  "cause": "1-2 sentences on causative agent (pathogen name, pest species, or missing nutrient)",
  "symptoms_visible": "Specific visible symptoms that confirm this diagnosis",
  "spread_risk": "high|medium|low",
  "urgency_days": 7,
  "treatments": [
    {
      "type": "organic",
      "name": "Treatment name",
      "detail": "Dosage, timing, application method, frequency",
      "cost_estimate": "₹XX per acre or Free",
      "availability": "Specific shops/sources in India where available"
    },
    {
      "type": "chemical",
      "name": "Chemical name (generic + brand)",
      "detail": "Active ingredient %, dosage per litre, spray schedule, safety precautions",
      "cost_estimate": "₹XXX per acre",
      "availability": "Available at district agri input dealers / IFFCO outlets"
    },
    {
      "type": "cultural",
      "name": "Cultural practice",
      "detail": "Specific agronomic action to take",
      "cost_estimate": "Free / labour only",
      "availability": "No purchase needed"
    }
  ],
  "prevention": "2-3 sentences on preventing recurrence — India-specific, season-aware",
  "icar_reference": "Specific ICAR bulletin or KVK recommendation if applicable",
  "affected_crops_nearby": ["list of other crops that could be affected if this spreads"]
}`

  const userContent = base64Image
    ? [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Image } },
        { type: 'text', text: `Crop: ${crop || 'not specified'}. Growth stage: ${stage || 'not specified'}. Region: ${region || 'India'}. Farmer budget: ${budget || 'medium'}. Diagnose any disease, pest infestation, or nutritional deficiency visible. Prioritise organic and bio-pesticide options first.` }
      ]
    : [{ type: 'text', text: `Crop: ${crop}. Growth stage: ${stage}. Region: ${region}. Budget: ${budget}. Provide a realistic example diagnosis for a common problem in this crop for this region and season.` }]

  const json = await callClaude({ system, messages: [{ role: 'user', content: userContent }] })
  return JSON.parse(json)
}

/* ── Follow-up Q&A ── */
export async function askFollowUp({ question, diagnosisContext }) {
  const system = `You are CropHealth AI, an expert Indian agricultural advisor. Answer farmer questions about crop diseases, pests, and treatments with practical, India-specific advice. Be concise, actionable, and reference locally available products and ICAR guidelines where relevant. Respond in plain conversational text (no JSON).`

  const messages = [
    { role: 'user', content: `Context: ${JSON.stringify(diagnosisContext)}\n\nFarmer's question: ${question}` }
  ]

  return callClaude({ system, messages, maxTokens: 600 })
}

/* ── Seasonal tips ── */
export async function getSeasonalTips({ region, crop }) {
  const system = `You are CropHealth AI, an Indian agricultural advisor. Return ONLY valid JSON — no prose.

Schema:
{
  "season": "current season name",
  "tips": [
    { "category": "string", "icon": "one of: water|bug|leaf|sun|shield|calendar", "title": "string", "detail": "2 sentences" }
  ],
  "alert": "string or null — any urgent advisory for this region/crop right now"
}`

  const json = await callClaude({
    system,
    messages: [{ role: 'user', content: `Region: ${region || 'India'}. Crop: ${crop || 'general'}. Give 6 seasonal tips.` }],
    maxTokens: 800
  })
  return JSON.parse(json)
}
