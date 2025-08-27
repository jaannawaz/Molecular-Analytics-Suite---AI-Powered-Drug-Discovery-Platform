import os
from pydantic import BaseModel

class Settings(BaseModel):
  ENV: str = os.getenv("ENV", "dev")
  AGNO_TELEMETRY: str = os.getenv("AGNO_TELEMETRY", "false")
  OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY")
  GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY")

settings = Settings() 