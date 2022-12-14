from flask import Flask
from config import Config,Data
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from interface.userApi import *
from interface.intershipApi import *
from interface.reviewApi import *
jwt = JWTManager()

app = Flask(__name__, static_url_path='/')
app.config.from_object(Config)
app.config.from_object(Data)
app.register_blueprint(user_opt, url_prefix="/user/")
app.register_blueprint(internship_opt, url_prefix="/internship/")
app.register_blueprint(review_opt, url_prefix="/review/")
mail.init_app(app)
jwt.init_app(app)
db.init_app(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True)

@app.route("/", endpoint="test")
def test():
    return 'hello'


if __name__ == '__main__':
    # db.create_all(app=app)
    app.run(host='127.0.0.1', port=5500, debug=True)



