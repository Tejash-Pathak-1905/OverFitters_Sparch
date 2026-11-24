from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from .models import IntentRequest
from .planner import plan

app = FastAPI(title="Sparsh Planner", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/plan")
def create_plan(request: IntentRequest):
    return plan(request.command, request.flights)


@app.get("/", include_in_schema=False)
def home():
    return RedirectResponse("/navigator/")


app.mount(
    "/navigator",
    StaticFiles(directory=Path(__file__).resolve().parents[1] / "extension", html=True),
    name="navigator",
)
