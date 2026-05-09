import anthropic
import os
from dotenv import load_dotenv
import base64
import cv2

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

cap = cv2.VideoCapture(0) # Open default camera
count = 0

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

while True:
    ret, frame = cap.read()
    cv2.imshow('Camera Feed', frame)
    
    # Chcks the input of the user
    input = cv2.waitKey(1) & 0xFF

    # If space save image else if q quit
    if input == ord(' '):
        cv2.imwrite(rf'hack-davis26\src\labels\{count}.jpg', frame)
        image = rf'labels\{count}.jpg'
        query(image)
        count = count + 1
    elif input == ord('q'):
        break # Exit after taking the photo

cap.release()
cv2.destroyAllWindows()
