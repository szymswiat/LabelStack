import orthanc
from typing import Any

import requests


def incoming_request_filter(uri: str, **request: dict[str, Any]) -> bool:
    headers: dict[str, str] = {}

    cookies = {
        cookie_parts[0]: cookie_parts[1]
        for cookie_str in request["headers"]["cookie"].split("; ")
        if (cookie_parts := cookie_str.split("="))
    }

    if "authorization" not in request["headers"] and "token" not in cookies:
        print("No authorization header or token cookie")
        return False

    if "authorization" in request["headers"]:
        headers["authorization"] = request["headers"]["authorization"]
    else:
        headers["authorization"] = f"Bearer {cookies['token']}"

    headers["requested-url"] = uri

    response = requests.get(url="http://backend:8000/api/v1/auth", headers=headers)

    return 200 <= response.status_code < 300

    return 200 <= response.status < 300


orthanc.RegisterIncomingHttpRequestFilter(incoming_request_filter)  # type: ignore
