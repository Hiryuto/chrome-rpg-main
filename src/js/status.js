import { getStatus } from './global.js'

async function view() {
  const Status = await getStatus()
  console.log(Status)
  textContent('point', Status.point)
  textContent('hp', Status.hp)
  textContent('atk', Status.atk)
  textContent('def', Status.def)
  textContent('spd', Status.spd)
}
//ボタン制御
document.getElementById('mainpage').addEventListener('click', () => {
  window.location.href = 'index.html'
})
document.getElementById('addhp').addEventListener('click', async () => {
  const Status = await getStatus()
  if (Status.point > 0) {
    Status.point--
    Status.hp++
    console.log(Status)
    chrome.storage.local.set({ status: Status })
    view()
  }
})
document.getElementById('addatk').addEventListener('click', async () => {
  const Status = await getStatus()
  if (Status.point > 0) {
    Status.point--
    Status.atk++
    chrome.storage.local.set({ status: Status })
    view()
  }
})
document.getElementById('adddef').addEventListener('click', async () => {
  const Status = await getStatus()
  if (Status.point > 0) {
    Status.point--
    Status.def += 4
    chrome.storage.local.set({ status: Status })
    view()
  }
})
document.getElementById('addspd').addEventListener('click', async () => {
  const Status = await getStatus()
  if (Status.point > 0) {
    Status.point--
    Status.spd++
    chrome.storage.local.set({ status: Status })
    view()
  }
})

/**
 * @param {string} id HTMLのID
 * @param {string} message 変換したい文字列を指定
 */
function textContent(id, message) {
  document.getElementById(id).textContent = `${message}`
}

/**
 * @param {string} id HTMLのID
 * @param {string} message 変換したいHTMLを指定
 */
function innerHTML(id, message) {
  document.getElementById(id).innerHTML = `${message}`
}

view()
