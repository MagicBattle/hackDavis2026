from fastapi import FastAPI

# 1. Create a FastAPI instance
app = FastAPI()

# 2. Define the GET endpoint at the root path "/"
@app.get("/")
async def root():
    # 3. Return data (FastAPI automatically converts this to JSON)
    return {"message": "Hello World"}