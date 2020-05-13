This application will be able to notify students when a new section of a class that they are signed up to be alerted for becomes available. This is accomplished with the following:
A simple form in the front end 
An API that adds the email and class of the person who wishes to be alerted.
A Cron job that queries the with the following request:
curl --location --request POST 'https://selfservice.uncc.edu/pls/BANPROD/bwckschd.p_get_crse_unsec' \
--header 'Accept-Language: en-US,en;q=0.5' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: TESTID:"SET"' \
--header 'Host: selfservice.uncc.edu' \
--header 'Origin: https://selfservice.uncc.edu' \
--header 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0' \
--header 'Content-Type: text/html' \
--data-raw 'term_in=202080&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj=MATH&sel_crse=&sel_title=&sel_schd=%25&sel_insm=%25&sel_from_cred=&sel_to_cred=&sel_camp=%25&sel_levl=%25&sel_ptrm=%25&sel_attr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a'
This returns an html page of all sections of a class specified by the student. 
A python function parses the file and returns the number of new segments for each class
A node backend recieves this and notifies the students who have a new segment available. 
