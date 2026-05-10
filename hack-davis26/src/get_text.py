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

@app.post("/save-image")
def save_image(payload: ImagePayload):
    os.makedirs("labels", exist_ok=True)

    header, encoded = payload.image.split(",", 1)
    
    data = query(encoded)

    product_name = data[data.find(":") + 2:data.find(',')]
    data = data[data.find(',') + 1:]

    overall_grade = data[data.find(":") + 2:data.find(',')]
    data = data[data.find(',') + 1:]

    summary = data[data.find(":") + 2:data.find(',')]
    data = data[data.find(',') + 1:]

    temp = data[data.find(":") + 2:data.find(']')]
    data = data[data.find(']') + 2:]
    flagged_ingredients = []

    total_ingredients = data[data.find(":") + 2:data.find(',')]
    data = data[data.find(',') + 1:]

    healthy_swap = data[data.find(":") + 2:data.find('}')]

    while temp.find('}') != -1:
        name = temp[temp.find(":") + 2:temp.find(',')]
        temp = temp[temp.find(',') + 1:]

        severity = temp[temp.find(":") + 2:temp.find(',')]
        temp = temp[temp.find(',') + 1:]

        reason = temp[temp.find(":") + 2:temp.find('}')]
        temp = temp[temp.find('}') + 2:]

        flagged_ingredients.append(
            {
                "name": name,
                "severity": severity,
                "reason": reason,
            }
        )

    return {
        "product_name": product_name,
        "overall_grade": overall_grade,
        "summary": summary,
        "flagged_ingredients": flagged_ingredients,
        "total_ingredients": total_ingredients,
        "healthy_swap": healthy_swap,
    }

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
