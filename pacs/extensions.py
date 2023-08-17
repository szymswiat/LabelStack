from concurrent.futures import ThreadPoolExecutor
import orthanc  # type: ignore
import os
from typing import Any
import time

import requests


executor = ThreadPoolExecutor(max_workers=1)


API_HOST_ORIGIN = "http://backend:8000"
API_V1_STR = "/api/v1"
INTERNAL_USER = os.environ["INTERNAL_USER"]
INTERNAL_USER_PASSWORD = os.environ["INTERNAL_USER_PASSWORD"]

on_stored_instance_sec = 0


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
    global on_stored_instance_sec

    on_stored_instance_sec = time.time()


def run_sync():
    global on_stored_instance_sec

    while True:

        if on_stored_instance_sec != 0 and (time.time() - on_stored_instance_sec) > 5:

            token = requests.post(
                f"{API_HOST_ORIGIN}{API_V1_STR}/login/access-token",
                data={"username": INTERNAL_USER, "password": INTERNAL_USER_PASSWORD},
            ).json()["access_token"]

            requests.post(
                url=f"{API_HOST_ORIGIN}{API_V1_STR}/dicoms/sync_dicomweb",
                headers={"authorization": f"Bearer {token}"},
            )

            on_stored_instance_sec = 0

        time.sleep(0.5)


orthanc.RegisterIncomingHttpRequestFilter(incoming_request_filter)  # type: ignore
orthanc.RegisterOnStoredInstanceCallback(on_stored_instance)  # type: ignore

executor.submit(run_sync)
