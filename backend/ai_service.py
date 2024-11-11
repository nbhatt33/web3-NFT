from diffusers import StableDiffusionPipeline
import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
from io import BytesIO

app = FastAPI()

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
        
        # Upload to IPFS (implement your IPFS logic here)
        ipfs_hash = upload_to_ipfs(buffered.getvalue())
        
        return GenerationResponse(
            image_base64=img_str,
            ipfs_hash=ipfs_hash
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 