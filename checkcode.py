import requests
from pyquery import PyQuery as pq
import random
import os
import time

URL = 'https://nbp.szzfgjj.com/newui/login.jsp?transcode=pri'

HEADERS = {            
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
}



def get_page(url):
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            return response.text
        else:
            return None
    except Exception as e:
        print("Get page fail", e)

def parse_page(html):
    if html:
        doc = pq(html)
        img = doc('#yzm').attr('src')
        print(img)
        
def get_img(url, i):
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            # print(response.content)
            save_img(response.content, i)
        else:
            print('status_code', response.status_code)
    except Exception as e:
        print("Fail to get img", e)

def save_img(content, i):
    img_path = os.path.join(os.getcwd(), 'img')
    img_name = img_path + '\\' + str(i) + '.jpg'
    if not os.path.isfile(img_name):
        with open(img_name, 'wb') as f:
            f.write(content)
            f.close()

def main():
    # html = get_page(URL)
    # parse_page(html)
    url = 'https://nbp.szzfgjj.com//nbp/ranCode.jsp?tab=card&amp;t=' + str(random.random())
    for i in range(100):
        get_img(url, i)
        time.sleep(0.1)
    # print(url)
    

if __name__ == '__main__':
    # main()
    main()
