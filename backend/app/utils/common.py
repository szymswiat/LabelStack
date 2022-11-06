from typing import Dict, List, Tuple, TypeVar


T = TypeVar("T")


def build_grouped_dict(items: List[Tuple[str, T]]) -> Dict[str, List[T]]:

    out_dict: Dict[str, List[T]] = {}

    for key, item in items:
        if key not in out_dict:
            out_dict[key] = []
        out_dict[key].append(item)

    return out_dict
