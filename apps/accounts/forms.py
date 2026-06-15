from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Field


class LoginForm(forms.Form):
    username = forms.CharField(
        label='نام کاربری',
        max_length=150,
        widget=forms.TextInput(attrs={'placeholder': 'نام کاربری', 'autofocus': True, 'class': 'form-control'})
    )
    password = forms.CharField(
        label='رمز عبور',
        widget=forms.PasswordInput(attrs={'placeholder': 'رمز عبور', 'class': 'form-control'})
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.layout = Layout(
            Field('username', css_class='mb-3'),
            Field('password', css_class='mb-3'),
            Submit('submit', 'ورود', css_class='btn btn-primary w-100'),
        )
