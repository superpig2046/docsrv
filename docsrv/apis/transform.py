# coding=utf-8

from flask import Blueprint,render_template,request,session,redirect,current_app,g,jsonify, Response
from werkzeug import secure_filename
import datetime,json,time
from ..utils import ViewDecorate
from ..ext import mongo
from ..apps.transformApp import TransformFile, XlsData
from datetime import datetime
import pymongo
from bson import ObjectId
import os.path
import random


__author__ = 'hany'


transform_api = Blueprint('transform', __name__)


@ViewDecorate.record_call_exception
@transform_api.route("/file.uploads.json", methods=['POST'])
def transform_uploads():
    upload_file = request.files['file']
    source = request.args.get('source', 'undefined')
    content_type = upload_file.content_type
    file_name = upload_file.filename
    ext = os.path.splitext(file_name)[1]
    print '>>>', file_name, ext

    create_date = datetime.now()

    trans_file = TransformFile(upload_file)
    data = trans_file.transform().table_grid

    ret = mongo.db.table.grid.insert_one({
        'source': source, 'content_type': content_type, 'file_name': file_name, 'create_date': create_date,
        'data': data, 'ext': ext
    })
    _id = ret.inserted_id
    return jsonify({'resCode': 200, 'data': {'grid': data, '_id': str(_id)}, 'mess': 'ok'})


@ViewDecorate.record_call_exception
@transform_api.route("/file.fetch.json", methods=['GET'])
def transform_fetch():
    source = request.args.get('source', 'undefined')
    file_name = request.args.get('file_name', '')
    _id = request.args.get('_id', None)

    if _id:
        for document in mongo.db.table.grid.find({'_id': ObjectId(_id)}):
            return jsonify({'resCode': 200, 'data': document['data'], 'mess': 'ok'})

    for document in mongo.db.table.grid.find({'source': source, 'file_name': file_name}).sort(
            [('create_date', pymongo.DESCENDING)]):
        return jsonify({'resCode': 200, 'data': document['data'], 'mess': 'ok'})

    return jsonify({'resCode': 404, 'data': {}, 'mess': 'no document found'})


@ViewDecorate.record_call_exception
@transform_api.route("/xls.transform.no-save.json", methods=['POST'])
def xls_transform():
    sheet_name = request.get_json().get('sheet', 'Sheet1')
    data = request.get_json().get('data', list())
    xls_file = XlsData(sheet_name, data).transform_file().file_name
    f = open(xls_file, 'rb')
    data = f.read()
    f.close()
    return Response(data, mimetype="text/plain",
                    headers={"Content-Disposition": "attachment;filename=%s" % os.path.split(xls_file)[1]})
