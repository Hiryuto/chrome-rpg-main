import { getSetting } from './global.js'

document.getElementById('mainpage').addEventListener('click', () => {
  window.location.href = 'index.html'
})
// input要素
const gameSpeed = document.getElementById('gameSpeed')

// 埋め込む先の要素
const currentValueElem = document.getElementById('current-value')

// 現在の値を埋め込む関数
const setCurrentValue = (val) => {
  currentValueElem.innerText = val
}

// inputイベント時に値をセットする関数
const rangeOnChange = (e) => {
  setCurrentValue(e.target.value)
}

window.onload = async () => {
  let setting = await getSetting()
  let gameSpeeds = setting.gameSpeed / 1000
  console.log(gameSpeeds)
  gameSpeed.value = gameSpeeds
  // 変更に合わせてイベントを発火する
  gameSpeed.addEventListener('input', rangeOnChange)
  // ページ読み込み時の値をセット
  setCurrentValue(setting.gameSpeed / 1000)
}
document.getElementById('gameSpeedSave').addEventListener('click', async () => {
  const setting = await getSetting()
  setting.gameSpeed = gameSpeed.value * 1000
  chrome.storage.local.set({ setting: setting })
  window.location.reload()
})
