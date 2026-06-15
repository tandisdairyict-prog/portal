from django.urls import path
from . import views

app_name = 'organization'

urlpatterns = [
    path('chart/', views.OrgChartView.as_view(), name='chart'),
    path('companies/', views.CompanyListView.as_view(), name='company-list'),
    path('companies/add/', views.CompanyCreateView.as_view(), name='company-create'),
    path('companies/<int:pk>/edit/', views.CompanyUpdateView.as_view(), name='company-update'),
    path('companies/<int:pk>/change/', views.CompanyUpdateView.as_view(), name='company-edit'),
    path('departments/', views.DepartmentListView.as_view(), name='department-list'),
    path('departments/add/', views.DepartmentCreateView.as_view(), name='department-create'),
    path('positions/', views.PositionListView.as_view(), name='position-list'),
    path('positions/add/', views.PositionCreateView.as_view(), name='position-create'),
    path('employees/', views.EmployeeListView.as_view(), name='employee-list'),
    path('employees/add/', views.EmployeeCreateView.as_view(), name='employee-create'),
    path('employees/<int:pk>/', views.EmployeeDetailView.as_view(), name='employee-detail'),
    path('employees/<int:pk>/edit/', views.EmployeeUpdateView.as_view(), name='employee-update'),
    path('employees/<int:pk>/change/', views.EmployeeUpdateView.as_view(), name='employee-edit'),
]
