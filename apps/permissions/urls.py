from django.urls import path
from . import views

app_name = 'permissions'

urlpatterns = [
    path('', views.PermissionsDashboardView.as_view(), name='dashboard'),
    path('employee/<int:pk>/', views.EmployeePermissionView.as_view(), name='employee-perms'),
    path('employee/<int:pk>/grant/', views.GrantPermissionView.as_view(), name='grant'),
    path('revoke/<int:pk>/', views.RevokePermissionView.as_view(), name='revoke'),
    path('department/<int:pk>/', views.DepartmentPermissionView.as_view(), name='department-perms'),
]
