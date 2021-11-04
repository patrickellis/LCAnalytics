import csv
import json
import glob
dir = glob.glob("./*")
def filename_to_company(name):
    return name[2:-4].capitalize()

companies = {}

for file in dir:
    if(file[-3:]=="csv"):
        with open(file) as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            print(filename_to_company(file), ", ", rows)
            companies[filename_to_company(file)] = rows
        #targetdir = '../json/'+file[2:-4]+'.json'
        #print(targetdir)
        #with open(targetdir, 'w') as f:
        #    json.dump(rows, f)

with open('comanies.json','w') as f:
    json.dump(companies,f)
