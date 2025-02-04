import os
import django
import json

# ✅ Set up Django environment (adjust if needed)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from races.models import State

# ✅ Define region colors
region_colors = {
    "West": "#95FF00",
    "Midwest": "#EBFC00",
    "South": "#FF63FA",
    "Northeast": "#01C7FE",
}

# ✅ Define all 50 U.S. states with their abbreviations and regions
states_data = [
    {"name": "Alabama", "abbreviation": "AL", "region": "South"},
    {"name": "Alaska", "abbreviation": "AK", "region": "West"},
    {"name": "Arizona", "abbreviation": "AZ", "region": "West"},
    {"name": "Arkansas", "abbreviation": "AR", "region": "South"},
    {"name": "California", "abbreviation": "CA", "region": "West"},
    {"name": "Colorado", "abbreviation": "CO", "region": "West"},
    {"name": "Connecticut", "abbreviation": "CT", "region": "Northeast"},
    {"name": "Delaware", "abbreviation": "DE", "region": "Northeast"},
    {"name": "Florida", "abbreviation": "FL", "region": "South"},
    {"name": "Georgia", "abbreviation": "GA", "region": "South"},
    {"name": "Hawaii", "abbreviation": "HI", "region": "West"},
    {"name": "Idaho", "abbreviation": "ID", "region": "West"},
    {"name": "Illinois", "abbreviation": "IL", "region": "Midwest"},
    {"name": "Indiana", "abbreviation": "IN", "region": "Midwest"},
    {"name": "Iowa", "abbreviation": "IA", "region": "Midwest"},
    {"name": "Kansas", "abbreviation": "KS", "region": "Midwest"},
    {"name": "Kentucky", "abbreviation": "KY", "region": "South"},
    {"name": "Louisiana", "abbreviation": "LA", "region": "South"},
    {"name": "Maine", "abbreviation": "ME", "region": "Northeast"},
    {"name": "Maryland", "abbreviation": "MD", "region": "Northeast"},
    {"name": "Massachusetts", "abbreviation": "MA", "region": "Northeast"},
    {"name": "Michigan", "abbreviation": "MI", "region": "Midwest"},
    {"name": "Minnesota", "abbreviation": "MN", "region": "Midwest"},
    {"name": "Mississippi", "abbreviation": "MS", "region": "South"},
    {"name": "Missouri", "abbreviation": "MO", "region": "Midwest"},
    {"name": "Montana", "abbreviation": "MT", "region": "West"},
    {"name": "Nebraska", "abbreviation": "NE", "region": "Midwest"},
    {"name": "Nevada", "abbreviation": "NV", "region": "West"},
    {"name": "New Hampshire", "abbreviation": "NH", "region": "Northeast"},
    {"name": "New Jersey", "abbreviation": "NJ", "region": "Northeast"},
    {"name": "New Mexico", "abbreviation": "NM", "region": "West"},
    {"name": "New York", "abbreviation": "NY", "region": "Northeast"},
    {"name": "North Carolina", "abbreviation": "NC", "region": "South"},
    {"name": "North Dakota", "abbreviation": "ND", "region": "Midwest"},
    {"name": "Ohio", "abbreviation": "OH", "region": "Midwest"},
    {"name": "Oklahoma", "abbreviation": "OK", "region": "South"},
    {"name": "Oregon", "abbreviation": "OR", "region": "West"},
    {"name": "Pennsylvania", "abbreviation": "PA", "region": "Northeast"},
    {"name": "Rhode Island", "abbreviation": "RI", "region": "Northeast"},
    {"name": "South Carolina", "abbreviation": "SC", "region": "South"},
    {"name": "South Dakota", "abbreviation": "SD", "region": "Midwest"},
    {"name": "Tennessee", "abbreviation": "TN", "region": "South"},
    {"name": "Texas", "abbreviation": "TX", "region": "South"},
    {"name": "Utah", "abbreviation": "UT", "region": "West"},
    {"name": "Vermont", "abbreviation": "VT", "region": "Northeast"},
    {"name": "Virginia", "abbreviation": "VA", "region": "South"},
    {"name": "Washington", "abbreviation": "WA", "region": "West"},
    {"name": "West Virginia", "abbreviation": "WV", "region": "South"},
    {"name": "Wisconsin", "abbreviation": "WI", "region": "Midwest"},
    {"name": "Wyoming", "abbreviation": "WY", "region": "West"},
]


# ✅ Load SVG Paths from JSON file
json_file_path = os.path.join(os.path.dirname(__file__), "us_states_svg.json")

with open(json_file_path, "r") as f:
    svg_paths = json.load(f)

# ✅ Populate the Database
for state in states_data:
    state_obj, created = State.objects.update_or_create(
        abbreviation=state["abbreviation"],
        defaults={
            "name": state["name"],
            "region": state["region"],
            "region_color": region_colors.get(state["region"], "#FFFFFF"),
            "svg_path": svg_paths.get(state["name"], ""),
        }
    )

    print(f"{'Created' if created else 'Updated'}: {state_obj.name}")

print("✅ All states populated successfully!")
