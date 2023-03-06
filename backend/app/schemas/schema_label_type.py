from pydantic import BaseModel


class LabelTypeCreateApiIn(BaseModel):
    name: str


class LabelTypeCreateCrud(LabelTypeCreateApiIn):
    pass


class LabelTypeUpdateApiIn(BaseModel):
    name: str


class LabelTypeUpdateCrud(LabelTypeUpdateApiIn):
    pass


class LabelType(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class LabelTypeApiOut(LabelType):
    pass
