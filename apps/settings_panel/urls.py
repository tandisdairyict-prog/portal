from django.urls import path
from . import views

app_name = 'settings_panel'

urlpatterns = [
    path('ad/', views.ADConfigView.as_view(), name='ad-config'),
    path('general/', views.SiteSettingsView.as_view(), name='general'),
    path('test-ad/', views.TestADConnectionView.as_view(), name='test-ad'),
]
