import { getStatus } from './global.js'
//chrome.storageから変数を取得
const Status = await getStatus()
//HTMLに変数を設定
textContent('level', Status.level)
textContent('exp', Status.exp)
textContent('hp', Status.hp)
textContent('atk', Status.atk)
textContent('def', Status.def)
textContent('spd', Status.spd)
textContent('coin', Status.coin)

document.getElementById('quest_button').addEventListener('click', () => {
  window.location.href = 'quest.html'
})
document.getElementById('status_button').addEventListener('click', () => {
  window.location.href = 'status.html'
})
document.getElementById('inv_button').addEventListener('click', () => {
  window.location.href = 'inventory.html'
})
document.getElementById('skill').addEventListener('click', () => {
  window.location.href = 'skill.html'
})
document.getElementById('setting').addEventListener('click', () => {
  window.location.href = 'setting.html'
})
document.getElementById('equipment').addEventListener('click', () => {
  window.location.href = 'equipment.html'
})

/**
 * @param {string} id HTMLのID
 * @param {string} message 変換したい文字列を指定
 */
function textContent(id, message) {
  document.getElementById(id).textContent = `${message}`
}
/**
 *
 * @param {string} id HTMLのID
 * @param {string} message 変換したいHTMLを指定
 */
function innerHTML(id, message) {
  document.getElementById(id).innerHTML = `${message}`
}
