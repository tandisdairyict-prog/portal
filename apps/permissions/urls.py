from django.urls import path
from . import views

app_name = 'permissions'

urlpatterns = [
    path('employee/<int:pk>/', views.EmployeePermissionView.as_view(), name='employee-perms'),
    path('department/<int:pk>/', views.DepartmentPermissionView.as_view(), name='department-perms'),
]
