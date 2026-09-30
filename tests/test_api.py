from fastapi.testclient import TestClient
from api.main import app

c = TestClient(app)


def test_endpoints():
    assert c.get("/health").json() == {"status": "ok"}
    r = c.post("/predict-price", json={"area": "Pimpri", "gender": "Male", "occupancy": "Double",
                                       "wifi": 1, "food": 1, "laundry": 1})
    assert 3000 < r.json()["predicted_monthly_rent"] < 20000
    r = c.post("/search", json={"query": "boys PG near Pimpri under 9000 with food and wifi"})
    assert r.status_code == 200 and r.json()["results"]
