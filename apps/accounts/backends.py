import logging
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()


def get_ad_config():
    try:
        from apps.settings_panel.utils import get_ad_config as _get
        return _get()
    except Exception:
        return None


class LDAPWithFallbackBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if not username or not password:
            return None

        # Try AD authentication first
        ad_config = get_ad_config()
        if ad_config and ad_config.enabled:
            user = self._try_ldap_auth(username, password, ad_config)
            if user:
                return user

        # Local fallback
        return self._try_local_fallback(username, password)

    def _try_ldap_auth(self, username, password, ad_config):
        try:
            from ldap3 import Server, Connection, ALL, SIMPLE
            server = Server(ad_config.server_uri, get_info=ALL, connect_timeout=ad_config.timeout)
            conn = Connection(
                server,
                user=f"{username}",
                password=password,
                authentication=SIMPLE,
                auto_bind=True
            )
            if conn.bound:
                user, created = User.objects.get_or_create(username=username)
                user.is_ad_user = True
                from django.utils import timezone
                user.last_ad_sync = timezone.now()
                if not user.has_usable_password():
                    user.set_unusable_password()
                user.save()
                return user
        except Exception as e:
            logger.warning(f"LDAP auth failed for {username}: {e}")
        return None

    def _try_local_fallback(self, username, password):
        try:
            user = User.objects.get(username=username)
            # Check password == personnel_number OR password == national_id
            if (user.personnel_number and password == user.personnel_number) or \
               (user.national_id and password == user.national_id):
                return user
            # Also try regular password check
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            pass
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
