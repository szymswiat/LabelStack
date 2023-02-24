from typing import Any

from fastapi import HTTPException, status


def allow_use_one_of(options: dict[str, Any], enforce_one_option: bool = False) -> None:
    count_not_none = 0
    for v in options.values():
        if v is not None:
            count_not_none += 1

    if count_not_none == 0 and enforce_one_option:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You have to use at least one of following options {options.keys()}",
        )
    if count_not_none > 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only one of following options {options.keys()} can be used simultaneously.",
        )
