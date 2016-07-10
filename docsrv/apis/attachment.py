# coding=utf-8

from flask import Blueprint,render_template,request,session,redirect,current_app,g,jsonify, abort
import datetime,json,time
from ..utils import ViewDecorate, my_secure_filename
from ..ext import mongo
import pymongo
from gridfs import GridFS, NoFile
from werkzeug import wrap_file
from bson import ObjectId
import logging, traceback


__author__ = 'hany'


attachment_api = Blueprint('attachment', __name__)
view_logger = logging.getLogger('log_view')


@attachment_api.route("/hello.json", methods=['GET'])
def hello():
    return jsonify({'resCode': 200, 'data': 'ok', 'mess': 'ok'})


@ViewDecorate.record_call_exception
@attachment_api.route("/attachment.upload.json", methods=['POST'])
def attachment_upload():
    force = int(request.args.get('force', 0))
    reserve = int(request.args.get('reserve', 1))
    upload_file = request.files['file']
    file_name = my_secure_filename(upload_file.filename)
    # print upload_file, file_name

    check_exist = False

    for document in mongo.db.fs.files.find({'filename': file_name}):
        if document['filename'] == file_name:
            check_exist = True

    if check_exist:
        result = mongo.db.fs.files.update_one(
                {'filename': file_name},
                {'$set': {'reserve': reserve}, '$currentDate': {'lastModified': True}})
        print '>>>>', result.modified_count
        if force:
            mongo.save_file(file_name, request.files['file'])
            return jsonify({'resCode': 200, 'data': file_name, 'mess': 'ok'})
        else:
            return jsonify({'resCode': 505, 'data': 'fail', 'mess': 'File %s exists' % file_name})
    else:
        mongo.save_file(file_name, request.files['file'])
        result = mongo.db.fs.files.update_one(
                {'filename': file_name},
                {'$set': {'reserve': reserve}, '$currentDate': {'lastModified': True}})
        print '>>>>', result.modified_count
        return jsonify({'resCode': 200, 'data': file_name, 'mess': 'ok'})


@ViewDecorate.record_call_exception
@attachment_api.route("/attachment.get.json", methods=['GET'])
def attachment_get():
    file_name = request.args.get('file', None)
    assert file_name is not None, 'File name not assigned'
    return mongo.send_file(file_name)


@ViewDecorate.record_call_exception
@attachment_api.route("/attachment.download.json", methods=['GET'])
def attachment_download():
    file_name = request.args.get('file', None)
    assert file_name is not None, 'File name not assigned'
    resp = mongo.send_file(file_name)
    resp.headers.add('Content-Disposition', "attachment;filename=%s" % file_name)
    return resp


@ViewDecorate.record_call_exception
@attachment_api.route("/attachment.upload.id.json", methods=['POST'])
def attachment_upload_ret_id():
    upload_file = request.files['file']
    file_name = my_secure_filename(upload_file.filename)

    mongo.save_file(file_name, request.files['file'], 'upload')

    for document in mongo.db.upload.files.find({'filename': file_name}).sort([('uploadDate', pymongo.DESCENDING)]):
        return jsonify({'resCode': 200, 'data': str(document['_id']), 'mess': 'ok'})
    return jsonify({'resCode': 500, 'data': None, 'mess': 'fail to find document inserted'})


@ViewDecorate.record_call_exception
@attachment_api.route("/attachment.get.id.json", methods=['GET'])
def attachment_fetch_upload_by_id():
    try:
        _id = request.args.get('_id', '')
        cache_for = 31536000

        storage = GridFS(mongo.db, 'upload')
        try:
            fileobj = storage.get(ObjectId(_id))
        except NoFile:
            return redirect('/docsrv/static/pic/404-error-395352.jpg')

        data = wrap_file(request.environ, fileobj, buffer_size=1024 * 256)
        response = current_app.response_class(
            data,
            mimetype=fileobj.content_type,
            direct_passthrough=True)
        response.content_length = fileobj.length
        response.last_modified = fileobj.upload_date
        response.set_etag(fileobj.md5)
        response.cache_control.max_age = cache_for
        response.cache_control.s_max_age = cache_for
        response.cache_control.public = True
        response.make_conditional(request)
        return response
    except Exception, e:
        view_logger.warning('attachment.get.id.json execution fail error:%s' % traceback.format_exc()+'\n'+str(e))
        return redirect('/docsrv/static/pic/404-error-395352.jpg')


