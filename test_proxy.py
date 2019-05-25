import requests
import redis
redis_db = redis.Redis('localhost', db=15)


def get_proxy_from_txt(filename):
    with open(filename , 'r') as f:
        return f.readlines()

def add_proxy_db(proxy_list):
    counts = 0
    for i in proxy_list:
        print(counts)
        counts += 1
        redis_db.zadd('ZHANDAYE', {i.strip(): 10})

def get_proxy():
    try:
        proxy_list = redis_db.zrevrange('ZHANDAYE', 0, 0)
        proxy = {'http': str(proxy_list[0], encoding='utf-8')}
        response = requests.get('http://www.baidu.com', proxies=proxy, timeout=5)
        if response.status_code == 200:
            print(response.status_code, proxy)
            return proxy
        else:
            print("Fail")
            return get_proxy()
    except Exception as e:
        print("Exception", e)
        # redis_db.zrem('ZHANDAYE', proxy_list[0])
        return get_proxy()

"""
data_list = get_proxy_from_txt('proxy_ip.txt')
print(len(data_list))
if data_list:
    add_proxy_db(data_list)
"""


result = get_proxy()
print(result)
