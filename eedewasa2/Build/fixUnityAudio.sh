#!/bin/sh
FILE=$(find . -name '*.asm.framework.unityweb' -exec basename {} +)
echo 'fixed '$FILE
mv $FILE $FILE.gz
gunzip $FILE.gz
gsed -i.bak 's#function _JS_Sound_Init(){try{window.AudioContext=window.AudioContext||window.webkitAudioContext;WEBAudio.audioContext=new AudioContext;WEBAudio.audioWebEnabled=1}catch(e){alert("Web Audio API is not supported in this browser")}}#function _JS_Sound_Init(){try{window.AudioContext=window.AudioContext||window.webkitAudioContext;WEBAudio.audioContext=new AudioContext();var tryToResumeAudioContext=function(){if(WEBAudio.audioContext.state==="suspended")WEBAudio.audioContext.resume();else{clearInterval(resumeInterval)}};var resumeInterval=setInterval(tryToResumeAudioContext,400);WEBAudio.audioWebEnabled=1}catch(e){alert("Web Audio API is not supported in this browser")}}#g' $FILE
rm $FILE.bak
gzip --best $FILE
mv $FILE.gz $FILE