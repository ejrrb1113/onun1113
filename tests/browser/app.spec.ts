import {test,expect} from '@playwright/test';
test('검색 · 상세 · 즐겨찾기 · 공유 링크',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByText('샘플 데이터 모드')).toBeVisible();
 const mobile=testInfo.project.name==='mobile';
 if(mobile)await page.getByLabel('행사 목록 펼치기').click();
 const search=page.getByLabel(mobile?'모바일 행사 검색':'행사 검색',{exact:true});
 await search.fill('천안');await expect(page.locator('.event-card')).toHaveCount(3);
 await page.locator('.card-info').first().click();await expect(page.locator('.detail h2')).toContainText('충청남');
 await page.getByRole('button',{name:'저장하기',exact:true}).click();await expect(page.getByRole('button',{name:'저장됨',exact:true})).toBeVisible();
 await page.reload();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('moa-favorites')||'[]').length)).toBe(1);
 await page.goto('/?event=demo-34-0');await expect(page.locator('.detail h2')).toContainText('충청남');
 await page.screenshot({path:`test-results/${testInfo.project.name}-detail.png`,fullPage:true});expect(errors).toEqual([]);
});
test('복합 필터와 빈 결과 및 초기화',async({page},testInfo)=>{
 await page.goto('/');if(testInfo.project.name==='mobile')await page.getByLabel('필터 열기').click();
 await page.getByLabel('시도',{exact:true}).selectOption('34');await page.getByLabel('입장료',{exact:true}).selectOption('free');
 await page.getByRole('button',{name:'가족 체험',exact:true}).click();
 if(testInfo.project.name==='mobile'){await page.getByRole('button',{name:'행사 1개 보기'}).click();await page.getByLabel('행사 목록 펼치기').click()}
 await expect(page.locator('.event-card')).toHaveCount(1);
 if(testInfo.project.name==='mobile')await page.getByLabel('필터 열기').click();
 await page.getByLabel('어린이 나이').selectOption('0');
 if(testInfo.project.name==='mobile')await page.getByRole('button',{name:'행사 0개 보기'}).click();
 await expect(page.getByText('조건에 맞는 행사가 없어요')).toBeVisible();await page.getByRole('button',{name:'필터 초기화',exact:true}).click();await expect(page.locator('.event-card')).toHaveCount(51);
});
test('행정구역 드릴다운 및 지도 클러스터',async({page},testInfo)=>{
 await page.goto('/');await expect(page.locator('.cluster').first()).toBeVisible();
 await page.getByRole('button',{name:'행정구역',exact:true}).click();await expect(page.locator('.region-label')).toHaveCount(17);
 await page.getByText('충청남도 · 3개 샘플',{exact:true}).click();await expect(page.locator('.boundary-note')).toContainText('충청남도 · 시군구 선택');
 await expect(page.locator('.leaflet-overlay-pane path').first()).toBeVisible();
 const district=page.locator('.leaflet-overlay-pane path[aria-label="천안시동남구"]');await expect(district).toHaveCount(1);await district.focus();await page.keyboard.press('Enter');await expect(page.locator('.event-card')).toHaveCount(3);
 await page.getByRole('button',{name:'전국으로 돌아가기'}).click();await expect(page.locator('.region-label')).toHaveCount(17);
 await page.getByRole('button',{name:'일반 지도',exact:true}).click();await page.getByLabel('지도 제공자').selectOption('kakao');await expect(page.getByText('카카오 지도 키가 필요합니다')).toBeVisible();
 await page.getByLabel('지도 제공자').selectOption('open');await page.getByLabel('다크모드',{exact:true}).click();await expect(page.locator('.app')).toHaveClass('app dark');
 await page.screenshot({path:`test-results/${testInfo.project.name}-map.png`,fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
test('위치·거리 필터와 지도 마커 선택',async({page,context},testInfo)=>{
 await context.grantPermissions(['geolocation']);await context.setGeolocation({latitude:36.807,longitude:127.152});await page.goto('/');
 if(testInfo.project.name==='mobile')await page.getByLabel('필터 열기').click();
 await page.getByLabel('현재 위치 기준 거리').selectOption('10');
 if(testInfo.project.name==='mobile')await page.getByRole('button',{name:'행사 3개 보기'}).click();
 await expect(page.locator('.event-card')).toHaveCount(3);
 await page.getByLabel('현재 지도 안에서 찾기').check();
 for(let attempt=0;attempt<6&&await page.locator('.cluster').count();attempt++){await page.locator('.cluster').first().click();await page.waitForTimeout(700)}
 await page.locator('.pin').first().click();await expect(page.locator('.detail h2')).toContainText('충청남');
});
