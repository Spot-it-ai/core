import sys
import os
from youtube_transcript_api import YouTubeTranscriptApi
import json


newPath = os.path.dirname(os.path.abspath(__file__)) + "/db/transcriptions/" + sys.argv[1] + ".json"
with open(newPath, "w+") as nfile:
    transcription = YouTubeTranscriptApi.get_transcript(sys.argv[1])
    if transcription != None:
        nfile.write(json.dumps([]))
    else:
        nfile.write(json.dumps(transcription))
