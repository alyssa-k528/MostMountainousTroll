**Team Name**
The trollies

**Group Members**
Francise Ferrer - ffa21@sfu.ca
Anne Jiao - aja107@sfu.ca
Alyssa Kou - aka272@sfu.ca
Lauren Yip - lya85@sfu.ca

**Project Description**
website that takes user voice input, and extracts their vocal range, and gives them their ideal karaoke song based on pitch.

**Git Repo**
https://github.com/alyssa-k528/MostMountainousTroll

**How to get the Project Started**
1. clone the repo and then open it in vscode
2. make sure all the necessary libraries are downloaded
3. go into index.html and press ```Open with live server```
4. press on ```Record Note``` and sing
5. the frontend was unable to be connected to the backend due to time constraints
6. add the ```Recording.wav``` into the github repo, replacing the one we had
7. paste in ```ffmpeg -i Recording.wav -acodec pcm_s16le -ar 44100 -ac 1 output.wav```into the terminal
8. go into the ```app.py``` and run the program either through the play button or through typing ```python3 app.py``` or ```python app.py``` depending on your python version, then in the terminal you would be able to see the output song, artist, and song URL that best fits the pitch of your voice. 
9. tadaaaa! great job!