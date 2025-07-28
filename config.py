import os

class Config:
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '1234')
    MYSQL_DB = os.getenv('MYSQL_DB', 'Projeto_Integrador')

#
#    DB_CONFIG = {
#    'MYSQL_HOST': 'localhost',
#    'MYSQL_USER': 'root',
#   'MYSQL_PASSWORD': '',
#    'MYSQL_DB': ''
#}

