from diffusers import StableDiffusionPipeline
import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
from io import BytesIO

from starlette.middleware.cors import CORSMiddleware

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with the allowed origins (e.g., ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class GenerationRequest(BaseModel):
    prompt: str
    credits: int


class GenerationResponse(BaseModel):
    image_base64: str
    ipfs_hash: str


# Initialize the model globally
pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4")
pipe.to("cuda" if torch.cuda.is_available() else "mps")
pipe.enable_attention_slicing()


@app.post("/generate")
async def generate_nft(request: GenerationRequest):
    try:
        # Check if user has enough credits
        if request.credits <= 0:
            raise HTTPException(status_code=402, detail="Insufficient credits")

        # Generate image
        image = pipe(request.prompt).images[0]

        # Convert to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        # # Upload to IPFS (implement your IPFS logic here)
        # ipfs_hash = upload_to_ipfs(buffered.getvalue())

        return GenerationResponse(
            image_base64=img_str,
            ipfs_hash="ipfs_hash"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# @app.post("/generate", response_model=GenerationResponse)
# async def generate_nft(request: GenerationRequest):
#     try:
#         # Check if user has enough credits
#         if request.credits <= 0:
#             raise HTTPException(status_code=402, detail="Insufficient credits")
#         print(request.prompt)
#
#         # Generate image using Stable Diffusion
#         image = pipe(request.prompt).images[0]
#         print(image)
#
#         # Convert the image to Base64
#         buffered = BytesIO()
#         image.save(buffered, format="PNG")
#         img_str = base64.b64encode(buffered.getvalue()).decode()
#
#         return GenerationResponse(image_base64=img_str)
#
#     except Exception as e:
#         # Log the exception for debugging
#         print(f"Error: {e}")
#         raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")