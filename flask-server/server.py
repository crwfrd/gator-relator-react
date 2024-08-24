from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, storage
from firebase_admin import firestore
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate("serviceAccountKey.json")
firebase = firebase_admin.initialize_app(cred, {
    'storageBucket': 'gs://fir-test-f01db.appspot.com'
})
db = firestore.client()
bucket = storage.bucket(app=firebase)

def userInput(firstName, lastName, email, gradMonth, gradYear, major, tags):
    data = {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'gradMonth': gradMonth,
        'gradYear': gradYear,
        'major': major,
        'tags': tags
    }
    doc_ref = db.collection('users').document()
    doc_ref.set(data)
    print('Document ID:', doc_ref.id)
    
def get_user_by_criteria(first_name=None, last_name=None, email=None, grad_month=None, grad_year=None, major=None, tags=None):
    users_ref = db.collection('users')
    conditions = []
    if first_name:
        conditions.append(('firstName', '==', first_name))
    if last_name:
        conditions.append(('lastName', '==', last_name))
    if email:
        conditions.append(('email', '==', email))
    if grad_month:
        conditions.append(('gradMonth', '==', grad_month))
    if grad_year:
        conditions.append(('gradYear', '==', grad_year))
    if major:
        conditions.append(('major', '==', major))
    if tags:
        conditions.extend(('tags.' + key, '==', value) for key, value in tags.items())
    query = users_ref
    for condition in conditions:
        query = query.where(*condition)
    query = query.limit(1).stream()
    for doc in query:
        return doc.to_dict()
    return None

def get_users_by_tags(tags):
    users_ref = db.collection('users')
    users = users_ref.stream()
    valid_users = []
    index_count = {}
    final = []

    for user in users:

        user_dict = user.to_dict()

        user_tags = user_dict["firstName"].split(" ") + user_dict["lastName"].split(" ") + [str(user_dict["gradYear"]), user_dict["major"]]
        for company in user_dict["companies"]:
            user_tags.append(company)
        for org in user_dict["studentOrgs"]:
            user_tags.append(org)

        for tag in tags:
            if tag in user_tags:
                if user_dict in valid_users:
                    index_count[valid_users.index(user_dict)] += 1
                else:
                    valid_users.append(user_dict)
                    index_count[len(index_count)] = 1
        
    while(len(index_count) > 0):
        max = 0
        maxIndex = 0
        for index, count in index_count.items():
            if count > max:
                maxIndex = index
                max = count
        final.append(valid_users[maxIndex])
        del index_count[maxIndex]
    
    return final
        

@app.route('/user-data')
def user_data():
    user = get_user_by_criteria()
    collectionList = db.collection("users").get()
    names = ""
    for i in collectionList:
        names += i.to_dict()["firstName"] + "\n"
    return {"hello" : names}  # Just testing the react app flask connection

@app.route('/card-info', methods=['POST'])
def card_info():
    data = request.json
    # print(data)
    # print(get_users_by_tags(data))
    return jsonify(get_users_by_tags(data)), 200

if __name__ == '__main__':
    app.run(debug=True)