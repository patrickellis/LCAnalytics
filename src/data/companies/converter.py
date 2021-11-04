import csv
import json
import glob,os
dir = glob.glob("./*")
def filename_to_company(name):
    return name[2:-4].capitalize()

companies = {}
print(dir)
for file in dir:
    if(file[-2:]=="py"):
        continue
    os.chdir(file)
    subdir = glob.glob('*.csv')
    tempdict = {}
    for csv_file in subdir:
        with open(csv_file) as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            print(filename_to_company(csv_file), ", ", rows)
            tempdict[filename_to_company(csv_file)] = rows
    companies[file[2:]] = tempdict
    os.chdir('../')
        #targetdir = '../json/'+file[2:-4]+'.json'
        #print(targetdir)
        #with open(targetdir, 'w') as f:
        #    json.dump(rows, f)

with open('companies.json','w') as f:
    json.dump(companies,f)
