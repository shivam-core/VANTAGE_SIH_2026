import os
from pathlib import Path
from .python_ast import parse_python_file
from .certificates import parse_certificate

def traverse_directory(root: Path, scope_id: str, as_of: str, max_file_bytes: int, max_total_bytes: int, out_file: Path):
    report = {
        "schemaVersion": "1.0",
        "reportId": "cli-report-1",
        "scanId": "scan-1",
        "scopeId": scope_id,
        "startedAt": as_of,
        "finishedAt": as_of,
        "analysisAsOf": as_of,
        "status": "complete",
        "origin": "python-cli",
        "collectorVersions": { "vantage-python-cli": "1.0.0" },
        "policyVersion": "1.0",
        "coverage": {
            "discoveredFiles": 0,
            "eligibleFiles": 0,
            "analysedFiles": 0,
            "skippedFiles": 0,
            "failedFiles": 0,
            "bytesRead": 0,
            "supportedDetectors": ["PY-HASHLIB", "PY-HMAC", "CERT-X509"],
            "entries": []
        },
        "assets": [],
        "uses": [],
        "evidence": [],
        "relationships": [],
        "warnings": []
    }

    # basic traversal
    for dirpath, dirnames, filenames in os.walk(root):
        # Exclude directories
        dirnames[:] = [d for d in dirnames if d not in {".git", ".venv", "node_modules", "dist", "__pycache__"}]
        
        for filename in filenames:
            file_path = Path(dirpath) / filename
            if file_path.resolve() == out_file.resolve():
                continue
                
            rel_path = str(file_path.relative_to(root))
            
            if file_path.suffix == ".py":
                report["coverage"]["discoveredFiles"] += 1
                report["coverage"]["eligibleFiles"] += 1
                try:
                    with open(file_path, "rb") as f:
                        data = f.read(max_file_bytes)
                    parse_python_file(data, rel_path, report, scope_id, as_of)
                    report["coverage"]["analysedFiles"] += 1
                    report["coverage"]["bytesRead"] += len(data)
                except Exception as e:
                    report["coverage"]["failedFiles"] += 1
                    report["coverage"]["entries"].append({"relativePath": rel_path, "status": "failed", "reason": str(e)})
            
            elif file_path.suffix in {".pem", ".der", ".crt"}:
                report["coverage"]["discoveredFiles"] += 1
                report["coverage"]["eligibleFiles"] += 1
                try:
                    with open(file_path, "rb") as f:
                        data = f.read(max_file_bytes)
                    parse_certificate(data, rel_path, report, scope_id, as_of)
                    report["coverage"]["analysedFiles"] += 1
                    report["coverage"]["bytesRead"] += len(data)
                except Exception as e:
                    report["coverage"]["failedFiles"] += 1
                    report["coverage"]["entries"].append({"relativePath": rel_path, "status": "failed", "reason": str(e)})

    return report
