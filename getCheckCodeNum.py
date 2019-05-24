from aip import AipOcr
import time

APP_ID = '16025851'
API_KEY = 'KHx6WjtQ1IbVh9rB5rWIEXvt'
SECRET_KEY = 'HpSfsZGm5jiVi4zS5ZHkr13GlIfauxvv'

client = AipOcr(APP_ID, API_KEY, SECRET_KEY)


""" 读取图片 """
def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        return fp.read()


for i in range(100):
    image = get_file_content('./img/' + str(i) + '.jpg')
    # result = client.basicGeneral(image)
    result = client.basicAccurate(image)
    print(str(i), '.jpg =', result['words_result'][0]['words'])
    time.sleep(1)
