# coding=utf-8

__author__ = 'comyn'


class Config(object):
    APP_NAME = 'documentSrv'
    DEBUG = True
    SECRET_KEY = 'sddfdsjksdghkdsjfk'

    BABEL_DEFAULT_LOCALE = 'zh_CN'
    ACCEPT_LANGUAGES = ['en', 'zh']

    APPLICATION_ROOT = '/docsrv'

    STATIC_URL_PATH = "/docsrv/static"
    STATIC_FOLDER = "static"

    LOG_PATH = './logs'


class ProductionConfig(Config):
    DEBUG = False

    MONGO_URI = 'mongodb://192.168.111.102:27017/docsrv'

    LOG_LEVEL = 'INFO'

    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False

    SSO_URL = 'http://passport.op.lufax.com'
    SSO_APP_SECRET = "wprCxwm4sZk3EER5"
    SSO_APP_ID = 9
    SSO_ENABLE = True
    SSO_DOMAIN = 'sso.op.lufax.com'
    SECRET_KEY = "sfhhjkdhfkjshk"
    IS_TEST = False

    SSO_URL_NEW = 'http://sso.op.lufax.com/passport'
    SSO_APP_SECRET_NEW = 'ZhfEZBd64GJX6X5H'
    SSO_APP_ID_NEW = 9

    DA_LAYER_HOST = '192.168.111.114:5000'


class DevelopmentConfig(Config):
    DEBUG = True

    MONGO_URI = 'mongodb://127.0.0.1:27017/docsrv'

    LOG_LEVEL = 'DEBUG'

    DEBUG_TB_ENABLED = True
    DEBUG_TB_INTERCEPT_REDIRECTS = False

    SSO_URL = 'http://172.19.17.36:8002'
    SSO_APP_SECRET = 'RSkeCxjzwF8D467f'
    SSO_APP_ID = 8
    SSO_ENABLE = False
    SSO_DOMAIN = '172.19.17.36:8002'
    IS_TEST = True

    SSO_URL_NEW = 'http://172.19.49.200:8000/passport'
    SSO_APP_SECRET_NEW = 'ajPbTBMwnGx4e3if'
    SSO_APP_ID_NEW = 7

    LOCAL_USER = {
        u'status': 200, u'user': {u'mobile': u'', u'um': u'hanyong336', u'email': [u'superpig2046@aliyun.com'], u'name': u'\u97e9\u6e67'},
        u'groups': [u'firefly\u7ba1\u7406\u5458\u7ec4', u'firefly\u666e\u901a\u67e5\u8be2\u7ec4', u'firefly\u7cfb\u7edf\u914d\u7f6e\u7ec4', u'firefly\u544a\u8b66\u914d\u7f6e\u7ec4'],
        u'permissions': {u'firefly': [u'super.admin']}
    }

    LOCAL_USER_NEW = {u'status': u'normal', u'name': u'\u97e9\u6e67',
                      u'all_roles': [u'cmdb\u666e\u901a\u7528\u6237\u7ec4', u'cmdb\u8868\u7ed3\u6784\u7f16\u8f91\u7528\u6237\u7ec4', u'cmdb\u666e\u901a\u7ba1\u7406\u5458', u'itsm\u666e\u901a\u7528\u6237', u'passport\u666e\u901a\u7528\u6237', u'passport\u8fd0\u7ef4\u7528\u6237'],
                      u'mobile': u'13636348810', u'id': 42, u'um': u'hanyong336', u'user_roles': [],
                      u'department': [u'\u9646\u91d1\u6240lufax\u7f51\u7ad9\u8fd0\u7ef4\u7ba1\u7406\u90e8'], u'email': u'hanyong336@lu.com',
                      u'permissions': [u'login.login', u'super.admin']}

