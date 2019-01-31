This is an example to explain how we processed dataset to draw charts

1. Search on the web to find relavant dataset

2. Look for data containing CO emissions from vehicles to show how much pollution is caused by cars (Autonomous Vehicles tend to take shorter routes, traveling less, possibly reduce CO emissions.)

3. Found this page for the dataset
https://www.kaggle.com/sogun3/uspollution

4. See what the data is look like
>> cat pollution_us_2000_2016.csv | head -n 30 | cut -d ',' -f 6,9,25,26,27,28,29

5. Original CSV file is 400.9MB big. Remove unnecessary columns
>> cat pollution_us_2000_2016.csv | cut -d ',' -f 6,9,25,26,27,28,29 > data_selective_columns_only.csv

6. Extract Massachusetts data only
>> cat data_selective_columns_only.csv | csvgrep -c State -m Massachusetts > MA_only.csv

7. Replace comma with tab to make the file TSV and reformat data
Transformating date/time format 
>> python3 format_csv.py

8. "4_final_data.tsv" (99kb) is the final dataset

9. chart.html is drawing D3 line chart using the final dataset