from pydantic import BaseModel


class TagCreateCrud(BaseModel):
    tag_group: int
    tag_element: int

    name: str
    keyword: str


class TagUpdateCrud(BaseModel):
    pass


class Tag(BaseModel):
    id: int

    tag_group: int
    tag_element: int

    name: str
    keyword: str

    class Config:
        orm_mode = True


class TagApiOut(Tag):
    pass
