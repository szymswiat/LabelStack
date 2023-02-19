from typing import TypeVar


T = TypeVar("T")


def build_grouped_dict(items: list[tuple[str, T]]) -> dict[str, list[T]]:

    out_dict: dict[str, list[T]] = {}

    for key, item in items:
        if key not in out_dict:
            out_dict[key] = []
        out_dict[key].append(item)

    return out_dict
