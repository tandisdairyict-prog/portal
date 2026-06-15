from django.contrib import admin
from .models import Company, Department, Position, Employee

admin.site.register(Company)
admin.site.register(Department)
admin.site.register(Position)
admin.site.register(Employee)
