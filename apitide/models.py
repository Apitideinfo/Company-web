from django.db import models

# Create your models here.

class contactCard(models.Model):

    name = models.TextField(max_length=200)
    email = models.EmailField()
    message = models.TextField()

    def __str__(self):
        return self.name