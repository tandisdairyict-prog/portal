import logging
from django.core.cache import cache

logger = logging.getLogger(__name__)

AD_CONFIG_CACHE_KEY = 'ad_config'
AD_CONFIG_CACHE_TIMEOUT = 300  # 5 minutes


def get_ad_config():
    config = cache.get(AD_CONFIG_CACHE_KEY)
    if config is None:
        try:
            from .models import ADConfig
            config = ADConfig.objects.get(pk=1)
            cache.set(AD_CONFIG_CACHE_KEY, config, AD_CONFIG_CACHE_TIMEOUT)
        except Exception:
            return None
    return config


def invalidate_ad_config_cache():
    cache.delete(AD_CONFIG_CACHE_KEY)
