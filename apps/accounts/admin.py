from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'personnel_number', 'is_ad_user', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('اطلاعات پرسنلی', {'fields': ('personnel_number', 'national_id', 'is_ad_user', 'avatar', 'last_ad_sync')}),
    )
