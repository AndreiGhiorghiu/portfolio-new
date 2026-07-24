#!/usr/bin/env python3
"""Summarize the nginx JSON visit log.

Usage:
  visits                 summary: totals, last 14 days, top pages
  visits --recent [N]    last N page views (default 20)
  visits --visitors [N]  last N visitors with the pages they navigated
  visits --raw           dump the raw JSON lines
"""

import json
import sys
from collections import Counter, OrderedDict
from pathlib import Path

LOG = Path("/var/log/visits/visits.json")

BOT_MARKERS = ("bot", "crawl", "spider", "curl", "wget", "python-requests", "headless")


def load():
    entries = []
    if not LOG.exists():
        return entries
    # include rotated file from logrotate, if present
    for path in [LOG.with_suffix(".json.1"), LOG]:
        if not path.exists():
            continue
        for line in path.read_text(errors="replace").splitlines():
            try:
                entry = json.loads(line)
            except json.JSONDecodeError:
                continue
            if entry.get("status") != 200:
                continue
            entries.append(entry)
    return entries


def is_bot(entry):
    ua = (entry.get("ua") or "").lower()
    return any(marker in ua for marker in BOT_MARKERS)


def day(entry):
    return entry["time"][:10]


def when(entry):
    return entry["time"][:16].replace("T", " ")


def summary(entries):
    humans = [entry for entry in entries if not is_bot(entry)]
    bots = len(entries) - len(humans)
    ips = {entry["ip"] for entry in humans}

    print(f"page views : {len(humans)}  (+{bots} bot/tool hits)")
    print(f"visitors   : {len(ips)} unique IPs")
    if not humans:
        return

    print("\nlast 14 days")
    by_day = Counter(day(entry) for entry in humans)
    for date in sorted(by_day)[-14:]:
        count = by_day[date]
        print(f"  {date}  {count:>4}  {'█' * min(count, 40)}")

    print("\ntop pages")
    for path, count in Counter(entry["path"] for entry in humans).most_common(10):
        print(f"  {count:>4}  {path}")


def recent(entries, limit):
    for entry in entries[-limit:]:
        flag = " [bot]" if is_bot(entry) else ""
        print(f"{when(entry)}  {entry['ip']:<15}  {entry['path']}{flag}")


def visitors(entries, limit):
    humans = [entry for entry in entries if not is_bot(entry)]
    by_ip = OrderedDict()
    for entry in humans:
        by_ip.setdefault(entry["ip"], []).append(entry)

    for ip, visits in list(by_ip.items())[-limit:]:
        pages = list(OrderedDict.fromkeys(entry["path"] for entry in visits))
        print(f"\n{ip}  ·  {len(visits)} views  ·  {when(visits[0])} → {when(visits[-1])}")
        for path in pages:
            print(f"    {path}")


def main():
    entries = load()
    if not entries:
        print("no visits logged yet")
        return

    args = sys.argv[1:]
    if not args:
        summary(entries)
    elif args[0] == "--recent":
        recent(entries, int(args[1]) if len(args) > 1 else 20)
    elif args[0] == "--visitors":
        visitors(entries, int(args[1]) if len(args) > 1 else 20)
    elif args[0] == "--raw":
        for entry in entries:
            print(json.dumps(entry))
    else:
        print(__doc__)


if __name__ == "__main__":
    main()
