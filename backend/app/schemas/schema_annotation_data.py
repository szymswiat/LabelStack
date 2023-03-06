from pydantic import BaseModel


class AnnotationDataCreateCrud(BaseModel):
    annotation_id: int
    data: bytes
    sequence: int
    md5_hash: str


class AnnotationDataUpdateCrud(BaseModel):
    pass


class AnnotationData(BaseModel):
    annotation_id: int
    sequence: int
    md5_hash: str

    class Config:
        orm_mode = True


class AnnotationDataGetLatestHashApiOut(BaseModel):
    md5_hash: str

    class Config:
        orm_mode = True


class AnnotationDataApiOut(AnnotationData):
    pass
