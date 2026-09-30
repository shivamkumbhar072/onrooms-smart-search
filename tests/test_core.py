from src.generate_data import generate
from src.recommend import Recommender
from src.search_parser import parse_query


def test_parser():
    q = parse_query("Find me a boys PG near Pimpri under ₹9,000 with food and WiFi")
    assert q["gender"] == "Male" and q["area"] == "Pimpri"
    assert q["budget_max"] == 9000 and set(q["amenities"]) == {"food", "wifi"}


def test_parser_range():
    q = parse_query("girls pg hinjawadi between 8k and 10k double sharing with AC")
    assert (q["budget_min"], q["budget_max"]) == (8000, 10000)
    assert q["gender"] == "Female" and q["occupancy"] == "Double" and "ac" in q["amenities"]


def test_recommender_respects_filters():
    df = generate(300)
    res = Recommender(df).recommend({"gender": "Female", "budget_max": 9000, "amenities": ["wifi"]}, k=5)
    assert res and all(r["gender"] in ("Female", "Unisex") for r in res)
    assert all(r["price"] <= 9000 * 1.15 for r in res)
