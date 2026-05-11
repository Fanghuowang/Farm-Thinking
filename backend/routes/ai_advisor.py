import os

from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api", tags=["ai"])

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


class AdvisorRequest(BaseModel):
    plant_profile: str
    sensor_summary: dict


def _rule_based_advice(profile, summary):
    avg_temp = summary.get("avg_temperature", 0)
    avg_humidity = summary.get("avg_humidity", 0)
    avg_ph = summary.get("avg_ph", 0)
    avg_moisture = summary.get("avg_soil_moisture", 0)
    reservoir = summary.get("avg_reservoir_level", 0)

    tips = []

    if avg_temp > 25:
        tips.append(f"Average temperature ({avg_temp}C) is high. Consider increasing ventilation or running fans during peak hours.")
    elif avg_temp < 15:
        tips.append(f"Average temperature ({avg_temp}C) is low. Reduce fan usage and consider supplemental heating.")

    if avg_humidity > 75:
        tips.append(f"Humidity averaging {avg_humidity}% promotes mold risk. Improve airflow and reduce watering frequency.")
    elif avg_humidity < 45:
        tips.append(f"Low humidity ({avg_humidity}%) may stress plants. Consider misting or reducing ventilation.")

    if avg_ph < 5.5:
        tips.append(f"pH ({avg_ph}) is acidic. Add pH-up solution to reach the {profile} target range.")
    elif avg_ph > 7.0:
        tips.append(f"pH ({avg_ph}) is alkaline. Add pH-down solution to reach the {profile} target range.")

    if avg_moisture < 35:
        tips.append("Soil moisture is consistently low. Increase pump cycle duration or frequency.")
    elif avg_moisture > 70:
        tips.append("Soil moisture is high. Reduce watering to prevent root rot.")

    if reservoir < 25:
        tips.append("Reservoir level is critically low. Schedule a refill within the next 12 hours.")

    if not tips:
        tips.append(f"All parameters are within optimal range for {profile}. Continue current schedule.")

    return " ".join(tips)


async def _gpt_advice(profile, summary):
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    prompt = (
        f"You are an expert agronomist for vertical farming. "
        f"The crop is {profile}. Here is the 7-day sensor summary: {summary}. "
        f"Give concise, actionable recommendations for the next 24 hours. "
        f"Focus on harvest timing, pH/nutrient adjustments, and climate control. "
        f"Keep it under 150 words."
    )
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
    )
    return response.choices[0].message.content


@router.post("/ai-advisor")
async def get_advice(req: AdvisorRequest):
    if OPENAI_API_KEY:
        try:
            recommendation = await _gpt_advice(req.plant_profile, req.sensor_summary)
            source = "gpt-4o"
        except Exception:
            recommendation = _rule_based_advice(req.plant_profile, req.sensor_summary)
            source = "rule-based (API error)"
    else:
        recommendation = _rule_based_advice(req.plant_profile, req.sensor_summary)
        source = "rule-based (no API key)"

    return {"recommendation": recommendation, "source": source}
