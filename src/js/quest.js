function clear_screen() {
  const screen = document.getElementById('screen')
  while (screen.lastChild) {
    screen.removeChild(screen.lastChild)
  }
}

function main_view() {
  const mainquest = document.createElement('button')
  mainquest.innerHTML = 'メインクエスト'
  mainquest.style = 'padding: 20px'
  mainquest.id = 'mainquest'
  mainquest.disabled = false
  mainquest.onclick = function () {
    window.location.href = 'mainquest.html'
  }
  document.getElementById('screen').appendChild(mainquest)
  const subquest = document.createElement('button')
  subquest.innerHTML = 'サブクエスト'
  subquest.style = 'padding: 20px; margin-left: 10px;'
  subquest.id = 'subquest'
  subquest.type = 'submit'
  subquest.disabled = true
  document.getElementById('screen').appendChild(subquest)
}

/**
 * 待機 ※await必須
 * @param {待つ時間} waitTime
 * @returns
 */
const sleep = (waitTime) => new Promise((resolve) => setTimeout(resolve, waitTime))

document.getElementById('mainpage').addEventListener('click', () => {
  window.location.href = 'index.html'
})

main_view()
