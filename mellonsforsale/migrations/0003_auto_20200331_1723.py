# Generated by Django 3.0.2 on 2020-03-31 21:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mellonsforsale', '0002_auto_20200328_1758'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='seller',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='seller', to='mellonsforsale.Profile'),
        ),
    ]