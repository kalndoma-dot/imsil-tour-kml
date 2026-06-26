const fs = require('fs');
const path = require('path');
const axios = require('axios');

const KML_PATH = path.join(__dirname, '../data.kml');
const IMAGES_DIR = path.join(__dirname, '../images');

async function downloadImage(url, filepath) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('finish', () => resolve())
            .on('error', e => reject(e));
    });
}

async function crawlFestivals() {
    console.log('Starting festival crawler for korean.visitkorea.or.kr...');
    console.log('Fetching official posters and downloading to local directory...');

    const newOfficialPosters = {
        '2026 임실N장미축제': {
            url: 'http://www.imsilasfestival.co.kr/files/2025/12/05/067c7ba8cfa3ab87e5c9d39276d07cca.jpg',
            filename: 'official_rose_festival_2026.jpg'
        },
        '2026 임실 아쿠아페스티벌': {
            url: 'http://www.imsilasfestival.co.kr/files/2025/12/05/6de052a852746aa2266e2a151547f68d.jpg',
            filename: 'official_aqua_festival_2026.jpg'
        },
        '2026 임실N치즈축제': {
            url: 'http://www.imsilasfestival.co.kr/layouts/bluebDesign/image/main/visual05-1_img.png',
            filename: 'official_cheese_festival_2026.png'
        },
        '2026 임실 산타축제': {
            url: 'http://www.imsilasfestival.co.kr/files/2025/12/05/22d787c59b9ce0f1ab0917e7d5aa72d1.jpg',
            filename: 'official_santa_festival_2026.jpg'
        }
    };

    try {
        let kmlData = fs.readFileSync(KML_PATH, 'utf8');
        let isUpdated = false;
        
        // 캐시 무효화를 위해 고유 버전 생성
        const version = Date.now();

        for (const [festivalName, data] of Object.entries(newOfficialPosters)) {
            console.log(`Downloading official poster for: ${festivalName}...`);
            const filepath = path.join(IMAGES_DIR, data.filename);
            
            // 이미지 다운로드
            await downloadImage(data.url, filepath);
            
            const githubRawUrl = `https://raw.githubusercontent.com/kalndoma-dot/imsil-tour-kml/main/images/${data.filename}?v=${version}`;
            
            // 기존 이미지 경로 교체
            const regex = new RegExp(`(<name>${festivalName}<\\/name>\\s*<description><!\\[CDATA\\[<img src=")[^"]+(")`, 'g');
            
            if (regex.test(kmlData)) {
                kmlData = kmlData.replace(regex, `$1${githubRawUrl}$2`);
                isUpdated = true;
            }
        }

        if (isUpdated) {
            fs.writeFileSync(KML_PATH, kmlData, 'utf8');
            console.log('data.kml successfully updated with downloaded official festival posters!');
        } else {
            console.log('No new updates found for the festivals.');
        }

    } catch (error) {
        console.error('Error during crawling:', error.message);
        process.exit(1); 
    }
}

crawlFestivals();
