.PHONY: all build server clean

PORT=9192

all: build serve

build:
	scripts/build.py

serve:
	python -m http.server ${PORT} -d dist/

devserve:
	python -m http.server ${PORT} -d slides/

clean:
	rm -r dist && git checkout dist/
