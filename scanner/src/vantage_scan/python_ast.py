import ast
import hashlib

def generate_id(*parts):
    s = "|".join(str(p) for p in parts)
    return hashlib.sha256(s.encode("utf-8")).hexdigest()[:12]

def parse_python_file(data: bytes, rel_path: str, report: dict, scope_id: str, as_of: str):
    source = data.decode("utf-8")
    tree = ast.parse(source, filename=rel_path)
    
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            func = node.func
            symbol = None
            if isinstance(func, ast.Attribute):
                symbol = func.attr
            elif isinstance(func, ast.Name):
                symbol = func.id
                
            if symbol in {"sha256", "md5", "new"}:
                # Simplified representation for hash detection
                alg = "UNKNOWN"
                if symbol in {"sha256", "md5"}:
                    alg = symbol.upper()
                elif node.args and isinstance(node.args[0], ast.Constant):
                    alg = str(node.args[0].value).upper()
                    
                asset_id = generate_id("asset", "algorithm", alg, symbol)
                asset = next((a for a in report["assets"] if a["id"] == asset_id), None)
                if not asset:
                    asset = {
                        "id": asset_id,
                        "kind": "algorithm",
                        "displayName": alg,
                        "canonicalName": alg,
                        "details": {"operation": "hash"},
                        "evidenceIds": []
                    }
                    report["assets"].append(asset)
                
                ev_id = generate_id("evidence", scope_id, rel_path, symbol, getattr(node, "lineno", 0))
                ev = {
                    "id": ev_id,
                    "provenance": "observed-source",
                    "confidence": "high",
                    "collectorId": "vantage-python-cli",
                    "collectorVersion": "1.0.0",
                    "detectorId": "PY-HASHLIB",
                    "relativePath": rel_path,
                    "symbol": symbol,
                    "startLine": getattr(node, "lineno", 0),
                    "endLine": getattr(node, "end_lineno", 0),
                    "safeSummary": f"{symbol}(...)",
                    "observedAt": as_of,
                    "limitations": []
                }
                report["evidence"].append(ev)
                asset["evidenceIds"].append(ev_id)
                
                use_id = generate_id("use", scope_id, rel_path, symbol, getattr(node, "lineno", 0))
                report["uses"].append({
                    "id": use_id,
                    "applicationId": None,
                    "assetId": asset_id,
                    "purpose": "unknown",
                    "operation": "hash",
                    "evidenceIds": [ev_id],
                    "contextStatus": "observed"
                })
