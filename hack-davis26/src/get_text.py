#uvicorn get_text:app --reload

import anthropic
import os
from dotenv import load_dotenv
import base64
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImagePayload(BaseModel):
    image: str

@app.get("/get-history")
def get_history():
    return history

@app.delete("/clear-history")
def clear_history():
    history.clear()
    return {}

@app.post("/save-image")
def save_image(payload: ImagePayload):
    import json
    header, encoded = payload.image.split(",", 1)
    raw = query(encoded)
    if raw.strip() == "ERROR":
        return {}

    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start == -1 or end == 0:
        return {}

    try:
        parsed_data = json.loads(raw[start:end])
    except json.JSONDecodeError:
        return {}

    grade_key = parsed_data.get("overall_grade", "").strip('"').strip()
    if grade_key not in history:
        history[grade_key] = [parsed_data]
    else:
        history[grade_key].append(parsed_data)

    total = sum(len(v) for v in history.values())
    if total > 15:
        largest_grade = max(history, key=lambda g: len(history[g]))
        history[largest_grade].pop(0)
        if not history[largest_grade]:
            del history[largest_grade]

    return parsed_data

def query(image_data):
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_data,
                        },
                    },
                    {"type": "text", 
                    "text": PROMPT},
                ],
            }
        ],
    )

    return response.content[0].text

# Set up variables
load_dotenv(override=True)

key = os.environ.get('claude_key')
client = anthropic.Anthropic(api_key=key)
history = {}

PROMPT = """
First check if the image provided contains a food label. If it does not return ERROR.
Else do the following.

You are a food safety expert. Analyze this food label image.
 
Respond ONLY with valid JSON, no extra text, no markdown backticks. Format:
{
  "product_name": "name or Unknown",
  "overall_grade": "A or B or C or D or F",
  "summary": "2-3 sentence plain english summary",
  "flagged_ingredients": [
    {
      "name": "ingredient name",
      "severity": "high or medium or low",
      "reason": "plain english explanation"
    }
  ],
  "total_ingredients_scanned": 12,
  "healthier_swap": "suggestion for a better alternative"
}
 
Severity guide:
high: strong evidence of harm (Red 40, high fructose corn syrup, trans fats, BHA/BHT)
medium: worth limiting (seed oils, excess sodium)
low: minor concern (natural flavors, carrageenan)
"""

base_path = os.path.dirname(os.path.abspath(__file__))
labels_path = os.path.join(base_path, 'labels')
os.makedirs(labels_path, exist_ok=True)
