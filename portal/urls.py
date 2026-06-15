from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.dashboard.urls', namespace='dashboard')),
    path('accounts/', include('apps.accounts.urls', namespace='accounts')),
    path('organization/', include('apps.organization.urls', namespace='organization')),
    path('permissions/', include('apps.permissions.urls', namespace='permissions')),
    path('settings/', include('apps.settings_panel.urls', namespace='settings_panel')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
