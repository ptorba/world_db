from typing import Dict, Optional


def validate_city_params(params: Dict) -> Optional[Dict]:
    for name in ["name", "district", "population"]:
        if not params.get(name):
            return {name: "missing value"}
    try:
        population = int(params["population"])
    except ValueError:
        return {"population": "must be a number"}
    return None
