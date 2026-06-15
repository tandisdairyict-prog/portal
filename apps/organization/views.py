import json
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView, TemplateView
from django.urls import reverse_lazy
from .models import Company, Department, Position, Employee


class OrgChartView(LoginRequiredMixin, TemplateView):
    template_name = 'organization/chart.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        companies = Company.objects.filter(is_active=True).prefetch_related('departments')
        chart_data = []
        for company in companies:
            company_node = {
                'id': f'c_{company.id}',
                'name': company.name,
                'title': 'شرکت',
                'children': []
            }
            for dept in company.departments.filter(is_active=True, parent=None):
                company_node['children'].append(self._build_dept_node(dept))
            chart_data.append(company_node)
        ctx['chart_data'] = json.dumps(chart_data, ensure_ascii=False)
        ctx['companies'] = companies
        return ctx

    def _build_dept_node(self, dept):
        node = {'id': f'd_{dept.id}', 'name': dept.name, 'title': 'دپارتمان', 'children': []}
        for child in dept.children.filter(is_active=True):
            node['children'].append(self._build_dept_node(child))
        return node


class CompanyListView(LoginRequiredMixin, ListView):
    model = Company
    template_name = 'organization/company_list.html'
    context_object_name = 'companies'


class CompanyCreateView(LoginRequiredMixin, CreateView):
    model = Company
    fields = ['name', 'short_name', 'logo', 'is_active']
    template_name = 'organization/company_form.html'
    success_url = reverse_lazy('organization:company-list')


class CompanyUpdateView(LoginRequiredMixin, UpdateView):
    model = Company
    fields = ['name', 'short_name', 'logo', 'is_active']
    template_name = 'organization/company_form.html'
    success_url = reverse_lazy('organization:company-list')


class DepartmentListView(LoginRequiredMixin, ListView):
    model = Department
    template_name = 'organization/department_list.html'
    context_object_name = 'departments'


class DepartmentCreateView(LoginRequiredMixin, CreateView):
    model = Department
    fields = ['company', 'parent', 'name', 'code', 'is_active']
    template_name = 'organization/department_form.html'
    success_url = reverse_lazy('organization:department-list')


class PositionListView(LoginRequiredMixin, ListView):
    model = Position
    template_name = 'organization/position_list.html'
    context_object_name = 'positions'


class PositionCreateView(LoginRequiredMixin, CreateView):
    model = Position
    fields = ['department', 'title', 'code', 'level', 'is_active']
    template_name = 'organization/position_form.html'
    success_url = reverse_lazy('organization:position-list')


class EmployeeListView(LoginRequiredMixin, ListView):
    model = Employee
    template_name = 'organization/employee_list.html'
    context_object_name = 'employees'

    def get_queryset(self):
        qs = super().get_queryset().select_related('user', 'company', 'department', 'position')
        q = self.request.GET.get('q')
        if q:
            from django.db.models import Q
            qs = qs.filter(
                Q(user__first_name__icontains=q) |
                Q(user__last_name__icontains=q) |
                Q(personnel_number__icontains=q)
            )
        return qs


class EmployeeDetailView(LoginRequiredMixin, DetailView):
    model = Employee
    template_name = 'organization/employee_detail.html'
    context_object_name = 'employee'


class EmployeeCreateView(LoginRequiredMixin, CreateView):
    model = Employee
    fields = ['user', 'company', 'department', 'position', 'personnel_number', 'national_id', 'hire_date', 'phone', 'is_active']
    template_name = 'organization/employee_form.html'
    success_url = reverse_lazy('organization:employee-list')


class EmployeeUpdateView(LoginRequiredMixin, UpdateView):
    model = Employee
    fields = ['company', 'department', 'position', 'personnel_number', 'national_id', 'hire_date', 'phone', 'is_active']
    template_name = 'organization/employee_form.html'
    success_url = reverse_lazy('organization:employee-list')
