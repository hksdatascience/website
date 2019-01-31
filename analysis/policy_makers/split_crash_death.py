#import csv
import csv
import json

with open('crashes.csv', 'r') as f:
    reader = csv.DictReader(f)
    rows = [dict(row) for row in reader] # Convert Ordered Dict to regular dict (python 3.6 or higher)

#print(rows)
crashes = rows

#rewrite death

with open('death.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(['Year', 'Deaths'])
	#loop through crash.csv
    for death in crashes:

	    # write each veggie to a CSV
        Year = death['Year']
        Deaths = death['Deaths']
        rows = [Year, Deaths]

        writer.writerow(rows)

       
#rewrite crash
with open('crash.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(['Year', 'Crashes'])
	#loop through crash.csv
    for crash in crashes:

	    # write each veggie to a CSV
        Year = crash['Year']
        Crashes = crash['Crashes']
        rows = [Year, Crashes]

        writer.writerow(rows)


#to json
#write json


with open('crash.csv', 'r') as f:
    reader = csv.DictReader(f)
    rows = [dict(row) for row in reader] # Convert Ordered Dict to regular dict (python 3.6 or higher)

#print(rows)

with open('crash.json', 'w') as f:
    json.dump(rows, f, indent = 1)

#write json


with open('death.csv', 'r') as f:
    reader = csv.DictReader(f)
    rows = [dict(row) for row in reader] # Convert Ordered Dict to regular dict (python 3.6 or higher)

#print(rows)

with open('death.json', 'w') as f:
    json.dump(rows, f, indent = 1)









        