import os
import runpy
import sys
import tempfile


TMP = r"C:\tmp"
RENDERER = r"C:\Users\khana\.codex\plugins\cache\openai-primary-runtime\documents\26.630.12135\skills\documents\render_docx.py"
INPUT = r"C:\Users\khana\Desktop\kavya\Kavya_Portfolio_Redesign_Proposal.docx"
OUTPUT_DIR = r"C:\Users\khana\Desktop\kavya\docx_render"

os.makedirs(TMP, exist_ok=True)
os.environ["TMP"] = TMP
os.environ["TEMP"] = TMP
os.environ["TMPDIR"] = TMP
tempfile.tempdir = TMP

sys.argv = [RENDERER, INPUT, "--output_dir", OUTPUT_DIR, "--emit_pdf"]
runpy.run_path(RENDERER, run_name="__main__")
