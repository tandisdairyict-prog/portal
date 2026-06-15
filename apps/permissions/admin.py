from django.contrib import admin
from .models import AppRole, EmployeeAppPermission, DepartmentAppPermission

admin.site.register(AppRole)
admin.site.register(EmployeeAppPermission)
admin.site.register(DepartmentAppPermission)
