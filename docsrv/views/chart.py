# coding=utf-8


from flask import Blueprint,render_template,request,session,redirect,current_app,g,jsonify, Response
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


chart_view = Blueprint('chart', __name__)


@ViewDecorate.record_view_exception
@chart_view.route("/chart.transform.json", methods=['GET'])
def chart_from_transform():
    return render_template('chart/raw.index.html')