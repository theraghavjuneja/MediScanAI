from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io


model = load_model("best_brain_tumor_model.h5")
model2=load_model("chest_xray_model.h5")

categories = ['notumor', 'glioma', 'meningioma', 'pituitary']
categories_2=['Normal', 'Pneumonia']


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
app = FastAPI(title="Brain Tumor Detection API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific origins like ["http://localhost:3000"] for security in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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
        print(TumorPredictionResponse(condition=predicted_class,
            area_of_interest=area,
            analysis_description=description,
            confidence=round(confidence, 4)))
        return TumorPredictionResponse(
            condition=predicted_class,
            area_of_interest=area,
            analysis_description=description,
            confidence=round(confidence, 4)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")
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