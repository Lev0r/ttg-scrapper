const puppeteer = require("puppeteer");
const fs = require("fs");

// Proxy site tool:
// https://proxyium.com/
// Proxy server list:
// https://hidemy.name/en/proxy-list/?country=AOARAMAUATBDBYBZBOBABWBRBGBFKHCMCACLCNCOCRHRCWCYCZDOECEGSVFIFRDEGTGNHNHKHUINIDIRILITJPKZKEKRLVLTMYMXMDMNMMNPNLNGNOPKPAPYPEPHPLPTPRQARORUSGSKZAESSECHTWTZTHTGTTTNTRUGUAGBUSUZVNVG&type=s#list

const targetFileName = "spellUrls";
const targetFileExt = ".json";

const spellListUrl = "https://ttg.club/spells/";

function wtiteSpellListToFile(spells) {
  fs.writeFileSync(
      targetFileName+targetFileExt,
      JSON.stringify(spells),
      {encoding:'utf8',flag:'w'});
}

// Enter point
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [ '--proxy-server=128.140.90.201:8080' ]
  });
  const page = await browser.newPage();

  await page.goto(spellListUrl);

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});
  await page.waitForSelector('li.vue-recycle-scroller__item-view');

  const spellCardsSelector = await page.$$(
    'li.vue-recycle-scroller__item-view .list-row__column'
  );

  let spells = [];
  for(let i = 0; i < spellCardsSelector.length; i++) {
    let card = spellCardsSelector[i];

    let Url = await card.$eval('a.link-item', e => e.getAttribute('href'));
    let Level = await card.$eval('a.link-item .link-item__lvl>span', e => e.textContent);
    let RuName = await card.$eval('a.link-item .link-item__name--rus', e => e.textContent);
    let EngName = await card.$eval('a.link-item .link-item__name--eng', e => e.textContent);
    let School = await card.$eval('a.link-item .link-item__school', e => e.textContent);

    let spell = {
      level: Level == '◐' ? 0 : +Level,
      url: Url,
      ruName: RuName,
      engName: EngName,
      school: School
    };

    spells.push(spell);
  };

  wtiteSpellListToFile(spells);
})();
