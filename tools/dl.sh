#!/bin/zsh
# dl.sh <hash8> <name>  – lädt Dreamina-Original aus Zwischenablage nach assets-roh/<name>.png (prüft Hash im URL)
P=/Users/eugenkelberer/Library/CloudStorage/Dropbox-FAVELAClothing/CLAUDE/Projekte/HAUSWERK
U="$(pbpaste)"; case "$U" in *$1*aigc_resize:0:0*) ;; *) echo "mismatch"; exit 1;; esac
T=$(mktemp -t hw).png; curl -s -o $T "$U" && sips -g pixelWidth -g pixelHeight $T | tail -2 && mkdir -p $P/assets-roh && cp $T $P/assets-roh/$2.png && md5 -q $T
