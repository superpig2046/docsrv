# coding=utf-8

from flask import Blueprint,render_template,request,session,redirect,current_app,g,jsonify
from werkzeug import secure_filename
import datetime,json,time
from ..utils import ViewDecorate
from ..ext import mongo


__author__ = 'hany'


attachment_api = Blueprint('attachment', __name__)


@attachment_api.route("/hello.json", methods=['GET'])
def hello():
    return jsonify({'resCode': 200, 'data': 'ok', 'mess': 'ok'})


@ViewDecorate.record_call_exception
@attachment_api.route("/attachment.upload.json", methods=['POST'])
def attachment_upload():
    force = int(request.args.get('force', 0))
    reserve = int(request.args.get('reserve', 1))
    upload_file = request.files['file']
    file_name = secure_filename(upload_file.filename)
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




