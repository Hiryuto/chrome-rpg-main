/**
 * ステータスを返す関数
 * @returns {Promise<{level: レベル,exp: 経験値,totalExp: 累計経験値,hp: 体力,atk: 攻撃力,def: 防御力,spd: スピード,point:ステータスポイント,coin:コイン,}>}
 */
export async function getStatus() {
  const Status = await chrome.storage.local.get('status')
  return Status.status
}
/**
 * ゲームフラグを返す関数
 * @returns {Promise<{stage: 最大クリア親ステージ,stageClear: [最大クリアステージ],}>}
 */
export async function getFlag() {
  const flag = await chrome.storage.local.get('flag')
  return flag.flag
}
/**
 * スキルのデータを返す関数
 * @returns {Promise<{setskill: [SkillId]}>}
 */
export async function getSkill() {
  const skill = await chrome.storage.local.get('skill')
  return skill.skill
}

/**
 * インベントリのデータを返す関数
 * @returns {Promise<{0: [{[key:Number]:Number}],1: [{[key:Number]:Number}],2: [{[key:Number]:Number}],3: [{[key:Number]:Number}],}>}
 */
export async function getGameInv() {
  const gameInv = await chrome.storage.local.get('gameInv')
  return gameInv.gameInv
}
/**
 * 設定のデータを返す関数
 * @returns {Promise<{gameSpeed:Number}>}
 */
export async function getSetting() {
  const setting = await chrome.storage.local.get('setting')
  return setting.setting
}
/**
 * 装備のデータを返す関数
 * @returns {Promise<{Helmet: Number,Chestplate: Number,Boots: Number,Weapon: Number,Accessory: Number,}>}
 */
export async function getGear() {
  const gameGear = await chrome.storage.local.get('gameGear')
  return gameGear.gameGear
}
