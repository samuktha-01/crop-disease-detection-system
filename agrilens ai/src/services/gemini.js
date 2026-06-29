import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing VITE_GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

function buildPrompt(context) {
  return `You are CropHealth AI, an expert Indian agricultural plant pathologist with deep knowledge of crop diseases, pest infestations, nutrient deficiencies, ICAR recommendations, and sustainable farming practices.

${context}

Respond ONLY with valid JSON.

Schema:

{
  "diagnosis": {
    "condition": "",
    "type": "disease|pest|deficiency|healthy",
    "severity": "high|medium|low",
    "confidence": 95,
    "description": ""
  },
  "cause": "",
  "symptoms_visible": "",
  "spread_risk": "high|medium|low",
  "urgency_days": 7,
  "treatments":[
    {
      "type":"organic",
      "name":"",
      "detail":"",
      "cost_estimate":"",
      "availability":""
    },
    {
      "type":"chemical",
      "name":"",
      "detail":"",
      "cost_estimate":"",
      "availability":""
    },
    {
      "type":"cultural",
      "name":"",
      "detail":"",
      "cost_estimate":"",
      "availability":""
    }
  ],
  "prevention":"",
  "icar_reference":"",
  "affected_crops_nearby":[]
}`;
}

/* -------------------- Diagnose Crop -------------------- */

export async function diagnoseCrop({
  base64Image,
  mimeType,
  crop,
  stage,
  region,
  budget,
}) {

  const context = `
Crop : ${crop || "Unknown"}

Growth Stage : ${stage || "Unknown"}

Region : ${region || "India"}

Budget : ${budget || "Medium"}

Prioritize organic treatment first.
`;

  let result;

  if (base64Image) {

    result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType || "image/jpeg",
        },
      },
      {
        text: buildPrompt(context),
      },
    ]);

  } else {

    result = await model.generateContent(
      buildPrompt(
        context +
          "\nNo image uploaded. Give an example diagnosis for this crop."
      )
    );
  }

  const text = result.response.text();

  return JSON.parse(
    text.replace(/```json|```/g, "").trim()
  );
}

/* -------------------- Follow Up -------------------- */

export async function askFollowUp({
  question,
  diagnosisContext,
}) {

  const prompt = `

You are CropHealth AI.

Diagnosis:

${JSON.stringify(diagnosisContext)}

Farmer Question:

${question}

Answer simply.

Recommend Indian products.

Mention ICAR if applicable.

`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

/* -------------------- Seasonal Tips -------------------- */

export async function getSeasonalTips({
  region,
  crop,
}) {

  const prompt = `

You are CropHealth AI.

Provide 6 seasonal farming tips.

Crop : ${crop || "General"}

Region : ${region || "India"}

Return ONLY JSON.

{
 "season":"",
 "tips":[
   {
     "category":"",
     "icon":"",
     "title":"",
     "detail":""
   }
 ],
 "alert":""
}

`;

  const result = await model.generateContent(prompt);

  return JSON.parse(
    result.response.text().replace(/```json|```/g, "").trim()
  );
}