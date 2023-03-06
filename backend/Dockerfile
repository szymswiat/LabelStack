FROM python:3.10

WORKDIR /code
ENV PYTHONPATH=/code

# Install Poetry
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy poetry.lock* in case it doesn't exist in the repo
COPY ./pyproject.toml ./poetry.lock* /code/

RUN --mount=type=cache,target=/root/.cache/pypoetry \
    poetry install --no-root --no-dev

COPY ./alembic.ini /code/
COPY ./app /code/app

CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000" ]
