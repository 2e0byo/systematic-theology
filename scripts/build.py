#!/usr/bin/env python

from pathlib import Path
from re import sub
from shutil import copy

OUTDIR = Path("dist")
OUTDIR.mkdir(exist_ok=True)


def as_client(master: str):
    """Turn master html file into client."""
    master = sub(r"master\.js", "client.js", master)
    master = sub("secret:.+,", "secret: null,", master)
    return master


for masterf in list(Path("slides").glob("*.html")):  # not sure if it updates
    clientf = OUTDIR / masterf.with_name(masterf.stem + "-client.html").name
    clientf.write_text(as_client(masterf.read_text()))
    copy(masterf, OUTDIR / masterf.with_name(masterf.stem + "-master.html").name)

for imgf in Path("slides").glob("*.png"):
    copy(imgf, OUTDIR / imgf.name)

for imgf in Path("slides").glob("*.jpg"):
    copy(imgf, OUTDIR / imgf.name)
