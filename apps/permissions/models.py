from django.db import models
from django.conf import settings
from apps.dashboard.models import IntegratedApp
from apps.organization.models import Employee, Department


class AppRole(models.Model):
    app = models.ForeignKey(IntegratedApp, on_delete=models.CASCADE, related_name='roles', verbose_name='اپلیکیشن')
    name = models.CharField(max_length=100, verbose_name='نام نقش')
    description = models.TextField(blank=True, verbose_name='توضیحات')

    class Meta:
        db_table = 'perm_app_role'
        verbose_name = 'نقش'
        verbose_name_plural = 'نقش‌ها'

    def __str__(self):
        return f"{self.app} - {self.name}"


class EmployeeAppPermission(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='app_permissions', verbose_name='کارمند')
    app = models.ForeignKey(IntegratedApp, on_delete=models.CASCADE, related_name='employee_permissions', verbose_name='اپلیکیشن')
    role = models.ForeignKey(AppRole, on_delete=models.CASCADE, verbose_name='نقش')
    granted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, verbose_name='اعطا شده توسط'
    )
    granted_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ اعطا')
    is_active = models.BooleanField(default=True, verbose_name='فعال')

    class Meta:
        db_table = 'perm_employee_app'
        unique_together = ('employee', 'app', 'role')
        verbose_name = 'دسترسی کارمند'
        verbose_name_plural = 'دسترسی‌های کارمندان'


class DepartmentAppPermission(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='app_permissions', verbose_name='دپارتمان')
    app = models.ForeignKey(IntegratedApp, on_delete=models.CASCADE, related_name='department_permissions', verbose_name='اپلیکیشن')
    role = models.ForeignKey(AppRole, on_delete=models.CASCADE, verbose_name='نقش')
    is_active = models.BooleanField(default=True, verbose_name='فعال')

    class Meta:
        db_table = 'perm_department_app'
        unique_together = ('department', 'app', 'role')
        verbose_name = 'دسترسی دپارتمان'
        verbose_name_plural = 'دسترسی‌های دپارتمان‌ها'
