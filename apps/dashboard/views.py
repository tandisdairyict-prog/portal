from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import IntegratedApp


class DashboardHomeView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/home.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        user = self.request.user
        if user.is_staff or user.is_superuser:
            apps = IntegratedApp.objects.filter(is_active=True)
        else:
            try:
                from apps.permissions.models import EmployeeAppPermission, DepartmentAppPermission
                employee = user.employee
                app_ids = set()
                emp_perms = EmployeeAppPermission.objects.filter(
                    employee=employee, is_active=True
                ).values_list('app_id', flat=True)
                app_ids.update(emp_perms)
                if employee.department:
                    dept_perms = DepartmentAppPermission.objects.filter(
                        department=employee.department, is_active=True
                    ).values_list('app_id', flat=True)
                    app_ids.update(dept_perms)
                apps = IntegratedApp.objects.filter(is_active=True, id__in=app_ids)
            except Exception:
                apps = IntegratedApp.objects.none()
        ctx['apps'] = apps
        return ctx
