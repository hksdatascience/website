
import csv

with open('bikepghpublic.csv','r') as f:
	reader= csv.DictReader(f)
	alldata=list(reader)


with open('security_expert.csv','w') as f:
	writer= csv.writer(f)
	writer.writerow(['type','safety'])
	


	for member in alldata:

		sortlist = ['1','2','3','4','5']

		if member['SafetyHuman'] in sortlist:
			type_drive= 'Human_Drive'
			safety = member['SafetyHuman']

			row=[type_drive,safety]
			writer.writerow(row)


	for member in alldata:

		sortlist = ['1','2','3','4','5']

		if member['SafetyAV'] in sortlist:
			type_av= 'AV'
			safety = member['SafetyAV']

			row=[type_av,safety]
			writer.writerow(row)

















