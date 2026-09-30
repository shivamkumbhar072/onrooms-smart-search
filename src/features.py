from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

CATEGORICAL = ["area", "gender", "occupancy"]
NUMERIC = ["distance_to_college_km", "wifi", "food", "laundry", "ac",
           "parking", "power_backup", "attached_bath"]
TARGET = "price"


def build_preprocessor() -> ColumnTransformer:
    """One-hot encode text columns (models need numbers); pass numerics through.
    handle_unknown='ignore' means an unseen area at prediction time won't crash."""
    return ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        ("num", "passthrough", NUMERIC),
    ])
