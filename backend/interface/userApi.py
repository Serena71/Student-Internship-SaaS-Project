import jwt

from service.userService import *
from flask import send_file
from flask import Blueprint
from flask import request, jsonify
from flask_login import LoginManager
from service.userService import *
from data.models import *
from utils.email import *
import time
# from flask_mail import *
import json

# from utils.email import *

user_opt = Blueprint('user_opt', __name__)
login_manager = LoginManager()

login_users = []
token_key = "dreamTeam"

@user_opt.route("/register",methods=['POST'])
def register():
    data = json.loads(request.data)
    username = data['username']
    password = data['password']
    email = data['email']
    type = data['type']
    nickname = data['nickname']
    organisation = data['organisation']
    if type == 'student':
        type = 0
    else:
        type = 1
    message = checkRegistered(username, email)

    if message.errortype == 1:
        return json.dumps(message, default=lambda obj: obj.__dict__)
    user = User(username=username, password=password, email=email,type=type)
    mesvalue = registerNewAccount(user)
    resume = ResumeUser(user_id=mesvalue.errormessage, name=nickname, email=email, university=organisation)
    addresume(resume)
    start_date = time.time() + 360000
    id = mesvalue.errormessage
    mes = {'id': id, 'exp': start_date}
    token = jwt.encode(mes, token_key, algorithm='HS256')
    data = {}
    data['id'] = id
    data['token'] = token
    message = errorMessage(200, data)
    deco = jwt.decode(token,
                      token_key, algorithms='HS256', options={"varify_signature": False})
    exptime = deco['exp']
    return json.dumps(message, default=lambda obj: obj.__dict__)


@user_opt.route("/login",methods=['GET'], endpoint="login")
def login():
    # data = json.loads(request.form.get('data'))
    username = request.values.get('username')
    password = request.values.get('password')

    message = checkInfoCorrect(username, password)
    if message.errortype == 1:
        return json.dumps(message, default=lambda obj: obj.__dict__)
    if username not in login_users:
        login_users.append(username)

    id = getUserId(username)
    start_date = time.time() + 360000
    mes = {'id': id, 'exp': start_date}
    token = jwt.encode(mes, token_key, algorithm='HS256')
    data = {}
    data['id'] = id
    data['token'] = token
    type = getLoginusertype(id)
    data['type'] = type
    message = errorMessage(200, data)
    deco = jwt.decode(token,
                      token_key, algorithms='HS256', options={"varify_signature": False})
    exptime = deco['exp']
    return json.dumps(message, default=lambda obj: obj.__dict__)

# This api is used for change password
@user_opt.route("/changepassword",methods=['GET'], endpoint="changepassword")
def changepassword():
    token = request.values.get('token')
    old_password = request.values.get('old_password')
    new_password = request.values.get('new_password')
    # print(id,old_password,new_password)
    deco = jwt.decode(token, token_key, algorithms='HS256')
    id = deco['id']
    message = checkOldPassword(id, old_password)
    if message.errortype == 1:
        return json.dumps(message, default=lambda obj: obj.__dict__)

    message = changepasswd(id, new_password)
    start_date = time.time() + 360000
    mes = {'id': id, 'exp': start_date}
    token = jwt.encode(mes, token_key, algorithm='HS256')
    data = {}
    data['id'] = id
    data['token'] = token
    message = errorMessage(200, data)
    exptime = deco['exp']
    return json.dumps(message, default=lambda obj: obj.__dict__)

# This function is used for forgetting password
@user_opt.route("/forget", methods=['GET'], endpoint="forget")
def forget():
    email = request.values.get("email")
    message = checkEmailIsRegister(email)
    if message.errortype == 1:
        return json.dumps(message, default=lambda obj: obj.__dict__)

    # get random uuid
    captcha = str(uuid.uuid1())[:6]
    body = 'Your verification code is :%s' % captcha
    htmlbody = '<h1>HTML body </h1>'
    message = errorMessage(200, captcha)
    try:
        # send_email('Website email verification code',mail,body,htmlbody)
        msg = Message('Website email verification code', sender='1184344283@qq.com', recipients=[email])

        msg.body = body
        msg.html = body
        mail.send(msg)

    except Exception as e:
        message = errorMessage(1, e)
    return json.dumps(message, default=lambda obj: obj.__dict__)

