from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from django.contrib import messages
from apps.organization.models import Employee, Department
from apps.dashboard.models import IntegratedApp
from .models import EmployeeAppPermission, DepartmentAppPermission, AppRole


class EmployeePermissionView(LoginRequiredMixin, TemplateView):
    template_name = 'permissions/employee_perms.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        employee = get_object_or_404(Employee, pk=self.kwargs['pk'])
        ctx['employee'] = employee
        ctx['permissions'] = EmployeeAppPermission.objects.filter(employee=employee).select_related('app', 'role', 'granted_by')
        ctx['apps'] = IntegratedApp.objects.filter(is_active=True)
        ctx['roles'] = AppRole.objects.all()
        return ctx

    def post(self, request, *args, **kwargs):
        employee = get_object_or_404(Employee, pk=kwargs['pk'])
        action = request.POST.get('action')
        if action == 'add':
            app_id = request.POST.get('app')
            role_id = request.POST.get('role')
            if app_id and role_id:
                EmployeeAppPermission.objects.get_or_create(
                    employee=employee,
                    app_id=app_id,
                    role_id=role_id,
                    defaults={'granted_by': request.user}
                )
                messages.success(request, 'دسترسی اضافه شد.')
        elif action == 'remove':
            perm_id = request.POST.get('perm_id')
            EmployeeAppPermission.objects.filter(pk=perm_id).delete()
            messages.success(request, 'دسترسی حذف شد.')
        return redirect('permissions:employee-perms', pk=employee.pk)


class DepartmentPermissionView(LoginRequiredMixin, TemplateView):
    template_name = 'permissions/department_perms.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        department = get_object_or_404(Department, pk=self.kwargs['pk'])
        ctx['department'] = department
        ctx['permissions'] = DepartmentAppPermission.objects.filter(department=department).select_related('app', 'role')
        ctx['apps'] = IntegratedApp.objects.filter(is_active=True)
        ctx['roles'] = AppRole.objects.all()
        return ctx

    def post(self, request, *args, **kwargs):
        department = get_object_or_404(Department, pk=kwargs['pk'])
        action = request.POST.get('action')
        if action == 'add':
            app_id = request.POST.get('app')
            role_id = request.POST.get('role')
            if app_id and role_id:
                DepartmentAppPermission.objects.get_or_create(
                    department=department,
                    app_id=app_id,
                    role_id=role_id,
                )
                messages.success(request, 'دسترسی اضافه شد.')
        elif action == 'remove':
            perm_id = request.POST.get('perm_id')
            DepartmentAppPermission.objects.filter(pk=perm_id).delete()
            messages.success(request, 'دسترسی حذف شد.')
        return redirect('permissions:department-perms', pk=department.pk)
