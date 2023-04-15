# Generated by Django 4.0.8 on 2023-04-15 09:29

import core.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Directory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subdirectories', to='core.directory')),
            ],
        ),
        migrations.CreateModel(
            name='Other',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('path', models.FileField(upload_to=core.models.File.get_upload_path)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('directory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.directory')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('path', models.FileField(upload_to=core.models.File.get_upload_path)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('directory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.directory')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('path', models.FileField(upload_to=core.models.File.get_upload_path)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('directory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.directory')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]