import json
from django.core.management.base import BaseCommand
from races.models import State

class Command(BaseCommand):
    help = "Populate state SVG paths in the database"

    def handle(self, *args, **kwargs):
        # Path to the JSON file with SVG paths
        svg_file_path = "races/static/us_states_svg.json"

        try:
            with open(svg_file_path, "r") as file:
                svg_data = json.load(file)  # Load JSON as dictionary

            updated_count = 0

            for state_name, svg_path in svg_data.items():  # ✅ Loop through dictionary
                state = State.objects.filter(name=state_name).first()
                if state:
                    state.svg_path = svg_path  # ✅ Update svg_path
                    state.save()
                    updated_count += 1
                    self.stdout.write(self.style.SUCCESS(f"Updated {state_name}"))

            self.stdout.write(self.style.SUCCESS(f"✅ Successfully updated {updated_count} states with SVG paths."))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("❌ SVG JSON file not found!"))
        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR("❌ Error decoding JSON file."))

