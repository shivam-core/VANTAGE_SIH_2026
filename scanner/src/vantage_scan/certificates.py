import hashlib
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from .python_ast import generate_id

def parse_certificate(data: bytes, rel_path: str, report: dict, scope_id: str, as_of: str):
    try:
        cert = x509.load_pem_x509_certificate(data)
    except Exception:
        try:
            cert = x509.load_der_x509_certificate(data)
        except Exception as e:
            raise ValueError(f"Could not parse certificate: {e}")

    public_key = cert.public_key()
    spki = public_key.public_bytes(
        serialization.Encoding.DER,
        serialization.PublicFormat.SubjectPublicKeyInfo,
    )
    digest = hashes.Hash(hashes.SHA256())
    digest.update(spki)
    spki_sha256 = digest.finalize().hex()
    cert_sha256 = cert.fingerprint(hashes.SHA256()).hex()
    
    asset_id = generate_id("asset", "certificate", cert_sha256)
    
    asset = next((a for a in report["assets"] if a["id"] == asset_id), None)
    if not asset:
        asset = {
            "id": asset_id,
            "kind": "certificate",
            "displayName": cert.subject.rfc4514_string() or "Unnamed Certificate",
            "details": {
                "certificateSha256": cert_sha256,
                "spkiSha256": spki_sha256,
                "serialHex": format(cert.serial_number, 'x'),
                "notBefore": cert.not_valid_before_utc.isoformat(),
                "notAfter": cert.not_valid_after_utc.isoformat(),
                "signatureAlgorithmOid": cert.signature_algorithm_oid.dotted_string,
                "subject": cert.subject.rfc4514_string(),
                "issuer": cert.issuer.rfc4514_string(),
            },
            "evidenceIds": []
        }
        report["assets"].append(asset)
        
    ev_id = generate_id("evidence", scope_id, rel_path, cert_sha256)
    ev = {
        "id": ev_id,
        "provenance": "observed-certificate",
        "confidence": "high",
        "collectorId": "vantage-python-cli",
        "collectorVersion": "1.0.0",
        "detectorId": "CERT-X509",
        "relativePath": rel_path,
        "safeSummary": f"Certificate: {asset['displayName']}",
        "observedAt": as_of,
        "limitations": ["Parsed certificate may not be deployed"]
    }
    report["evidence"].append(ev)
    asset["evidenceIds"].append(ev_id)
    
    use_id = generate_id("use", scope_id, rel_path, cert_sha256)
    report["uses"].append({
        "id": use_id,
        "applicationId": None,
        "assetId": asset_id,
        "purpose": "unknown",
        "operation": None,
        "evidenceIds": [ev_id],
        "contextStatus": "observed"
    })
