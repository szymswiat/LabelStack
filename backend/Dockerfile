FROM python:3.10

WORKDIR /code
ENV PYTHONPATH=/code

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy poetry.lock* in case it doesn't exist in the repo
COPY ./pyproject.toml ./poetry.lock* /code/

RUN --mount=type=cache,target=/root/.cache/pypoetry \
    poetry install --no-root --only main

# RUN poetry install --no-root --only main

COPY ./alembic.ini /code/
COPY ./app /code/app
COPY ./alembic /code/alembic

CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000" ]
