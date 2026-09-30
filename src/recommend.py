"""Content-based PG recommender using cosine similarity.

1. Hard filters: gender compatibility and a budget ceiling.
2. Similarity: cosine between the user's wanted features and each listing,
   computed only on the features the user actually asked for.
3. Final score blends similarity, budget fit and distance to college.
"""
import numpy as np
import pandas as pd

AMENITIES = ["wifi", "food", "laundry", "ac", "parking", "power_backup", "attached_bath"]


class Recommender:
    def __init__(self, listings: pd.DataFrame):
        self.df = listings.reset_index(drop=True)
        self.areas = sorted(self.df["area"].unique())
        self.occs = sorted(self.df["occupancy"].unique())

    def _encode_listings(self) -> np.ndarray:
        cols = [self.df[AMENITIES].to_numpy(float)]
        cols.append(np.stack([(self.df["area"] == a).to_numpy(float) for a in self.areas], 1))
        cols.append(np.stack([(self.df["occupancy"] == o).to_numpy(float) for o in self.occs], 1))
        return np.hstack(cols)

    def _encode_user(self, q: dict) -> np.ndarray:
        amen = [1.0 if a in (q.get("amenities") or []) else 0.0 for a in AMENITIES]
        area = [1.0 if q.get("area") == a else 0.0 for a in self.areas]
        occ = [1.0 if q.get("occupancy") == o else 0.0 for o in self.occs]
        return np.array(amen + area + occ)

    def recommend(self, q: dict, k: int = 5) -> list:
        df = self.df
        mask = pd.Series(True, index=df.index)
        if q.get("gender"):  # a Unisex PG suits anyone
            mask &= df["gender"].isin([q["gender"], "Unisex"])
        budget_max = q.get("budget_max")
        if budget_max:
            mask &= df["price"] <= budget_max * 1.15
        cand = df[mask]
        if cand.empty:
            return []

        L = self._encode_listings()[cand.index]
        u = self._encode_user(q)
        care = u > 0  # only compare on dimensions the user cares about
        if care.any():
            Lc, uc = L[:, care], u[care]
            denom = np.linalg.norm(Lc, axis=1) * np.linalg.norm(uc)
            sim = np.divide(Lc @ uc, denom, out=np.zeros(len(cand)), where=denom > 0)
        else:
            sim = np.ones(len(cand))

        price = cand["price"].to_numpy(float)
        bmin = q.get("budget_min") or 0
        if budget_max:
            over = np.clip((price - budget_max) / (0.25 * budget_max), 0, 1)
            budget_fit = np.where(price < bmin, 0.8, 1 - over)
        else:
            budget_fit = np.ones(len(cand))
        dist_fit = 1 / (1 + cand["distance_to_college_km"].to_numpy(float))

        score = 0.60 * sim + 0.25 * budget_fit + 0.15 * dist_fit
        out = cand.assign(match=(score * 100).round(1)).sort_values("match", ascending=False).head(k)
        return out[["id", "title", "area", "gender", "occupancy", "price", "match"]].to_dict("records")
