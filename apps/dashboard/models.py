from django.db import models


class IntegratedApp(models.Model):
    APP_TYPE_CHOICES = [
        ('bi', 'هوش تجاری'),
        ('bpm', 'مدیریت فرآیند'),
        ('attendance', 'حضور و غیاب'),
        ('hr', 'منابع انسانی'),
        ('other', 'سایر'),
    ]
    name = models.CharField(max_length=100, verbose_name='نام')
    slug = models.SlugField(unique=True, verbose_name='شناسه')
    app_type = models.CharField(max_length=20, choices=APP_TYPE_CHOICES, verbose_name='نوع')
    url = models.URLField(verbose_name='آدرس')
    icon_class = models.CharField(max_length=50, default='bi-app', verbose_name='کلاس آیکون')
    description = models.TextField(blank=True, verbose_name='توضیحات')
    open_in_new_tab = models.BooleanField(default=True, verbose_name='باز کردن در تب جدید')
    order = models.IntegerField(default=0, verbose_name='ترتیب')
    is_active = models.BooleanField(default=True, verbose_name='فعال')

    class Meta:
        db_table = 'dashboard_app'
        ordering = ['order', 'name']
        verbose_name = 'اپلیکیشن'
        verbose_name_plural = 'اپلیکیشن‌ها'

    def __str__(self):
        return self.name
