aidList = [
  55010811, 55996997
] 

import requests
import youtube_dl
from datetime import date


today = str(date.today())
#currentDate = str(datetime.datetime.now()).split(' ')[0]
filePrefix = 'download/'+today+'/'

ydl = youtube_dl.YoutubeDL({'outtmpl': filePrefix+'%(id)s%(title)s.%(ext)s'})
note = ''

# Using for loop 
for aid in aidList: 
  with ydl:
    result = ydl.extract_info(
      'https://www.bilibili.com/video/av'+str(aid),
      # download=False # We just want to extract the info
    )
  if 'entries' in result:
  # Can be a playlist or a list of videos
    info = result['entries'][0]
  else:
  # Just a video
    info = result
  fileName = info['id']+info['title']
  note = note + info['id'] + '\n'
  if(info['title']!=info['description']):
    note = note + 'description:'+ info['description'] + '\n'
  # print(info['title'])
  # print(info['description'])

  # api-endpoint 
  videoURL = 'https://api.bilibili.com/x/web-interface/view?aid='+str(aid)
  # sending get request and saving the response as response object 
  rowData = requests.get(url = videoURL).json()

  # extracting data in json format 
  pic = rowData['data']['pic']
  picExtention = pic.split('.')[-1]

  with open(filePrefix+fileName+'.'+picExtention,'wb') as f:
    f.write(requests.get(pic).content)
    f.close()

with open(filePrefix+'/note.txt', 'w') as f:
  f.write(today+'\n')
  f.write(note)
  f.close()

