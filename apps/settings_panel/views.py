from django.shortcuts import render, redirect
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import View
from django.http import JsonResponse
from django.contrib import messages
from .forms import ADConfigForm, SiteSettingsForm
from .models import ADConfig, SiteSettings
from .utils import invalidate_ad_config_cache


class StaffRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_staff


class ADConfigView(StaffRequiredMixin, View):
    template_name = 'settings_panel/ad_config.html'

    def get(self, request, *args, **kwargs):
        config = ADConfig.objects.first()
        form = ADConfigForm(instance=config)
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        config = ADConfig.objects.first()
        form = ADConfigForm(request.POST, instance=config)
        if form.is_valid():
            form.save()
            invalidate_ad_config_cache()
            messages.success(request, 'تنظیمات AD ذخیره شد.')
            return redirect('settings_panel:ad-config')
        return render(request, self.template_name, {'form': form})


class SiteSettingsView(StaffRequiredMixin, View):
    template_name = 'settings_panel/general.html'

    def get(self, request, *args, **kwargs):
        config = SiteSettings.objects.first()
        form = SiteSettingsForm(instance=config)
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        config = SiteSettings.objects.first()
        form = SiteSettingsForm(request.POST, request.FILES, instance=config)
        if form.is_valid():
            form.save()
            messages.success(request, 'تنظیمات سایت ذخیره شد.')
            return redirect('settings_panel:general')
        return render(request, self.template_name, {'form': form})


class TestADConnectionView(StaffRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        config = ADConfig.objects.first()
        if not config:
            return JsonResponse({'success': False, 'message': 'تنظیمات AD یافت نشد.'})
        try:
            from ldap3 import Server, Connection, ALL
            server = Server(config.server_uri, get_info=ALL, connect_timeout=config.timeout)
            conn = Connection(
                server,
                user=config.bind_dn,
                password=config.bind_password,
                auto_bind=True
            )
            if conn.bound:
                return JsonResponse({'success': True, 'message': 'اتصال موفق بود.'})
            return JsonResponse({'success': False, 'message': 'اتصال برقرار نشد.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
