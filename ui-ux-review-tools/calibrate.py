import json, collections, sys
base='/private/tmp/claude-501/-Users-user/8b94b668-b1ba-456a-85e6-0e4168c1b9f1/scratchpad/review/'
gt=json.load(open(base+'ground-truth.json'))['verdicts']
rows=json.load(open(base+'detectors.json'))
det={r['key']: r for r in rows}

missing=[k for k in gt if k not in det]
if missing: print('NO DETECTOR ROW:', missing)

flagged=lambda k: bool(det.get(k,{}).get('flags'))
groups=collections.defaultdict(list)
for k,(v,note) in gt.items(): groups[v].append(k)

print(f"{'':22}{'flagged':>9}{'clean':>8}{'total':>7}")
for v in ('REJECTED','BLOCKED','APPROVED'):
    ks=groups[v]; f=sum(flagged(k) for k in ks)
    print(f'{v:22}{f:>9}{len(ks)-f:>8}{len(ks):>7}')

rej=groups['REJECTED']
print(f"\nRecall on REJECTED: {sum(flagged(k) for k in rej)}/{len(rej)}")
app=groups['APPROVED']
print(f"False-positive rate on APPROVED: {sum(flagged(k) for k in app)}/{len(app)}")

print('\n--- per-detector precision (fired -> share REJECTED) ---')
per=collections.defaultdict(lambda: collections.Counter())
for k,(v,_) in gt.items():
    for f in det.get(k,{}).get('flags',[]):
        per[f['id']][v]+=1
for d in sorted(per):
    c=per[d]; tot=sum(c.values())
    print(f"{d:30} fired {tot:>3}  REJECTED {c['REJECTED']:>3}  BLOCKED {c['BLOCKED']:>2}  APPROVED {c['APPROVED']:>3}   precision {c['REJECTED']/tot:.2f}")

print('\n--- MISSES: rejected by eye, no detector fired (stays human-only) ---')
for k in sorted(rej):
    if not flagged(k): print(f"  {k}\n      {gt[k][1]}")

print('\n--- FALSE POSITIVES: approved by eye but flagged ---')
for k in sorted(app):
    if flagged(k):
        ids=sorted({f['id'] for f in det[k]['flags']})
        print(f"  {k}: {','.join(ids)}")
