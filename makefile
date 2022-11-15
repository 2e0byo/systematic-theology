.PHONY: all build server clean
?BROWSER="firefox"

PORT=9192

all: build serve

build:
	scripts/build.py

serve:
	${BROWSER} "http://localhost:${PORT}" &
	python -m http.server ${PORT} -d dist/

devserve:
	${BROWSER} "http://localhost:${PORT}" &
	python -m http.server ${PORT} -d slides/

clean:
	rm -r dist && git checkout dist/
