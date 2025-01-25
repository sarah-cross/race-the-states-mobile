# Generated by Django 5.1.5 on 2025-01-23 20:58

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('abbreviation', models.CharField(max_length=2)),
                ('region', models.CharField(max_length=100)),
                ('subregion', models.CharField(blank=True, max_length=100, null=True)),
                ('svg_file', models.FileField(blank=True, null=True, upload_to='svgs/')),
            ],
        ),
        migrations.CreateModel(
            name='Race',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('date', models.DateField()),
                ('time', models.DurationField()),
                ('city', models.CharField(blank=True, max_length=100, null=True)),
                ('distance', models.CharField(blank=True, choices=[('5k', '5k'), ('10k', '10k'), ('half marathon', 'Half Marathon'), ('marathon', 'Marathon')], default='half marathon', max_length=20, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='race_images/')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('state', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='races.state')),
            ],
        ),
        migrations.CreateModel(
            name='RaceImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='race_images/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('race', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='races.race')),
            ],
        ),
    ]
