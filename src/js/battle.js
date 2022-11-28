const url = new URL(window.location.href)
const stage = Number(url.searchParams.get('stage'))
const stageid = Number(url.searchParams.get('stageid'))

import { stageData, item, levelTable } from '../asset/data.js'

import { getStatus, getFlag, getGameInv, getSetting } from './global.js'

/**
 * 待機 ※await必須
 * @param {待つ時間} waitTime
 * @returns
 */
const sleep = (waitTime) => new Promise((resolve) => setTimeout(resolve, waitTime))

battle()

async function battle() {
  const Status = await getStatus()
  const Enemydata = stageData.data[stage - 1].info[stageid]
  innerHTML(
    'screen',
    `<h2>敵の情報</h2><h3>${Enemydata.EnemyName}</h3><div class="box"><div class="statusbox" style="display: flex;justify-content: center;"><p>HP:${Enemydata.EnemyHp}</p><p>Atk:${Enemydata.EnemyAtk}</p></div><div class="statusbox" style="display: flex;justify-content: center;"><p>Def:${Enemydata.EnemyDef}</p><p>Spd:${Enemydata.EnemySpd}</p></div></div><h2>自分の情報</h2><div class="box"><div class="statusbox" style="display: flex;justify-content: center;"><p>HP:${Status.hp}</p><p>ATK:${Status.atk}</p></div><div class="statusbox" style="display: flex;justify-content: center;"><p>DEF:${Status.def}</p><p>SPD:${Status.spd}</p></div></div></div><button id="start">バトルを開始する</button><hr><button id="backquest">クエストページに戻る</button>`,
  )
  document.getElementById('mainpage').style.display = 'none'
  document.getElementById('hr').style.display = 'none'
  document.getElementById('br').style.display = 'none'
  document.getElementById('backquest').addEventListener('click', () => {
    window.location.href = 'quest.html'
  })
  document.getElementById('start').addEventListener('click', () => {
    BattleStart(stage, stageid)
  })
}

