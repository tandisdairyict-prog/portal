from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from .models import ADConfig, SiteSettings


class ADConfigForm(forms.ModelForm):
    class Meta:
        model = ADConfig
        fields = [
            'enabled', 'server_uri', 'bind_dn', 'bind_password',
            'user_search_base', 'user_search_filter', 'group_search_base',
            'require_group', 'use_tls', 'timeout'
        ]
        widgets = {
            'bind_password': forms.PasswordInput(render_value=True),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.add_input(Submit('submit', 'ذخیره', css_class='btn btn-primary'))


class SiteSettingsForm(forms.ModelForm):
    class Meta:
        model = SiteSettings
        fields = ['site_name', 'logo', 'primary_color', 'allow_local_login']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.add_input(Submit('submit', 'ذخیره', css_class='btn btn-primary'))
