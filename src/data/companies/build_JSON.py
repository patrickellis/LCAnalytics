import glob, os
import pandas as pd
import json

def do_import():
    os.chdir("./")
    for file in glob.glob("*.csv"):
        df = pd.read_csv(file)
        parseCategory(df,convert_name_to_proper(file))

os.chdir("./1yr")
for file in glob.glob("*.csv"):
    df = pd.read_csv(file)
