## **Development setup**

### **Setup environment**

Yoy only need to setup environment for backend and frontend application. The rest is handled automatically by docker compose.

Required software:
- `docker` and `docker compose`
- `poetry`
- `yarn`

To setup environment for backend application go to `/backend` directory and type `poetry install`. This should create python environment (inside repository `/backend/.venv`) and install all required depenedencies for the development.

Next, go to `/frontend` directory and type `yarn install` to install all dependencies for the viewer webapp.

Now, you should be able to run development setup.

### **Run components**

The easiest way to run development setup is to use predefined VSCode tasks. Running `[DEV] Run dev setup` tasks should do the job and will expose following components to the host:

|Component|URL|
|---------|---|
|LabelStack WebUI|`http://localhost:3000`|
|REST API (Swagger)|`http://localhost:8000/api/v1/docs`|
|Orthanc WebUI|`http://localhost/pacs/app/explorer.html`|
|Traefik Dashboard|`http://localhost:8080/dashboard#/`|

**Note:** To run backend using VSCode task you need to set default python interpreter for the project and open any python file.

Next, to let the whole system work you need to apply database migrations using `[DEV] Run database migrations` task and initialize it using `[DEV] Reload database initial data` task.

## **Production setup**

TODO