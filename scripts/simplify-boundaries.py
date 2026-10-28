"""입력 GeoJSON을 화면 표시용으로 단순화합니다 (좌표계 WGS84)."""
import json, math, sys
sys.setrecursionlimit(10000)
def simplify(points, tolerance=.0015):
    if len(points)<5:return points
    a,b=points[0],points[-1]
    dx,dy=b[0]-a[0],b[1]-a[1]
    def distance(p):
        t=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy))) if dx or dy else 0
        return math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)
    index=max(range(1,len(points)-1),key=lambda i:distance(points[i]))
    if distance(points[index])>tolerance:
        return simplify(points[:index+1],tolerance)[:-1]+simplify(points[index:],tolerance)
    return [a,b]
def ring(r):
    result=simplify(r)
    return result if len(result)>=4 else r
for path in sys.argv[1:]:
    with open(path) as f:data=json.load(f)
    for feature in data['features']:
        g=feature['geometry']
        if g['type']=='Polygon':g['coordinates']=[ring(r) for r in g['coordinates']]
        elif g['type']=='MultiPolygon':g['coordinates']=[[ring(r) for r in p] for p in g['coordinates']]
    with open(path,'w') as f:json.dump(data,f,ensure_ascii=False,separators=(',',':'))
