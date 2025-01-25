from django.contrib import admin
from .models import State, Race, RaceImage

class RaceImageInline(admin.TabularInline):  # Use TabularInline for multiple images
    model = RaceImage
    extra = 1  # Number of extra blank fields to display for new images

@admin.register(Race)
class RaceAdmin(admin.ModelAdmin):
    inlines = [RaceImageInline]  
    list_display = ('name', 'state', 'distance', 'time')

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ('name', 'abbreviation', 'region', 'subregion')
