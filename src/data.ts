export const categories = ['지역축제','콘서트','뮤지컬','연극','전시회','박람회','어린이 행사','가족 체험','교육·문화','플리마켓','스포츠','기타 행사'] as const;
export type Category = typeof categories[number];
export const colors = ['#ec4899','#8b5cf6','#a855f7','#6366f1','#f59e0b','#f97316','#22c55e','#14b8a6','#0ea5e9','#d97706','#3b82f6','#64748b'];
export const regions = [
 ['11','서울특별시','종로구',37.572,126.979],['21','부산광역시','해운대구',35.163,129.163],['22','대구광역시','중구',35.869,128.606],['23','인천광역시','연수구',37.41,126.678],['24','광주광역시','동구',35.146,126.923],['25','대전광역시','유성구',36.374,127.387],['26','울산광역시','남구',35.535,129.31],['29','세종특별자치시','세종시',36.48,127.289],['31','경기도','수원시 팔달구',37.282,127.016],['32','강원도','춘천시',37.881,127.73],['33','충청북도','청주시 상당구',36.635,127.49],['34','충청남도','천안시 동남구',36.807,127.152],['35','전라북도','전주시 완산구',35.815,127.153],['36','전라남도','순천시',34.95,127.487],['37','경상북도','경주시',35.835,129.219],['38','경상남도','창원시 성산구',35.227,128.681],['39','제주특별자치도','제주시',33.499,126.531],
] as const;
export interface Festival {id:string;name:string;categories:Category[];start:string;end:string;venue:string;address:string;lat:number;lng:number;region:string;district:string;price:number|null;age:number|null;setting:'실내'|'실외'|null;description:string;image:string|null;website:string|null;source:string;updatedAt:string;sample:true}
const themes=['가을빛 산책 축제','주말 어쿠스틱 콘서트','꼬마 탐험가 체험전'];
export const events:Festival[]=regions.flatMap(([region,name,district,lat,lng],i)=>themes.map((theme,j)=>({
 id:`demo-${region}-${j}`, name:`${name.replace(/특별자치시|특별자치도|특별시|광역시|도/g,'')} ${theme}`,categories:j===0?[categories[i%12],'가족 체험']:j===1?['콘서트']:['어린이 행사','교육·문화'],start:`2026-${j===2?'11':'10'}-${j===0?'28':j===1?'31':'01'}`,end:j===0?'2026-11-03':j===1?'2026-11-01':'2026-11-15',venue:`${district} 예시 ${j===1?'공연장':'문화공간'}`,address:`${name} ${district} (샘플 위치)`,lat:lat+j*0.008,lng:lng+j*0.012,region,district,price:j===0?0:j===1?15000:null,age:j===2?2:null,setting:j===1?'실내':j===0?'실외':null,description:'지도와 검색 기능 검증을 위한 가상 행사입니다. 실제 개최되는 행사가 아니며 방문·예매에 사용할 수 없습니다. 실시간 공공데이터 연결은 다음 개발 단계에서 제공됩니다.',image:null,website:null,source:'기능 검증용 샘플 데이터',updatedAt:'2026-10-28T00:00:00+09:00',sample:true,
})));
