# Generated by Django 3.0.5 on 2020-04-04 02:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mellonsforsale', '0007_auto_20200403_0251'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='item',
            options={'ordering': ('name',)},
        ),
    ]
