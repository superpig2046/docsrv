# coding=utf-8

import os
from flask.ext.script import Manager, prompt_bool
from flask.ext.debugtoolbar import DebugToolbarExtension
from flask import render_template, g

from docsrv.mountpoint import MOUNT_POINTS
from docsrv.settings import create_app, configure_blueprints
from docsrv import config

__author__ = 'hany'


env = os.getenv('APP_ENV')
if not env:
    env = "Development"
cfg = getattr(config, '%sConfig' % env)
if not cfg:
    raise RuntimeError("can not find config for Evn %s" % env)
app = create_app(conf=cfg)

app = configure_blueprints(app, MOUNT_POINTS)
toolbar = DebugToolbarExtension(app)
manager = Manager(app)


@app.errorhandler(404)
def not_found(error):
    return render_template('common/file_404.html')

"""
@manager.command
def db_setup():
    "create all database tables"
    db.create_all()


@manager.command
def db_dropall():
    "drop all databse tables"
    if prompt_bool("Are you sure ? You will lose all your data !"):
        db.drop_all()
"""


if __name__ == '__main__':
    manager.run(default_command="runserver")

