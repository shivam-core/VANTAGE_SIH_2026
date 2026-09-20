import pytest
from vantage_scan.python_ast import parse_python_file

def test_hashlib_md5():
    code = b'''
import hashlib
def foo(data):
    return hashlib.md5(data).hexdigest()
'''
    report = {"assets": [], "uses": [], "evidence": []}
    parse_python_file(code, "test.py", report, "scope-1", "2026-09-20T00:00:00Z")
    
    assert len(report["assets"]) == 1
    assert report["assets"][0]["canonicalName"] == "MD5"
    assert len(report["uses"]) == 1
    assert report["uses"][0]["purpose"] == "unknown"
    assert len(report["evidence"]) == 1
    assert report["evidence"][0]["detectorId"] == "PY-HASHLIB"

def test_hashlib_new_sha256():
    code = b'''
import hashlib
def foo(data):
    return hashlib.new("sha256", data)
'''
    report = {"assets": [], "uses": [], "evidence": []}
    parse_python_file(code, "test.py", report, "scope-1", "2026-09-20T00:00:00Z")
    
    assert len(report["assets"]) == 1
    assert report["assets"][0]["canonicalName"] == "SHA256"
