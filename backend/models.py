from pydantic import BaseModel, Field


class Flight(BaseModel):
    airline: str
    time: str
    price: int = Field(gt=0)


class IntentRequest(BaseModel):
    command: str = Field(max_length=250)
    flights: list[Flight] = Field(default_factory=list, max_length=20)