async function BattleStart(stagename, stageid) {
  const Status = await getStatus()
  const flag = await getFlag()
  const Enemydata = stageData.data[stage - 1].info[stageid]
  let nowenemyHp = Enemydata.EnemyHp
  let nowplayerHp = Status.hp
  const next_stage = stageid + 1
  let itemLog
  let log = ''
  let atk
  let leftexp
  let nowexp
  let levelUp = ''
  let stageMessage = ''
  pageload(nowenemyHp, nowplayerHp, log, stage, stageid)
  //敵のHPが無くなるまでループする
  while (nowenemyHp > 0) {
    if (nowenemyHp < 0) {
      nowenemyHp = 0
    } else if (nowplayerHp < 0) {
      nowplayerHp = 0
    }
    if (nowplayerHp <= 0) {
      break
    }
    let setting = await getSetting()
    await sleep(setting.gameSpeed)
    //攻撃判定
    let random = Math.floor(Math.random() * (2 + 1 - 1)) + 1
    if (random == 2) {
      atk = Math.ceil(Status.atk / (1 + Enemydata.EnemyDef / 100))
      nowenemyHp -= atk
      log += `\n${Enemydata.EnemyName}に${atk}ダメージを与えた！`
    } else if (random == 1) {
      atk = Math.ceil(Enemydata.EnemyAtk / (1 + Status.def / 100))
      nowplayerHp -= atk
      log += `\n${Enemydata.EnemyName}から${atk}ダメージを受けた！`
    }
    //オーバーフロー対処処理
    if (nowenemyHp < 0) {
      nowenemyHp = 0
    } else if (nowplayerHp < 0) {
      nowplayerHp = 0
    }
    //ページ更新
    pageload(nowenemyHp, nowplayerHp, log, stage, stageid)
  }
  //戦闘勝利処理
  if (nowenemyHp == 0) {
    log += `\n戦闘に勝利した！`
    pageload(nowenemyHp, nowplayerHp, log, stage, stageid)
    await sleep(2000)
    const ExpRandom = Math.floor(Math.random() * (Enemydata.ExpMax + 1 - Enemydata.ExpMin)) + Enemydata.ExpMin
    //経験値付与
    Status.exp += ExpRandom
    Status.totalExp += ExpRandom
    const CoinRandom = Math.floor(Math.random() * (Enemydata.CoinMax + 1 - Enemydata.CoinMin) + Enemydata.CoinMin)
    //Coin付与
    Status.coin += CoinRandom
    //レベルアップ処理
    if (levelTable.level[Status.level - 1] <= Status.exp) {
      Status.exp -= levelTable.level[Status.level - 1]
      Status.level++
      Status.point++
      chrome.storage.local.set({
        status: Status,
      })
      levelUp = `レベルUp!! ${Status.level - 1}→${Status.level}`
    }
    //ステージ追加処理

    //初クリアの場合のみ実行
    if (stage == flag.stage && stageid == flag.stageClear[stage - 1]) {
      //クリアステージがオーバーフローしないため
      if (flag.stageClear[stage - 1] == 10) {
        //もしするなら親ステージを解放する
        flag.stage++
        stageMessage = `新しいステージ<br>「${stageData.data[stage].StageName}」<br>が解放されました！`
      } else {
        //しないなら子ステージを解放する
        flag.stageClear[stage - 1]++
        stageMessage = `新しいステージ<br>「${
          stageData.data[stage - 1].StageName
        } ${stage}-${next_stage}」<br>が解放されました！`
      }
    }
    nowexp = Status.exp
    leftexp = levelTable.level[Status.level - 1] - nowexp

    //ドロップアイテム処理
    //console.log(Object.keys(Enemydata.drop[5]).length)
    if (Object.keys(Enemydata.drop).length >= 1) {
      for (let i = 0; i < Object.keys(Enemydata.drop).length; i++) {
        const chance = Enemydata.drop[i].chance
        const rand = Math.floor(Math.random() * 10000) / 100
        if (rand <= chance) {
          const pieces = Math.floor(
            Math.random() * (Enemydata.drop[i].dropMax - Enemydata.drop[i].dropMin) + Enemydata.drop[i].dropMin,
          )
          //* campaign
          const gameInv = await getGameInv()
          const category = Enemydata.drop[i].category
          console.log(gameInv[category][0][Enemydata.drop[i].id])
          if (gameInv[category][0][Enemydata.drop[i].id] == undefined) {
            console.log('nai')
            gameInv[category][0][Enemydata.drop[i].id] = pieces
          } else {
            console.log('aru')
            gameInv[category][0][Enemydata.drop[i].id] += pieces
          }
          if (i == 0) {
            itemLog = `\n${item[category][Enemydata.drop[i].id].name} ${pieces}個`
          } else {
            itemLog += `\n${item[category][Enemydata.drop[i].id].name} ${pieces}個`
          }
          chrome.storage.local.set({
            gameInv: gameInv,
          })
        }
      }
    }
    //出力
    console.log(itemLog)
    if (itemLog == undefined) {
      itemLog = 'なし'
    }
    innerHTML(
      'screen',
      `<h1>勝利！</h1><h2>${stageMessage}</h2><h2>${levelUp}</h2><h2>Exp:${ExpRandom}</h2><h2>Coin:${CoinRandom}</h2><h2>次のレベルまであと${leftexp}exp</h2><h2>入手アイテム</h2><textarea id="log" rows="4" cols="35" style="resize: none;" disabled>${itemLog}</textarea><hr><button id="backquest">クエストページに戻る</button>`,
    )
    //保存
    chrome.storage.local.set({
      flag: flag,
    })
    chrome.storage.local.set({
      status: Status,
    })
    document.getElementById('mainpage').style.display = 'inline-block'
    document.getElementById('br').style.display = 'block'
    //敗北処理
  } else if (nowplayerHp == 0) {
    log += `\n戦闘に負けてしまった...`
    //画面出力
    pageload(nowenemyHp, nowplayerHp, log, stage, stageid)
    await sleep(2000)
    innerHTML(
      'screen',
      `<h1>敗北...</h1><button id="retry">再挑戦</button><hr><button id="backquest">クエストページに戻る</button>`,
    )
    document.getElementById('mainpage').style.display = 'inline-block'
    document.getElementById('br').style.display = 'block'
  }
  document.getElementById('backquest').addEventListener('click', () => {
    return (window.location.href = 'mainquest.html')
  })
  document.getElementById('retry').addEventListener('click', () => {
    return BattleStart(stagename, stageid)
  })
}

/**
 * @param {string} id HTMLのID
 * @param {string} message 変換したいHTMLを指定
 */
function innerHTML(id, message) {
  document.getElementById(id).innerHTML = `${message}`
}

/**
 * 画面を更新する関数
 * @param {今の敵のHP} nowenemyHp
 * @param {今の自分のHP} nowplayerHp
 * @param {log} log
 */
async function pageload(nowenemyHp, nowplayerHp, log, stage, stageid) {
  const Status = await getStatus()
  const Enemydata = stageData.data[stage - 1].info[stageid]
  innerHTML(
    'screen',
    `<h1>${
      stageData.data[stage - 1].StageName
    } ${stage}-${stageid}</h1><h2>敵の状態</h2><h3 style="margin-bottom: 0px;">${
      Enemydata.EnemyName
    }</h3><h4>HP</h4><h5 style="margin:0px 0px">${nowenemyHp}/${
      Enemydata.EnemyHp
    }</h5><progress style="height: 20px;" value="${nowenemyHp}" max="${
      Enemydata.EnemyHp
    }">HP</progress><hr><h2>自分の情報</h2><h4>HP</h4><h5 style="margin:0px 0px">${nowplayerHp}/${
      Status.hp
    }</h5><progress style="height: 20px;" value="${nowplayerHp}" max="${
      Status.hp
    }">HP</progress><hr><h4>バトルログ</h4><textarea id="log" rows="4" cols="40" style="overflow:hidden;resize: none;" disabled>${log}</textarea>`,
  )
  document.getElementById('log').scrollTop = document.getElementById('log').scrollHeight
}
document.getElementById('mainpage').addEventListener('click', () => {
  return (window.location.href = 'index.html')
})
