#pip install anthropic
#pip install python-dotenv

import anthropic
import os
from dotenv import load_dotenv
import base64

load_dotenv(override=True)

key = os.environ.get('claude_key')
client = anthropic.Anthropic(api_key=key)

# Upload the image file
with open("test.png", "rb") as image_file:
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
                        "media_type": "image/png",
                        "data": base64_image,
                    },
                },
                {"type": "text", 
                 "text": "Extract all the text under the synopsis section. Do not include other text."},
            ],
        }
    ],
)

print(response)