@user_opt.route("/resetpassword")
def resetpassword():
    email = request.values.get('email')
    password = request.values.get('password')
    message = reset_password(email, password)
    return json.dumps(message, default=lambda obj: obj.__dict__)

# This api is used for logout
@user_opt.route("/logout")
def logout():
    token = request.values.get('token')
    deco_token = jwt.decode(token, token_key, algorithms='HS256')
    id = deco_token['id']
    message = logout_user(id)
    username = message.errormessage
    if username in login_users:
        login_users.remove(username)
    message = errorMessage(200, "ok")
    return json.dumps(message, default=lambda obj: obj.__dict__)

# This api is used for get information of user
@user_opt.route("/getinfo", methods=['GET'])
def getinfo():
    token = request.values.get('token')
    deco_token = jwt.decode(token, token_key, algorithms='HS256')
    id = deco_token['id']
    res = get_info(id)
    data = {}
    data['data'] = res
    data['errortype'] = 200
    return data

# update method
@user_opt.route("/upload_image", methods=['POST'])
def upload_image():
    user_id = request.json["user_id"]
    image_base64 = request.json["image_base64"]
    message = save_image_from_base64(user_id, image_base64)
    return json.dumps(message, default=lambda obj: obj.__dict__)


# update query image function
@user_opt.route("/image_thumbnail/<user_id>", methods=['GET'])
def query_image(user_id):
    return send_file(f"./image_thumbnail/{user_id}", mimetype='image/gif')

@user_opt.route("/submitResume", methods=['POST'])
def change_resume():
    resumeid = request.json["resumeid"]
    resume = request.json["resume"]
    message = update_resume(resumeid, resume)
    # update
    return json.dumps(message, default=lambda obj: obj.__dict__)

# get user resume function
@user_opt.route("/getResume", methods=['GET'])
def get_resume():
    user_id = request.values.get('resumeId')

    message = query_resume(user_id)
    # update
    return json.dumps(message, default=lambda obj: obj.__dict__)


# This api is used for following user
@user_opt.route("/like", methods=['GET'])
def like():
    following_id = request.values.get('followingId')
    follower_id = request.values.get('followerId')
    message = user_like(following_id, follower_id)
    # update
    return json.dumps(message, default=lambda obj: obj.__dict__)


# This function is used for unfollow people
@user_opt.route("/dislike", methods=['GET'])
def dislike():
    following_id = request.values.get('followingId')
    follower_id = request.values.get('followerId')
    message = user_dislike(following_id, follower_id)
    # update
    return json.dumps(message, default=lambda obj: obj.__dict__)

# get following list
@user_opt.route("/following", methods=['GET'])
def following():
    user_id = request.values.get('userId')
    message = query_following(user_id)
    # update
    return json.dumps(message, default=lambda obj: obj.__dict__)


# get followers
@user_opt.route("/follower", methods=['GET'])
def follower():
    user_id = request.values.get('userId')
    message = query_follower(user_id)
    # update 7.24:
    return json.dumps(message, default=lambda obj: obj.__dict__)

# This api is used for checking if user follows another user
@user_opt.route("/checkfollow", methods=['GET'])
def checkfollow():
    id = request.values.get("id")
    user_id = request.values.get("user_id")
    type = getUserIdentity(user_id)
    flag = checkIfFollow(id,user_id)
    data = {}
    data['type'] = type
    data['flag'] = flag
    message = errorMessage(200, data)
    return json.dumps(message, default=lambda obj: obj.__dict__)
