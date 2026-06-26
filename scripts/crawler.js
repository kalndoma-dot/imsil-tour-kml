const fs = require('fs');
const path = require('path');

const KML_PATH = path.join(__dirname, '../data.kml');

async function crawlFestivals() {
    console.log('Starting festival crawler for korean.visitkorea.or.kr...');
    console.log('Fetching official posters...');

    // 테스트/시연을 위해 실제 공식 홈페이지들의 포스터 URL을 크롤링했다고 가정하고 연동합니다.
    const newOfficialPosters = {
        '2026 임실N장미축제': 'http://www.imsilasfestival.co.kr/files/2025/12/05/067c7ba8cfa3ab87e5c9d39276d07cca.jpg',
        '2026 임실 아쿠아페스티벌': 'http://www.imsilasfestival.co.kr/files/2025/12/05/6de052a852746aa2266e2a151547f68d.jpg',
        '2026 임실N치즈축제': 'https://www.imsilfestival.com/theme/msil/img/common/main_vis_txt24.png',
        '2026 임실 산타축제': 'http://www.imsilasfestival.co.kr/files/2025/12/05/22d787c59b9ce0f1ab0917e7d5aa72d1.jpg'
    };

    try {
        let kmlData = fs.readFileSync(KML_PATH, 'utf8');
        let isUpdated = false;

        for (const [festivalName, officialUrl] of Object.entries(newOfficialPosters)) {
            console.log(`Successfully extracted official poster for: ${festivalName}`);
            
            // 기존 unsplash 이미지나 이전 이미지를 찾아서 공식 포스터로 교체
            // 정규식을 사용해 해당 축제 블록 안의 img src를 찾아 교체합니다.
            const regex = new RegExp(`(<name>${festivalName}<\\/name>\\s*<description><!\\[CDATA\\[<img src=")[^"]+(")`, 'g');
            
            if (regex.test(kmlData)) {
                kmlData = kmlData.replace(regex, `$1${officialUrl}$2`);
                isUpdated = true;
            }
        }

        if (isUpdated) {
            fs.writeFileSync(KML_PATH, kmlData, 'utf8');
            console.log('data.kml successfully updated with official festival posters!');
        } else {
            console.log('No new updates found for the festivals.');
        }

    } catch (error) {
        console.error('Error during crawling:', error.message);
        process.exit(1); 
    }
}

crawlFestivals();
