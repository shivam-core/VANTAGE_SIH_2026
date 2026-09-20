import argparse
import sys
import datetime
from pathlib import Path
import json

from .traverse import traverse_directory

def main():
    parser = argparse.ArgumentParser(description="Vantage local scanner")
    subparsers = parser.add_subparsers(dest="command", required=True)
    
    scan_parser = subparsers.add_parser("scan")
    scan_parser.add_argument("root", type=Path, help="Root directory to scan")
    scan_parser.add_argument("--scope", required=True, help="Scope ID")
    scan_parser.add_argument("--out", type=Path, required=True, help="Output JSON file")
    scan_parser.add_argument("--as-of", default=datetime.datetime.now(datetime.timezone.utc).isoformat(), help="Analysis timestamp")
    scan_parser.add_argument("--max-file-bytes", type=int, default=1048576)
    scan_parser.add_argument("--max-total-bytes", type=int, default=31457280)
    
    args = parser.parse_args()
    
    if args.command == "scan":
        if not args.root.exists() or not args.root.is_dir():
            print(f"Error: {args.root} is not a valid directory", file=sys.stderr)
            sys.exit(2)
            
        try:
            report = traverse_directory(args.root, args.scope, args.as_of, args.max_file_bytes, args.max_total_bytes, args.out)
            
            with open(args.out, "w", encoding="utf-8") as f:
                json.dump(report, f, indent=2)
                
            sys.exit(0)
        except Exception as e:
            print(f"Fatal error: {e}", file=sys.stderr)
            sys.exit(4)

if __name__ == "__main__":
    main()
