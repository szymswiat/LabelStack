from typing import Any

from pydantic import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn
from pydantic import validator  # type: ignore


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    ENV: str = "prod"
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            return v
        raise ValueError(v)

    PROJECT_NAME: str
    SENTRY_DSN: HttpUrl | None = None

    @validator("SENTRY_DSN", pre=True)
    def sentry_dsn_can_be_blank(cls, v: str) -> str | None:
        if len(v) == 0:
            return None
        return v

    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_APP_DB: str
    SQLALCHEMY_DATABASE_URI: PostgresDsn | None = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: str | None, values: dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values["POSTGRES_SERVER"],
            path=f"/{values.get('POSTGRES_APP_DB') or ''}",
        )

    TEST_USER_EMAIL: EmailStr = EmailStr("test@labelstack.com")
    TEST_USER_PASSWORD: str
    TEST_INIT_DATA_ROOT: str = "db/init/resources"

    FIRST_SUPERUSER: EmailStr
    FIRST_SUPERUSER_PASSWORD: str
    USERS_OPEN_REGISTRATION: bool = False

    DICOMWEB_ORIGIN: str
    DICOMWEB_SYNC_DELAY: int

    INTERNAL_USER: EmailStr
    INTERNAL_USER_PASSWORD: str

    class Config(BaseSettings.Config):
        case_sensitive = True


settings = Settings()  # type: ignore
