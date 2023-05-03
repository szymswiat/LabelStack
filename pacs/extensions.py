import orthanc  # type: ignore
import os
from typing import Any

import requests


API_HOST_ORIGIN = "http://backend:8000"
API_V1_STR = "/api/v1"
INTERNAL_USER = os.environ["INTERNAL_USER"]
INTERNAL_USER_PASSWORD = os.environ["INTERNAL_USER_PASSWORD"]


def incoming_request_filter(uri: str, **request: dict[str, Any]) -> bool:
    headers: dict[str, str] = {}

    cookies = (
        {
            cookie_parts[0]: cookie_parts[1]
            for cookie_str in request["headers"]["cookie"].split("; ")
            if (cookie_parts := cookie_str.split("="))
        }
        if "cookie" in request["headers"]
        else {}
    )

    if "authorization" not in request["headers"] and "token" not in cookies:
        print("No authorization header or token cookie")
        return False

    if "authorization" in request["headers"]:
        headers["authorization"] = request["headers"]["authorization"]
    else:
        headers["authorization"] = f"Bearer {cookies['token']}"

    headers["requested-url"] = uri

    response = requests.get(url=f"{API_HOST_ORIGIN}{API_V1_STR}/auth", headers=headers)

    return 200 <= response.status_code < 300


def on_stored_instance(dicom: Any, instance_id: str):

    token = requests.post(
        f"{API_HOST_ORIGIN}{API_V1_STR}/login/access-token",
        data={"username": INTERNAL_USER, "password": INTERNAL_USER_PASSWORD},
    ).json()["access_token"]

    requests.post(
        url=f"{API_HOST_ORIGIN}{API_V1_STR}/dicoms/sync_dicomweb",
        headers={"authorization": f"Bearer {token}"},
    )


orthanc.RegisterIncomingHttpRequestFilter(incoming_request_filter)  # type: ignore
orthanc.RegisterOnStoredInstanceCallback(on_stored_instance)  # type: ignore
