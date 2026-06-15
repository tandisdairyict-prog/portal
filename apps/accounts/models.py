from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    personnel_number = models.CharField(max_length=20, blank=True, null=True, verbose_name='شماره پرسنلی')
    national_id = models.CharField(max_length=10, blank=True, null=True, verbose_name='کد ملی')
    is_ad_user = models.BooleanField(default=False, verbose_name='کاربر اکتیو دایرکتوری')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name='تصویر پروفایل')
    last_ad_sync = models.DateTimeField(blank=True, null=True, verbose_name='آخرین همگام‌سازی AD')

    class Meta:
        db_table = 'accounts_user'
        verbose_name = 'کاربر'
        verbose_name_plural = 'کاربران'

    def __str__(self):
        return self.get_full_name() or self.username
