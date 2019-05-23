import requests

PROXIES_URL = 'http://127.0.0.1:5555/random'


HEADERS = {            
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
}

TEST_URL = 'http://www.11467.com/shenzhen/co/1252.htm'

def get_proxies(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.text
        else:
            return None
    except Exception as e:
        print("Get proxies fail", e)

def get_one_page(url, proxies):
    try:
        response = requests.get(url, headers=HEADERS, proxies=proxies, timeout=3)
        if response.status_code == 200:
            return response.text
        else:
            return None
    except Exception as e:
        print("Get test html fail", e)

if __name__ == "__main__":
    proxy = get_proxies(PROXIES_URL)
    proxies = {'http': proxy}
    print(proxies)
    context = get_one_page(TEST_URL, proxies)
    print(context)
