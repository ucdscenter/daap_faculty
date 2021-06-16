import pandas as pd
import json

df = pd.read_csv('cleaned_DAAP_faculty.csv')

the_things = ['interests_cleaned', 'skills_cleaned', 'projects_cleaned', 'bios_cleaned']
the_thing = {}

for x in the_things:
	the_thing[x] = {}


print(df.head())
for i in range(df.shape[0]):
	for n in the_thing:
		the_arr = df.iloc[i][n]
		the_arr = the_arr[1:-1].replace("'", "").split(", ")
		print(the_arr)
		for v in the_arr:
			if v in the_thing[n]:
				the_thing[n][v] += 1
			else:
				the_thing[n][v] = 1

json.dump(the_thing, open("extra_dicts.json", "w"), indent=4)