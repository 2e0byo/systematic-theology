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


def copy_images(indir: Path, img_suffix: str, outdir: Path):
    for imgf in indir.glob(f"*{img_suffix}"):
        copy(imgf, outdir / imgf.name)


for dir in Path("slides").glob("*"):
    if not dir.is_dir():
        continue
    currentf = dir / "slide.html"
    name = currentf.parent.parts[-1]
    clientf = OUTDIR / (name + "-client.html")
    masterf = OUTDIR / (name + "-master.html")
    clientf.write_text(as_client(currentf.read_text()))
    copy(currentf, masterf)
    for img_suffix in {".png", ".jpg"}:
        copy_images(dir, img_suffix, OUTDIR)
