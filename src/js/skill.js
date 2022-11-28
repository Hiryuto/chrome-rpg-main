import { skillData } from '../asset/data.js'

import { getSkill, getStatus } from './global.js'
document.getElementById('mainpage').addEventListener('click', () => {
  window.location.href = 'index.html'
})

async function viewSetup() {
  const skill = await getSkill()
  for (let i = 0; i < skill.setSkill.length; i++) {
    const skillId = skill.setSkill[i]
    const details = document.createElement('details')
    const summary = document.createElement('summary')
    summary.innerHTML = skillData[skillId].name
    details.appendChild(summary)
    const box = document.createElement('div')
    box.className = 'box1'
    const box_title = document.createElement('span')
    box_title.className = 'box-title'
    box_title.innerHTML = '効果'
    box.appendChild(box_title)
    let effectText = document.createElement('p')
    effectText.innerHTML = skillData[skillId].effect
    box.appendChild(effectText)
    details.appendChild(box)
    let descriptionText = document.createElement('p')
    descriptionText.innerHTML = skillData[skillId].description
    details.appendChild(descriptionText)
    document.getElementById('SubmitSkill').appendChild(details)
  }
  console.log(Object.keys(skillData).length)
  for (let i = 0; i < Object.keys(skillData).length; i++) {
    const details = document.createElement('details')
    const summary = document.createElement('summary')
    summary.innerHTML = skillData[i].name
    details.appendChild(summary)
    const box = document.createElement('div')
    box.className = 'box1'
    const box_title = document.createElement('span')
    box_title.className = 'box-title'
    box_title.innerHTML = '効果'
    box.appendChild(box_title)
    let effectText = document.createElement('p')
    effectText.innerHTML = skillData[i].effect
    box.appendChild(effectText)
    details.appendChild(box)
    let descriptionText = document.createElement('p')
    descriptionText.innerHTML = skillData[i].description
    details.appendChild(descriptionText)
    let setLevel = document.createElement('p')
    setLevel.innerHTML = '設定可能レベル:Lv' + skillData[i].openlevel
    setLevel.style = 'margin-top:10px'
    details.appendChild(setLevel)
    let hr = document.createElement('hr')
    details.appendChild(hr)
    let button = document.createElement('button')
    button.innerHTML = 'スキルをセットする'
    button.id = i
    console.log(i)
    button.onclick = function () {
      console.log(skill)
      setSkill(i)
    }
    console.log(button.onclick)
    details.appendChild(button)
    document.getElementById('SkillList').appendChild(details)
  }
}
async function setSkill(skillIds) {
  const skill = await getSkill()
  let result = window.confirm(
    skillData[skillIds].name + 'を設定してよろしいですか？\n設定可能レベル:Lv' + skillData[skillIds].openlevel,
  )
  if (result) {
    const Status = await getStatus()
    if (skillData[skillIds].openlevel > Status.level) {
      return alert('設定可能レベルに達していないため設定できませんでした。')
    }
    let skill_splice = skill.setSkill
    skill_splice.splice(0, 1, skillIds)
    chrome.storage.local.set({
      skill: skill,
    })
    window.location.reload()
  } else {
  }
}
function delskill(skillIds) {}
viewSetup()
