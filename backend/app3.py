from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Literal
from app2 import answer
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from groq import Groq
import numpy as np
from PIL import Image
import io
import fitz  # PyMuPDF
import json
import tempfile
import os

app = FastAPI(title="Disease Detection API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
model = load_model("best_brain_tumor_model.h5")
model2 = load_model("chest_xray_model.h5")

# Groq API client
client = Groq(api_key='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')

# Category info
categories = ['notumor', 'glioma', 'meningioma', 'pituitary']
categories_2 = ['Normal', 'Pneumonia']

condition_info = {
    'notumor': {
        "area": "Normal Brain",
        "description": "No visible signs of tumor. Brain structure appears normal."
    },
    'glioma': {
        "area": "Frontal or Temporal Lobe (typically)",
        "description": "Gliomas are tumors that occur in the glial cells of the brain, often aggressive and infiltrative."
    },
    'meningioma': {
        "area": "Meninges (Outer Brain Covering)",
        "description": "Meningiomas arise from the membranes surrounding the brain and spinal cord. Usually benign."
    },
    'pituitary': {
        "area": "Pituitary Gland (Base of Brain)",
        "description": "Tumor affecting the pituitary gland. May impact hormone regulation."
    }
}
condition_info_2 = {
    'Normal': {
        "area": "Lung Fields",
        "description": "No signs of pneumonia. The lung parenchyma appears clear and normal."
    },
    'Pneumonia': {
        "area": "Lung Lobes (typically lower lobes)",
        "description": "Presence of consolidation or infiltrates in the lungs, indicating possible pneumonia."
    }
}

# Response models
class TumorPredictionResponse(BaseModel):
    condition: Literal['notumor', 'glioma', 'meningioma', 'pituitary']
    area_of_interest: str
    analysis_description: str
    confidence: float

class PneumoniaPredictionResponse(BaseModel):
    condition: Literal['Normal', 'Pneumonia']
    area_of_interest: str
    analysis_description: str
    confidence: float

# Tumor prediction
@app.post("/predict", response_model=TumorPredictionResponse)
async def predict_tumor(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert('RGB')
        img = img.resize((224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_index])
        predicted_class = categories[predicted_index]

        area = condition_info[predicted_class]["area"]
        description = condition_info[predicted_class]["description"]

        return TumorPredictionResponse(
            condition=predicted_class,
            area_of_interest=area,
            analysis_description=description,
            confidence=round(confidence, 4)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

# Pneumonia prediction
@app.post("/predict-pneumonia", response_model=PneumoniaPredictionResponse)
async def predict_pneumonia(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert('RGB')
        img = img.resize((224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = model2.predict(img_array)[0][0]
        predicted_class = 'Pneumonia' if prediction > 0.5 else 'Normal'
        confidence = float(prediction) if predicted_class == 'Pneumonia' else float(1 - prediction)

        area = condition_info_2[predicted_class]["area"]
        description = condition_info_2[predicted_class]["description"]

        return PneumoniaPredictionResponse(
            condition=predicted_class,
            area_of_interest=area,
            analysis_description=description,
            confidence=round(confidence, 4)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

# PDF medical report analysis
def extract_text_from_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()

@app.post("/analyze-report/")
async def analyze_report(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    report_text = extract_text_from_pdf(tmp_path)
    os.unlink(tmp_path)

    instructions = (
        "You are a medical report analysis assistant.\n"
        "Your job is to analyze the following medical report and respond with only a JSON object.\n"
        "Do not include any explanation or extra text—only return the JSON.\n"
        "Here is the exact format you must follow:\n"
        "{\n"
        "  \"Report Summary\": \"Summary of the report\",\n"
        "  \"Key Findings\": [\"Finding 1\", \"Finding 2\", \"Finding 3\", \"Finding 4\"],\n"
        "  \"Severity Assessment\": \"Mild\" | \"Moderate\" | \"Severe\",\n"
        "  \"Recommended Followup\": \"Recommended next steps\",\n"
        "  \"Treatment Consideration\": [\"Treatment 1\", \"Treatment 2\", \"Treatment 3\", \"Treatment 4\"]\n"
        "}\n\n"
        "Now analyze the following medical report:\n\n"
    )

    full_prompt = instructions + report_text

    try:
        return answer

        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": full_prompt}],
            model="gemma2-9b-it"
        )
        response_text = chat_completion.choices[0].message.content
        print(response_text)
        parsed_output = json.loads(response_text)
        return JSONResponse(content=parsed_output)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
