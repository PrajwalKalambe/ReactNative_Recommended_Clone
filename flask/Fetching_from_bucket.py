import pandas as pd
import os
from google.cloud import vision
import requests

os.environ['GOOGLE_APPLICATION_CREDENTIALS']='GoogleVision_API/API_key.json'
filename='gs://visionassignement/Product_DB 1.csv'
Output_list=[]
final_list=[]


def detect_feature(uri):
    
    #LABEL DETECTION CODE
    client = vision.ImageAnnotatorClient()
    image = vision.Image()
    image.source.image_uri = uri
    
    response = client.label_detection(image=image)
    labels = response.label_annotations

    # is_url_image(link)

    img_label=[]
    for label in labels:
        img_label.append(label.description)
    # print(img_label)
    Output_list.append(str(img_label))


    # OBJECT DETECTION CODE
    objects = client.object_localization(image=image).localized_object_annotations
    obj_list=[]
    for object_ in objects:
        obj_list.append(object_.name)
    obj_list=set(obj_list)
    Output_list.append(list(obj_list))   


    # LOGO DETECTION CODE
    response = client.logo_detection(image=image)
    logos = response.logo_annotations
    logo_name=''
    for logo in logos:
        logo_name=logo.description
    Output_list.append(logo_name)

# Read the CSV file into a DataFrame
df = pd.read_csv(filename)
URL_link = df['product_url']
for i in range(len(URL_link)):
    prod_name=df['product_name'][i]
    link=df['product_url'][i]
    # Output_list.append(prod_name)
    Output_list.append(str(link))
    
    detect_feature(link)
    final_list.append(Output_list)
    Output_list=[]


# print("final_list:- ",final_list)

df = pd.DataFrame(final_list, columns=['PRODUCT_NAME','URL','DESCRIPTIONS','OBJECT','BRAND'])
df.to_csv('D:\\Python\\Recommend_Clone\\final_result.csv',index=False)

   


