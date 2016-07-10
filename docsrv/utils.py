# coding=utf-8

import logging
from flask import abort, render_template, jsonify
import traceback
from datetime import datetime, timedelta
import requests
import inspect
from werkzeug import secure_filename

__author__ = 'hany'

view_logger = logging.getLogger('log_view')
db_logger = logging.getLogger('log_db')
app_logger = logging.getLogger('log_app')
mod_logger = logging.getLogger('log_mod')


class ViewDecorate(object):

    @classmethod
    def record_view_exception(cls, func):
        def record_exception(*args, **kwargs):
            beg_time = datetime.now()
            try:
                back = func(*args, **kwargs)
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                view_logger.info('func: %s, cost:%s s' % (func.__name__, time_dtt))
                return back
            except Exception, e:
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                view_logger.warning('func: %s, cost:%s s, error:%s' % (func.__name__, time_dtt,
                                                                       traceback.format_exc()+'\n'+str(e)))
                return render_template('common/file_500.html',
                                       err='func: %s, cost:%s s, error:%s' %
                                           (func.__name__, time_dtt, traceback.format_exc()+'\n'+str(e)))
        return record_exception

    @classmethod
    def record_call_exception(cls, func):
        def record_exception(*args, **kwargs):
            beg_time = datetime.now()
            try:
                back = func(*args, **kwargs)
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                view_logger.info('func: %s, cost:%s s' % (func.__name__, time_dtt))
                return back
            except Exception, e:
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                view_logger.warning('func: %s, cost:%s s, error:%s' % (func.__name__, time_dtt,
                                                                       traceback.format_exc()+'\n'+str(e)))
                return jsonify({'resCode': 500, 'data': None, 'mess': traceback.format_exc()+'\n'+str(e)})
        return record_exception


class DBDecorate(object):

    @classmethod
    def record_db_exception(cls, func):
        def record_exception(*args, **kwargs):
            beg_time = datetime.now()
            try:
                back = func(*args, **kwargs)
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                db_logger.debug('func: %s, cost:%s s' % (func.__name__, time_dtt))
                return back
            except Exception, e:
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                db_logger.warning('func: %s, cost:%s s, error:%s' % (func.__name__, time_dtt,
                                                                     traceback.format_exc()+'\n'+str(e)))
                return list()
        return record_exception

    @classmethod
    def record_updates_exception(cls, func):
        def record_exception(*args, **kwargs):
            beg_time = datetime.now()
            try:
                back = func(*args, **kwargs)
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                db_logger.debug('func: %s, cost:%s s' % (func.__name__, time_dtt))
                return back
            except Exception, e:
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                db_logger.warning('func: %s, cost:%s s, error:%s' % (func.__name__, time_dtt,
                                                                     traceback.format_exc()+'\n'+str(e)))
                return 0
        return record_exception


class ModDecorate(object):

    @classmethod
    def record_mod_exception(cls, func):
        def record_exception(*args, **kwargs):
            beg_time = datetime.now()
            try:
                back = func(*args, **kwargs)
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                mod_logger.debug('func: %s, cost:%s s' % (func.__name__, time_dtt))
                return back
            except Exception, e:
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                mod_logger.warning('func: %s, cost:%s s, error:%s' % (func.__name__, time_dtt,
                                                                      traceback.format_exc()+'\n'+str(e)))
                return list()
        return record_exception


class AppDecorate(object):

    @classmethod
    def record_app_exception(cls, func):
        def record_exception(*args, **kwargs):
            beg_time = datetime.now()
            try:
                back = func(*args, **kwargs)
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                app_logger.debug('func: %s, cost:%s s' % (func.__name__, time_dtt))
                return back
            except Exception, e:
                end_time = datetime.now()
                time_dtt = str((end_time - beg_time).total_seconds())
                app_logger.warning('func: %s, cost:%s s, error:%s' % (func.__name__, time_dtt,
                                                                      traceback.format_exc()+'\n'+str(e)))
                return {'resCode': 500, 'data': None, 'mess': traceback.format_exc()+'\n'+str(e)}
        return record_exception


def show_object_cost_time(func):
    def do_cost_time(*args, **kwargs):
        app_logger.info('show objects counts:'+kwargs['objectName'])
        back = func(*args, **kwargs)
        return back
    return do_cost_time


class BasicMod(object):

    @staticmethod
    def requests_post_json(host, url, data, timeout=30):
        try:
            r = requests.post('http://'+host+url, json=data, timeout=30)

            ret_json = r.json()
            return ret_json.get('data')
        except Exception, e:
            print traceback.format_exc()+'\n'+str(e)
            return None

    @staticmethod
    def request_get_json(host, url, params, key=None, except_ret={}, timeout=30):
        try:
            r = requests.get('http://'+host+url, params=params, timeout=timeout)
            ret_json = r.json()
            if key is not None:
                return ret_json.get(key)
            else:
                return ret_json
        except Exception, e:
            print traceback.format_exc()+'\n'+str(e)
            return except_ret

    @staticmethod
    def insert_mongo(collect, json_dict):
        # ret = mongo.db[collect].insert(json_dict)
        # return ret
        return {}


def res_json(code, data, message, success, **kwargs):
    res = jsonify(
            code=code,
            data=data,
            message=message,
            success=success,
            **kwargs
    )
    if str(code) in ["200", "401", "403"]:
        res.status_code = code
    return res


def my_secure_filename(file_name, chn_mode='chn'):
    if chn_mode == 'ignore':
        return secure_filename(repr(file_name))
    elif chn_mode == 'chn':
        if file_name.count('/') > 0:
            file_name = file_name.split('/')[-1]

        if file_name.count(' ') > 0:
            file_name = file_name.replace(' ', '_')

        return file_name
    else:
        return secure_filename(file_name)
