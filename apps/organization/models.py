from django.db import models
from django.conf import settings


class Company(models.Model):
    name = models.CharField(max_length=200, verbose_name='نام شرکت')
    short_name = models.CharField(max_length=50, verbose_name='نام کوتاه')
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True, verbose_name='لوگو')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')

    class Meta:
        db_table = 'org_company'
        verbose_name = 'شرکت'
        verbose_name_plural = 'شرکت‌ها'

    def __str__(self):
        return self.name


class Department(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='departments', verbose_name='شرکت')
    parent = models.ForeignKey(
        'self', on_delete=models.SET_NULL, blank=True, null=True,
        related_name='children', verbose_name='دپارتمان والد'
    )
    name = models.CharField(max_length=200, verbose_name='نام دپارتمان')
    code = models.CharField(max_length=20, blank=True, verbose_name='کد')
    manager = models.ForeignKey(
        'Employee', on_delete=models.SET_NULL, blank=True, null=True,
        related_name='managed_departments', verbose_name='مدیر'
    )
    is_active = models.BooleanField(default=True, verbose_name='فعال')

    class Meta:
        db_table = 'org_department'
        verbose_name = 'دپارتمان'
        verbose_name_plural = 'دپارتمان‌ها'

    def __str__(self):
        return self.name


class Position(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='positions', verbose_name='دپارتمان')
    title = models.CharField(max_length=200, verbose_name='عنوان پست')
    code = models.CharField(max_length=20, blank=True, verbose_name='کد')
    level = models.IntegerField(default=1, verbose_name='سطح')
    is_active = models.BooleanField(default=True, verbose_name='فعال')

    class Meta:
        db_table = 'org_position'
        verbose_name = 'پست سازمانی'
        verbose_name_plural = 'پست‌های سازمانی'

    def __str__(self):
        return self.title


class Employee(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='employee', verbose_name='کاربر'
    )
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='employees', verbose_name='شرکت')
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='employees', verbose_name='دپارتمان'
    )
    position = models.ForeignKey(
        Position, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='employees', verbose_name='پست سازمانی'
    )
    personnel_number = models.CharField(max_length=20, unique=True, verbose_name='شماره پرسنلی')
    national_id = models.CharField(max_length=10, verbose_name='کد ملی')
    hire_date = models.DateField(verbose_name='تاریخ استخدام')
    phone = models.CharField(max_length=20, blank=True, verbose_name='تلفن')
    is_active = models.BooleanField(default=True, verbose_name='فعال')

    class Meta:
        db_table = 'org_employee'
        verbose_name = 'کارمند'
        verbose_name_plural = 'کارمندان'

    def __str__(self):
        return str(self.user)
