from pydantic import BaseModel


class AnnotationTypeCreateApiIn(BaseModel):
    name: str


class AnnotationTypeCreateCrud(AnnotationTypeCreateApiIn):
    pass


class AnnotationTypeUpdateApiIn(BaseModel):
    name: str


class AnnotationTypeUpdateCrud(AnnotationTypeUpdateApiIn):
    pass


class AnnotationType(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class AnnotationTypeApiOut(AnnotationType):
    pass
