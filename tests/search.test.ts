import {describe,it,expect} from 'vitest';
import {events} from '../src/data';
import {filterEvents,initialFilters,dateRange,distance} from '../src/search';
describe('행사 검색',()=>{
 it('17개 시도의 샘플 51건을 제공한다',()=>{expect(events).toHaveLength(51);expect(new Set(events.map(e=>e.region)).size).toBe(17)});
 it('지역, 카테고리, 무료, 날짜 조건을 동시에 적용한다',()=>{const result=filterEvents(events,{...initialFilters,region:'34',categories:['가족 체험'],price:'free',start:'2026-10-31',end:'2026-11-01'},null,[]);expect(result.map(e=>e.id)).toEqual(['demo-34-0'])});
 it('시군구 이름의 공백 차이를 정규화한다',()=>{expect(filterEvents(events,{...initialFilters,region:'34',district:'천안시동남구'},null,[])).toHaveLength(3)});
 it('종료일과 시작일이 겹치는 행사를 포함한다',()=>{expect(filterEvents(events,{...initialFilters,start:'2026-11-03',end:'2026-11-03',region:'11'},null,[]).map(e=>e.id)).toEqual(['demo-11-0','demo-11-2'])});
 it('정보 미확인은 무료 또는 연령 적합으로 추정하지 않는다',()=>{expect(filterEvents(events,{...initialFilters,price:'free'},null,[]).every(e=>e.price===0)).toBe(true);expect(filterEvents(events,{...initialFilters,age:'1'},null,[])).toHaveLength(0)});
 it('현재 위치 없는 거리 검색은 임의 결과를 만들지 않는다',()=>{expect(filterEvents(events,{...initialFilters,radius:'50'},null,[])).toHaveLength(0)});
 it('천안 10km 이내 위치를 계산한다',()=>{const result=filterEvents(events,{...initialFilters,radius:'10'},[36.807,127.152],[]);expect(result).toHaveLength(3);expect(result.every(e=>e.region==='34')).toBe(true);expect(distance([37.5,127],[37.5,127])).toBe(0)});
 it('일요일의 이번 주말을 정확하게 계산한다',()=>{expect(dateRange('이번 주말','2026-11-01')).toEqual(['2026-10-31','2026-11-01']);expect(dateRange('이번 달','2026-02-10')).toEqual(['2026-02-01','2026-02-28'])});
 it('즐겨찾기와 키워드를 결합한다',()=>{expect(filterEvents(events,{...initialFilters,favoritesOnly:true,query:'천안'},null,['demo-34-0','demo-11-0']).map(e=>e.id)).toEqual(['demo-34-0'])});
});
