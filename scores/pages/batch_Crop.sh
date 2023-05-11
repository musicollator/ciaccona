mkdir -p cropped 
mkdir -p cropped_transparent
lilypond -fpng ../bwv-1004_5_for_PNGs.ly && sips -r 90 *.png
for f in *.png; do ffmpeg -y -i "${f}" -vf  "crop=1095:78:85:22,colorkey=white:0.3:0.5" "cropped_transparent/${f%%.*}.png"; done
ffmpeg -y -i "bwv-1004_5_for_PNGs-page1.png"    -vf  "crop=1142:78:38:22,colorkey=white:0.3:0.5" "cropped_transparent/bwv-1004_5_for_PNGs-page1.png"
ffmpeg -y -i "bwv-1004_5_for_PNGs-page34.png"   -vf  "crop=1142:78:38:22,colorkey=white:0.3:0.5" "cropped_transparent/bwv-1004_5_for_PNGs-page34.png"
ffmpeg -y -i "bwv-1004_5_for_PNGs-page53.png"   -vf  "crop=1142:78:38:22,colorkey=white:0.3:0.5" "cropped_transparent/bwv-1004_5_for_PNGs-page53.png"


docker run -v $(pwd):/app -w /app jeandeaual/lilypond:2.25.2 lilypond -dcrop -dno-point-and-click -fsvg bwv-1004_5_for_PNGs.ly 
mv *.svg pages
cd pages
z

docker start 3535ee387493 

/Applications/Inkscape.app/Contents/MacOS/inkscape

for f in *.png; do mv -- "$f" "${f%%.*}.svg"; done


docker run -v $(pwd):/app -w /app jeandeaual/lilypond:2.25.2 lilypond -dcrop -dno-point-and-click -fsvg bwv-1004_5_for_SVGs.ly 
