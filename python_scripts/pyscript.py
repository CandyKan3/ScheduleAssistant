import requests
from bs4 import BeautifulSoup
import sys

def classAmount(subject_name):
    headers = {
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'selfservice.uncc.edu',
        'Origin': 'https://selfservice.uncc.edu'
    }
    raw_data = "term_in=202080&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj=ACCT&sel_subj=ADMN&sel_subj=AERO&sel_subj=AFRS&sel_subj=AMST&sel_subj=ANTH&sel_subj=ARBC&sel_subj=ARCH&sel_subj=ARTA&sel_subj=ARTE&sel_subj=ARTH&sel_subj=ARTB&sel_subj=ARTC&sel_subj=ARTM&sel_subj=ARTD&sel_subj=ARTF&sel_subj=ARTG&sel_subj=ARTL&sel_subj=ARTP&sel_subj=ARTT&sel_subj=ARTR&sel_subj=ARTZ&sel_subj=AAHP&sel_subj=ATRN&sel_subj=BINF&sel_subj=BIOL&sel_subj=BDBA&sel_subj=BPHD&sel_subj=BUSN&sel_subj=BUSA&sel_subj=BLAW&sel_subj=CAPI&sel_subj=CHEM&sel_subj=CHFD&sel_subj=CHNS&sel_subj=CEGR&sel_subj=ETCE&sel_subj=COAA&sel_subj=CLAS&sel_subj=COMM&sel_subj=ITCS&sel_subj=ITSC&sel_subj=CMET&sel_subj=CSLG&sel_subj=CJUS&sel_subj=EDCI&sel_subj=DANC&sel_subj=DTSC&sel_subj=DSBA&sel_subj=ESCI&sel_subj=ECON&sel_subj=EIST&sel_subj=EDUC&sel_subj=RSCH&sel_subj=ELET&sel_subj=ECGR&sel_subj=ELED&sel_subj=ENGR&sel_subj=EMGT&sel_subj=ETGR&sel_subj=ENGL&sel_subj=ENER&sel_subj=FILM&sel_subj=FINN&sel_subj=MFPA&sel_subj=ETFS&sel_subj=FRAN&sel_subj=FREN&sel_subj=GEOG&sel_subj=GEOL&sel_subj=GERM&sel_subj=GRNT&sel_subj=GRAD&sel_subj=HAHS&sel_subj=HADM&sel_subj=HSRD&sel_subj=HSMT&sel_subj=HHUM&sel_subj=HIST&sel_subj=HCIP&sel_subj=HGHR&sel_subj=HTAS&sel_subj=INES&sel_subj=INST&sel_subj=IBUS&sel_subj=INTL&sel_subj=INTE&sel_subj=ITLN&sel_subj=JAPN&sel_subj=JOUR&sel_subj=FLED&sel_subj=KNES&sel_subj=LACS&sel_subj=LTAM&sel_subj=LEGL&sel_subj=LBST&sel_subj=MBAD&sel_subj=MGMT&sel_subj=MSMG&sel_subj=INFO&sel_subj=MKTG&sel_subj=MPAD&sel_subj=MALS&sel_subj=MUDD&sel_subj=MATH&sel_subj=MAED&sel_subj=MEGR&sel_subj=ETME&sel_subj=METR&sel_subj=MDLG&sel_subj=MDSK&sel_subj=MSCI&sel_subj=MUSC&sel_subj=MUED&sel_subj=MUPF&sel_subj=NANO&sel_subj=NDSS&sel_subj=NURS&sel_subj=NUAN&sel_subj=NUNP&sel_subj=NUDN&sel_subj=NURN&sel_subj=OPER&sel_subj=OPRS&sel_subj=OPTI&sel_subj=OSCI&sel_subj=PHIL&sel_subj=PHYS&sel_subj=POLS&sel_subj=PSYC&sel_subj=HLTH&sel_subj=PPOL&sel_subj=READ&sel_subj=MSRE&sel_subj=RELS&sel_subj=RESP&sel_subj=RUSS&sel_subj=SECD&sel_subj=SOWK&sel_subj=SOCY&sel_subj=ITIS&sel_subj=SOST&sel_subj=SPAN&sel_subj=SPED&sel_subj=SPEL&sel_subj=STAT&sel_subj=SEGR&sel_subj=TESL&sel_subj=THEA&sel_subj=TRAN&sel_subj=UCOL&sel_subj=HONR&sel_subj=UWRT&sel_subj=CUYC&sel_subj=WGST&sel_subj=WRDS&sel_crse=&sel_title=" + subject_name + "&sel_schd=%25&sel_insm=%25&sel_from_cred=&sel_to_cred=&sel_camp=%25&sel_levl=%25&sel_ptrm=%25&sel_attr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a"
    r = requests.post("https://selfservice.uncc.edu/pls/BANPROD/bwckschd.p_get_crse_unsec", data=raw_data,
                      headers=headers)

    numListings = getListingNum(r.content)

    return numListings


def getListingNum(content):
    classList = []
    instructorList = []
    classTime = []
    classDays = []
    classSection = []
    subjandcrsenum = []
    classLocation = []
    classDateRange = []
    classType = []
    soup = BeautifulSoup(content, features="html.parser")

    for a in soup.findAll('th', attrs={'class': 'ddtitle'}):  # searches through and gets the title of each class
        classNameList = a.text.split(" - ")  # splits text up into seperate parts
        classList.append(classNameList[0])  # add Class name to list
        subjandcrsenum.append(classNameList[2])  # add subject and course nunm to list
        classSection.append(classNameList[3])  # add class section to list

    for a in soup.findAll('td', attrs={'class': 'dddefault'},
                          string="Class"):  # searches through and finds the table with all the class info
        ClassTime = a.find_next_sibling('td')  # finds next item in table
        classTime.append(ClassTime.text)  # adds class info to corresponding list
        ClassDays = ClassTime.find_next_sibling('td')  # finds next item in table
        classDays.append(ClassDays.text)
        ClassLocation = ClassDays.find_next_sibling('td')  # finds next item in table
        classLocation.append(ClassLocation.text)
        ClassDateRange = ClassLocation.find_next_sibling('td')  # finds next item in table
        classDateRange.append(ClassDateRange.text)
        ClassType = ClassDateRange.find_next_sibling('td')  # finds next item in table
        classType.append(ClassType.text)
        ClassInstructor = ClassType.find_next_sibling('td')
        instructorList.append(ClassInstructor.text.split("(P)")[0])

    return len(classSection)


if __name__ == "__main__":
    print(classAmount(sys.argv[1]))
    sys.stdout.flush()

