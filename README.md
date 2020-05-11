# ScheduleAssistant
A web application react + python aimed at notifying users who sign up when an extra section of a class they want opens up.



The following request will return a list of classes for a specific major.
curl --location --request POST 'https://selfservice.uncc.edu/pls/BANPROD/bwckschd.p_get_crse_unsec' \
--header 'Accept-Language: en-US,en;q=0.5' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: TESTID:"SET"' \
--header 'Host: selfservice.uncc.edu' \
--header 'Origin: https://selfservice.uncc.edu' \
--header 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0' \
--header 'Content-Type: text/html' \
--data-raw 'term_in=202080&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj=MATH&sel_crse=&sel_title=&sel_schd=%25&sel_insm=%25&sel_from_cred=&sel_to_cred=&sel_camp=%25&sel_levl=%25&sel_ptrm=%25&sel_attr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a'

We can take this HTML page returned, scrape out what we need using beautiful soup and then notify the user if a new section has opened up for a specific class that they need. 
