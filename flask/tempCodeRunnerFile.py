import pandas as pd
import os
from flask import Flask,request,render_template,flash,redirect,url_for,session
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter
from google.cloud import vision
from user_part import detect_feature_from_local,detect_feature_from_url,detect_label_from_url
from google.cloud import storage
import pyrebase
from firebase_admin import  auth
from flask_bcrypt import Bcrypt


app = Flask(__name__)
app.secret_key = "Prajwal"
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

client = storage.Client.from_service_account_json('D:\Python\GoogleVision_API\API_key.json')
bucket_name = 'visionassignement'
filename = 'final_result.csv'
bucket = client.bucket(bucket_name)
blob = bucket.blob(filename)

# firebase part

firebase_config = {
    
    "apiKey": "AIzaSyBRuhO-cnA9OMIaFbxjvcHyjw9oxKdt2H4",
    "authDomain": "recommendvision.firebaseapp.com",
    "projectId": "recommendvision",
    "storageBucket": "recommendvision.appspot.com",
    "messagingSenderId": "693961857647",
    "appId": "1:693961857647:web:a7bcba6b92dfb161b90b9a",
    "databaseURL":"https://recommendvision-default-rtdb.firebaseio.com"
  }

firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()
db = firebase.database()
bcrypt = Bcrypt(app)



@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        if not email or not password:
            flash("All fields are required", "error")
            return redirect(url_for('login'))

        try:
            user = auth.sign_in_with_email_and_password(email, password)
            user_data = db.child("users").child(user['localId']).get().val()

            if user_data and bcrypt.check_password_hash(user_data['password'], password):
                
                
                if user_data.get('isadmin'):
                    flash("ADMIN Login successful ", "success")
                    return render_template('admin_page.html')
                else:
                    flash("USER Login successful", "success")
                    return redirect(url_for('visionA'))
                
                    
            else:
                flash("Invalid email or password", "error")
                return redirect(url_for('login'))
        except Exception as e:
            flash(str(e), "error")
            return redirect(url_for('login'))

    return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        reenter_password = request.form['reenter_password']
        isadmin = request.form.get('isadmin') == 'on'

        if not name or not email or not password or not reenter_password:
            flash("All fields are required", "error")
            return redirect(url_for('signup'))
        
        if password != reenter_password:
            flash("Passwords do not match", "error")
            return redirect(url_for('signup'))

        try:
            user = auth.create_user_with_email_and_password(email, password)
            
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            user_data = {
                'name': name,
                'email': email,
                'password': hashed_password,
                'isadmin': isadmin
            }
            
            db.child("users").child(user['localId']).set(user_data)
            
            flash("Account created successfully", "success")
            return redirect(url_for('login'))
        except Exception as e:
            flash("Account already Exist with this Email !!", "error")
            return redirect(url_for('signup'))

    return render_template('signup.html')


@app.route('/logout',methods=['GET'])
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))


#----------------------------



def read_data_from_bucketCSV():
    temp_path = f'{filename}'
    blob.download_to_filename(temp_path)
    return pd.read_csv(temp_path)

def write_data_in_bucketCSV(df):
    temp_path = f'{filename}'
    df.to_csv(temp_path, index=False)
    blob.upload_from_filename(temp_path)

#-------HOME PAGE SECTION-----------
@app.route('/')
def home():
    return render_template('home.html')


@app.route('/admin',methods=['GET','POST'])
def admin():
    return render_template('admin_page.html')


def cosine_sim(df:pd.DataFrame, a):
    new_df = df
    # print(df)
    for i in range(5):
        b=str(df.iloc[i]['Label']) 
        a_vals = Counter(str(a))
        b_vals = Counter(b)
    
        # convert to word-vectors
        words  = list(a_vals.keys() | b_vals.keys())
        a_vect = [a_vals.get(word, 0) for word in words]     
        b_vect = [b_vals.get(word, 0) for word in words]        
        sim = cosine_similarity([a_vect], [b_vect])
        new_df.loc[i, "SIM"] = sim[0][0]
    new_df.sort_values(["SIM"], axis=0, ascending=False, inplace=True)
    drift = new_df
    return drift

