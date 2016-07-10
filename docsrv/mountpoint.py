# coding=utf-8

from apis.attachment import attachment_api
from apis.transform import transform_api
from apis.check import check_api

from views.chart import chart_view

__author__ = 'hany'


MOUNT_POINTS = (
    (check_api, '/docsrv/check'),
    (attachment_api, '/docsrv/api/attachment'),
    (transform_api, '/docsrv/api/transform'),
    (chart_view, '/docsrv/chart'),
)