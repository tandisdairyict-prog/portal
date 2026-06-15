from django.db import models


class ADConfig(models.Model):
    enabled = models.BooleanField(default=False, verbose_name='فعال')
    server_uri = models.CharField(max_length=200, default='ldap://localhost', verbose_name='آدرس سرور')
    bind_dn = models.CharField(max_length=200, blank=True, verbose_name='Bind DN')
    bind_password = models.CharField(max_length=200, blank=True, verbose_name='رمز Bind')
    user_search_base = models.CharField(max_length=200, blank=True, verbose_name='پایه جستجوی کاربران')
    user_search_filter = models.CharField(max_length=200, default='(sAMAccountName=%(user)s)', verbose_name='فیلتر جستجو')
    group_search_base = models.CharField(max_length=200, blank=True, verbose_name='پایه جستجوی گروه‌ها')
    require_group = models.CharField(max_length=200, blank=True, verbose_name='گروه اجباری')
    use_tls = models.BooleanField(default=False, verbose_name='استفاده از TLS')
    timeout = models.IntegerField(default=5, verbose_name='تایم‌اوت (ثانیه)')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخرین بروزرسانی')

    class Meta:
        db_table = 'settings_ad_config'
        verbose_name = 'تنظیمات AD'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def __str__(self):
        return 'تنظیمات اکتیو دایرکتوری'


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default='پورتال سازمانی', verbose_name='نام سایت')
    logo = models.ImageField(upload_to='site/', blank=True, null=True, verbose_name='لوگو')
    primary_color = models.CharField(max_length=7, default='#0d6efd', verbose_name='رنگ اصلی')
    allow_local_login = models.BooleanField(default=True, verbose_name='اجازه ورود محلی')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخرین بروزرسانی')

    class Meta:
        db_table = 'settings_site'
        verbose_name = 'تنظیمات سایت'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.site_name
