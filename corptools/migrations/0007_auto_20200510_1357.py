# Generated by Django 2.2.9 on 2020-05-10 13:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('corptools', '0006_invtypematerials_type_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='skillqueue',
            name='skill_name',
            field=models.ForeignKey(
                default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='corptools.EveItemType'),
        ),
    ]
