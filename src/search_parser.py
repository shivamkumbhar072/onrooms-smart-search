"""
Convert natural-language OnRooms queries into structured filters.

Examples supported:

    PG in 2000
    PG under 8000
    PG below ₹9000
    PG between 7000 and 10000
    Boys PG in Pimpri
    Girls PG near Wakad
    Single room with WiFi
    Double sharing with food
    Triple sharing under 9000
    PG with AC and parking
    PG with food, WiFi and laundry
    PG near Hinjewadi under 10000
    Female PG in Kothrud with attached bathroom

This is a rule-based parser.
"""

import re
from typing import Optional


# --------------------------------------------------
# Areas
# --------------------------------------------------

AREA_ALIASES = {
    "pimpri": "Pimpri",
    "pimpri chinchwad": "Pimpri",
    "pcmc": "Pimpri",

    "chinchwad": "Chinchwad",

    "akurdi": "Akurdi",

    "wakad": "Wakad",

    "hinjewadi": "Hinjewadi",
    "hinjawadi": "Hinjewadi",
    "hinje wadi": "Hinjewadi",

    "kothrud": "Kothrud",

    "viman nagar": "Viman Nagar",
    "vimannagar": "Viman Nagar",

    "hadapsar": "Hadapsar",
}


# --------------------------------------------------
# Gender
# --------------------------------------------------

GENDER_PATTERNS = {
    "Female": [
        r"\bgirls?\b",
        r"\bfemale\b",
        r"\bwomen\b",
        r"\bwomens\b",
        r"\bladies\b",
        r"\bladies'\b",
    ],

    "Male": [
        r"\bboys?\b",
        r"\bmale\b",
        r"\bmen\b",
        r"\bmens\b",
        r"\bgents?\b",
    ],
}


# --------------------------------------------------
# Occupancy
# --------------------------------------------------

OCCUPANCY_PATTERNS = {
    "Single": [
        r"\bsingle\b",
        r"\b1\s*sharing\b",
        r"\bone\s*sharing\b",
        r"\bsingle\s*room\b",
        r"\bprivate\s*room\b",
    ],

    "Double": [
        r"\bdouble\b",
        r"\b2\s*sharing\b",
        r"\btwo\s*sharing\b",
        r"\bdouble\s*sharing\b",
        r"\btwin\s*sharing\b",
    ],

    "Triple": [
        r"\btriple\b",
        r"\b3\s*sharing\b",
        r"\bthree\s*sharing\b",
        r"\btriple\s*sharing\b",
    ],
}


# --------------------------------------------------
# Amenities
# --------------------------------------------------

AMENITY_PATTERNS = {

    "wifi": [
        r"\bwi[\s-]?fi\b",
        r"\bwifi\b",
        r"\binternet\b",
        r"\bwireless\b",
    ],

    "food": [
        r"\bfood\b",
        r"\bmeal\b",
        r"\bmeals\b",
        r"\bmess\b",
        r"\btiffin\b",
        r"\bbreakfast\b",
        r"\blunch\b",
        r"\bdinner\b",
    ],

    "laundry": [
        r"\blaundry\b",
        r"\bwashing\b",
        r"\bwashing\s*machine\b",
        r"\bwasher\b",
    ],

    "ac": [
        r"\bac\b",
        r"\ba/c\b",
        r"\bair\s*condition(?:er|ing)?\b",
        r"\bairconditioned\b",
    ],

    "parking": [
        r"\bparking\b",
        r"\bcar\s*parking\b",
        r"\bbike\s*parking\b",
        r"\btwo\s*wheeler\s*parking\b",
    ],

    "power_backup": [
        r"\bpower\s*backup\b",
        r"\binverter\b",
        r"\bbackup\b",
        r"\bgenerator\b",
        r"\bgenerator\s*backup\b",
    ],

    "attached_bath": [
        r"\battached\s*bath(?:room)?\b",
        r"\battached\s*washroom\b",
        r"\bprivate\s*bath(?:room)?\b",
        r"\bprivate\s*washroom\b",
        r"\bpersonal\s*bath(?:room)?\b",
    ],
}


# --------------------------------------------------
# Number parser
# --------------------------------------------------

NUMBER_PATTERN = r"(\d+(?:,\d{3})*(?:\.\d+)?)\s*(k|thousand|lac|lakh)?\b"


def _num(value: str, multiplier: Optional[str] = None) -> int:
    """
    Convert:
        8000       -> 8000
        8,000      -> 8000
        8k         -> 8000
        8 thousand -> 8000
        1 lakh     -> 100000
    """

    number = float(value.replace(",", ""))

    if multiplier:
        multiplier = multiplier.lower()

        if multiplier in {"k", "thousand"}:
            number *= 1000

        elif multiplier in {"lac", "lakh"}:
            number *= 100000

    return int(number)


# --------------------------------------------------
# Budget parsing
# --------------------------------------------------

