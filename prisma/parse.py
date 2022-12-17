import csv
import os
import requests
import re
from bs4 import BeautifulSoup

full_path = os.path.realpath(__file__)
path, filename = os.path.split(full_path)

PAGE = "https://www.keebtalk.com/t/list-of-keyboard-retailers-shops-stores-vendors/9022"

tag_map = {
    ':shopping_cart:': 'Store',
    ':factory:': 'Factory',
    ':earth_americas:': 'Global',
    ':us:': 'United States of America',
    ':philippines:': 'Philippines',
    ':jp:': 'Japan',
    ':canada:': 'Canada',
    ':cn:': 'China',
    ':uk:': 'United Kingdom',
    ':ukraine:': 'Ukraine',
    ':netherlands:': 'Netherlands',
    ':de:': 'Germany',
    ':fr:': 'France',
    ':kr:': 'Korea',
    ':hong_kong:': 'Hong Kong',
    ':taiwan:': 'Taiwan',
    ':india:': 'India',
    ':belgium:': 'Belgium',
    ':singapore:': 'Singapore',
    ':earth_asia:': 'Asia',
    ':czech_republic:': 'Czech Republic',
    ':norway:': 'Norway',
    ':vietnam:': 'Vietnam',
    ':heavy_minus_sign:': 'None',
    ':sweden:': 'Sweden',
    ':new_zealand:': 'New Zealand',
    ':denmark:': 'Denmark',
    ':portugal:': 'Portugal',
    ':slovakia:': 'Slovakia',
    ':poland:': 'Poland',
    ':australia:': 'Australia',
    ':it:': 'Italy',
    ':dominican_republic:': 'Dominican Republic',
    ':south_africa:': 'South Africa',
    ':es:': 'Spain',
    ':eu:': 'Europe',
    ':mexico:': 'Mexico',
    ':malaysia:': 'Malaysia',
    ':fire:': 'Trending',
    ':eyes:': "Don't miss out",
    ':warning:': 'Untrusted',
    ':no_entry:': 'Closed'
}

def get_display_name(tag):
    if tag in tag_map:
        return tag_map[tag]
    print('tag not found: ' + tag)
    return tag
    

def clean_0(cell):
    contents = cell.contents
    a_ind = 2
    while contents[a_ind].name != 'a':
        a_ind += 1
    i_ind = 0
    while i_ind < len(contents) and contents[i_ind].name != 'img':
        i_ind += 1
    status = "Normal"
    if i_ind < len(contents):
        status = get_display_name(contents[i_ind].attrs['alt'])
    name_0 = contents[0]
    if ',' in name_0:
        name_0 = name_0.replace(',', ' ')
    name_0 = re.sub(' +', ' ', name_0)
    return [name_0, contents[a_ind].contents[0], status]

def clean_1(cell):
    return [f"{len(cell.contents) > 2}".upper()]

def clean_2(cell):
    img = cell.contents[0]
    return [get_display_name(img.attrs['alt'])]

def clean_3(cell):
    img = cell.contents[0]
    return [get_display_name(img.attrs['alt'])]

def clean_4(cell):
    str = cell.contents[0].contents
    return str

def download():
    data = requests.get(PAGE)
    return data.text

html = download()
with open(os.path.join(path, 'stores.html'), 'w', encoding='utf-8') as f:
    f.write(html)
soup = BeautifulSoup(html, 'html.parser')
table = soup.find_all('table')[1]
head = table.contents[1]
body = table.contents[3]
rows = [row for row in body.contents if row != '\n']
rows = [row for row in rows if len(row.contents[3].contents) > 0]
rows = [[content for content in row.contents if content != '\n'] for row in rows]
new_rows = []
for row in rows:
    # row is [<td>, <td>, <td>, <td>, <td>]
    new_row = []
    for cell, cellfn in zip(row, [clean_0, clean_1, clean_2, clean_3, clean_4]):
        new_row += cellfn(cell)
    new_rows.append(new_row)
with open(os.path.join(path, 'stores.csv'), 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['Name', 'URL', 'Status', 'Manufacturer', 'Location', 'Shipping', 'Products'])
    writer.writerows(new_rows)

