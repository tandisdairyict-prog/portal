from .models import IntegratedApp


def user_apps(request):
    if not request.user.is_authenticated:
        return {'user_apps': []}
    user = request.user
    if user.is_staff or user.is_superuser:
        apps = list(IntegratedApp.objects.filter(is_active=True))
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
            apps = list(IntegratedApp.objects.filter(is_active=True, id__in=app_ids))
        except Exception:
            apps = []
    return {'user_apps': apps}