#-----------USER PART---------------
output_arr=[]
@app.route('/visionA',methods=['GET','POST'])
def visionA():
    
    
    if(request.method=='POST'):
        output_arr=[]
        file = request.files['filePath']
        if file.filename == '':
            df = read_data_from_bucketCSV()
            product_name=request.form.get('filePathSeach').lower()
            # p=df[df.PRODUCT_NAME.isin([product_name])]
            temp=df[df['PRODUCT_NAME'].str.lower().str.contains(product_name)]['URL'].tolist()

            if temp==[]:
                err_msg='NO RELATED IMAGE FOUND IN THE DATABASE'
                return render_template('error404.html',err_msg=err_msg)
            return render_template('user_page.html',output_arr=temp)

        if file:

            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file_path='D:\\Python\\'+file_path
            file.save(file_path)
            flash('File successfully uploaded', 'success')

    
        a, lbl=detect_feature_from_local(file_path) 
        # print("a che label :-",lbl)
        df = read_data_from_bucketCSV()
        URL_link = df['URL']
        new_df=df
        
        
        if len(a[0])==0 or not (df['OBJECT'].str.contains((a[0])[0])).any():
            err_msg='NO PRODUCT FOUND IN THE DATABASE'
            return render_template('error404.html',err_msg=err_msg)
            
        for i in range(len(URL_link)):
            b=str(df.iloc[i]['OBJECT'])
            # print(b) 
            a_vals = Counter(str(a))
            b_vals = Counter(b)
        
            # convert to word-vectors
            words  = list(a_vals.keys() | b_vals.keys())
            a_vect = [a_vals.get(word, 0) for word in words]     
            b_vect = [b_vals.get(word, 0) for word in words]        
            sim = cosine_similarity([a_vect], [b_vect])
            new_df.loc[i, "SIM"] = sim[0][0]
        new_df.sort_values(["SIM"],axis=0,ascending=False,inplace=True)
        
        output_arr=[]
        uuuurl = []
        llbl =[]
        for i in range(5):  
            uuuurl.append(new_df.iloc[i]['URL'])
            link=new_df.iloc[i]['URL']
            llbl.append(detect_label_from_url(link))

        output_df = pd.DataFrame({'URL': uuuurl, 'Label': llbl})
        dddddf = cosine_sim(output_df, lbl)
        output_arr = dddddf['URL']           

    else: 
        df=read_data_from_bucketCSV()
        output_arr = df['URL']
        
    return render_template('user_page.html',output_arr=output_arr)
       




# -----------ADMIN PART--------------
@app.route('/AddProduct',methods=['GET','POST'])
def AddProduct():
    if(request.method=='POST'):   
        try:
            product_name=request.form.get('product_name')
            imageUrl = request.form.get('image_url')
            data=detect_feature_from_url(imageUrl) 
            new_df = pd.DataFrame({'PRODUCT_NAME':[product_name],'URL':[imageUrl],'OBJECT':[data]})
            updated_df = pd.concat([read_data_from_bucketCSV(), new_df], ignore_index=True)

            if updated_df.duplicated(subset='URL').any():
                flash("Duplicate products. Product is already in the Database!!!")
                return redirect(url_for("AddProduct"))

            else:
                write_data_in_bucketCSV(updated_df)
                flash("Product has been Added to the Database File..")
                return redirect(url_for("AddProduct"))

        except Exception as e:
            flash("Error: {e}")
    a=pd.read_csv(filename)
    print(a)    
    return render_template('admin_page.html')



@app.route('/uploadCSV', methods=['POST'])
def uploadCSV():
    file = request.files['csvFile']
    if not file or not file.filename.endswith('.csv'):
        flash("Invalid file format")
        return redirect(url_for("uploadCSV"))

    try:
        uploaded_df = pd.read_csv(file)
        existing_df = read_data_from_bucketCSV()
        Combined_obj=[]
        for i in range(len(uploaded_df['URL'])):
            link=uploaded_df['URL'][i]
            a=detect_feature_from_url(link)
            Combined_obj.append(a)
        uploaded_df['OBJECT']=Combined_obj
            


        merged_df = pd.concat([existing_df, uploaded_df], ignore_index=True) 
        if not {"PRODUCT_NAME","URL"}.issubset(uploaded_df.columns):
            flash("Invalid CSV format ")
            return redirect(url_for("uploadCSV"))      
        
        if merged_df.duplicated(subset='URL').any():
            flash("Duplicate products found in the CSV file.")
            
        else:
            write_data_in_bucketCSV(merged_df)
            flash("CSV uploaded and merged successfully!!!")
        a=pd.read_csv(filename)
        print(a)
         

    except Exception as e:
        flash(f"Error processing CSV: Invalid Format!!!")

    return render_template('admin_page.html')


if __name__ == '__main__':
    app.run(debug=True)