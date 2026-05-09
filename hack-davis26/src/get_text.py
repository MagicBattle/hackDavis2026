#uvicorn get_text:app --reload

import anthropic
import os
import time
from dotenv import load_dotenv
import base64
import cv2
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/"],  # Vite React dev server
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=[""],
)

class ImagePayload(BaseModel):
    image: str
    filename: str

@app.get("/save-image")
def save_image(payload: ImagePayload):
    os.makedirs("labels", exist_ok=True)

    header, encoded = payload.image.split(",", 1)
    image_bytes = base64.b64decode(encoded)

    file_path = os.path.join("labels", payload.filename)

    with open(file_path, "wb") as f:
        f.write(image_bytes)

    return {
        "message": "Image saved",
        "path": file_path,
    }

def query(image_name):
    base_path = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(base_path, image_name)

    with open(image_path, "rb") as image_file:
        # Read file, encode to base64, and decode to utf-8 string
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')

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
                            "data": base64_image,
                        },
                    },
                    {"type": "text", 
                    "text": PROMPT},
                ],
            }
        ],
    )

    print(response.content[0].text)

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
