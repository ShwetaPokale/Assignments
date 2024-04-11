# myapp/models.py

from django.db import models

class users(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.username