def _parse_budget(text: str, query: dict) -> None:

    # ----------------------------------------------
    # Between
    # ----------------------------------------------

    pattern = (
        rf"\bbetween\s+{NUMBER_PATTERN}"
        rf"\s+(?:and|to|-)\s+{NUMBER_PATTERN}"
    )

    match = re.search(pattern, text)

    if match:
        query["budget_min"] = _num(
            match.group(1),
            match.group(2)
        )

        query["budget_max"] = _num(
            match.group(3),
            match.group(4)
        )

        return


    # ----------------------------------------------
    # Range: 7000-9000
    # ----------------------------------------------

    pattern = (
        rf"\b{NUMBER_PATTERN}\s*-\s*{NUMBER_PATTERN}"
    )

    match = re.search(pattern, text)

    if match:
        query["budget_min"] = _num(
            match.group(1),
            match.group(2)
        )

        query["budget_max"] = _num(
            match.group(3),
            match.group(4)
        )

        return


    # ----------------------------------------------
    # Under / below / less than
    # ----------------------------------------------

    pattern = (
        rf"(?:under|below|less\s+than|"
        rf"upto|up\s+to|max(?:imum)?|"
        rf"within|not\s+more\s+than|"
        rf"maximum\s+budget|budget\s+up\s+to)"
        rf"\s*(?:₹|rs\.?|inr)?\s*"
        rf"{NUMBER_PATTERN}"
    )

    match = re.search(pattern, text)

    if match:
        query["budget_max"] = _num(
            match.group(1),
            match.group(2)
        )

        return


    # ----------------------------------------------
    # "PG in 2000"
    # "PG for 2000"
    # "PG at 2000"
    # ----------------------------------------------

    pattern = (
        rf"\b(?:in|for|at|around)\s*"
        rf"(?:₹|rs\.?|inr)?\s*"
        rf"{NUMBER_PATTERN}"
    )

    match = re.search(pattern, text)

    if match:
        amount = _num(
            match.group(1),
            match.group(2)
        )

        # Treat "PG in 2000" as a maximum budget.
        query["budget_max"] = amount

        return


    # ----------------------------------------------
    # "budget 8000"
    # "budget of 8000"
    # "budget: 8000"
    # ----------------------------------------------

    pattern = (
        rf"\bbudget\s*(?:of|is|:)?\s*"
        rf"(?:₹|rs\.?|inr)?\s*"
        rf"{NUMBER_PATTERN}"
    )

    match = re.search(pattern, text)

    if match:
        query["budget_max"] = _num(
            match.group(1),
            match.group(2)
        )

        return


    # ----------------------------------------------
    # Direct ₹8000 / Rs 8000
    # ----------------------------------------------

    pattern = (
        rf"(?:₹|rs\.?|inr)\s*"
        rf"{NUMBER_PATTERN}"
    )

    match = re.search(pattern, text)

    if match:
        query["budget_max"] = _num(
            match.group(1),
            match.group(2)
        )


# --------------------------------------------------
# Gender parsing
# --------------------------------------------------

def _parse_gender(text: str, query: dict) -> None:

    for gender, patterns in GENDER_PATTERNS.items():

        for pattern in patterns:

            if re.search(pattern, text):
                query["gender"] = gender
                return


# --------------------------------------------------
# Area parsing
# --------------------------------------------------

def _parse_area(text: str, query: dict) -> None:

    # Check longer names first.
    aliases = sorted(
        AREA_ALIASES.items(),
        key=lambda x: len(x[0]),
        reverse=True
    )

    for alias, area in aliases:

        if re.search(
            rf"\b{re.escape(alias)}\b",
            text
        ):
            query["area"] = area
            return


# --------------------------------------------------
# Occupancy parsing
# --------------------------------------------------

def _parse_occupancy(text: str, query: dict) -> None:

    for occupancy, patterns in OCCUPANCY_PATTERNS.items():

        for pattern in patterns:

            if re.search(pattern, text):
                query["occupancy"] = occupancy
                return


# --------------------------------------------------
# Amenity parsing
# --------------------------------------------------

def _parse_amenities(text: str, query: dict) -> None:

    amenities = []

    for amenity, patterns in AMENITY_PATTERNS.items():

        for pattern in patterns:

            if re.search(pattern, text):

                if amenity not in amenities:
                    amenities.append(amenity)

                break

    query["amenities"] = amenities


# --------------------------------------------------
# Main parser
# --------------------------------------------------

def parse_query(text: str) -> dict:

    if not text:
        return {
            "amenities": []
        }


    # Normalize text.
    t = text.lower().strip()

    t = t.replace("₹", " ")
    t = t.replace("rs.", " ")
    t = t.replace("rs ", " ")
    t = t.replace("inr", " ")


    query = {
        "amenities": []
    }


    # Parse each category.
    _parse_budget(
        t,
        query
    )

    _parse_gender(
        t,
        query
    )

    _parse_area(
        t,
        query
    )

    _parse_occupancy(
        t,
        query
    )

    _parse_amenities(
        t,
        query
    )


    return query