import { getGear } from './global.js'
import { item } from '../asset/data.js'

document.getElementById('mainpage').addEventListener('click', () => {
  window.location.href = 'index.html'
})
//任意のタブにURLからリンクするための設定
async function GethashID(hashIDName) {
  if (hashIDName) {
    //タブ設定
    $('.tab li')
      .find('button')
      .each(function () {
        //タブ内のaタグ全てを取得
        const idName = $(this).attr('href') //タブ内のaタグのリンク名（例）#lunchの値を取得
        if (idName == hashIDName) {
          //リンク元の指定されたURLのハッシュタグ（例）http://example.com/#lunch←この#の値とタブ内のリンク名（例）#lunchが同じかをチェック
          const parentElm = $(this).parent() //タブ内のaタグの親要素（li）を取得
          $('.tab li').removeClass('active') //タブ内のliについているactiveクラスを取り除き
          $(parentElm).addClass('active') //リンク元の指定されたURLのハッシュタグとタブ内のリンク名が同じであれば、liにactiveクラスを追加
          //表示させるエリア設定
          $('.area').removeClass('is-active') //もともとついているis-activeクラスを取り除き
          $(hashIDName).addClass('is-active') //表示させたいエリアのタブリンク名をクリックしたら、表示エリアにis-activeクラスを追加
        }
      })
    let nowGear = await getGear()
    hashIDName = hashIDName.replace(/#/g, '')
    switch (hashIDName) {
      case 'Weapon':
        viewGear(1, 'Weapon')
        break
      case 'Helmet':
        let nowHelmetName = item[2][`${nowGear[`${hashIDName}`]}`].name
        document.querySelector(`#${hashIDName} .nowEquipment td`).innerHTML = nowHelmetName
        break
      case 'Chestplate':
        let nowChestplateName = item[2][`${nowGear[`${hashIDName}`]}`].name
        document.querySelector(`#${hashIDName} .nowEquipment td`).innerHTML = nowChestplateName
        break
      case 'Boots':
        let nowBootsName = item[2][`${nowGear[`${hashIDName}`]}`].name
        document.querySelector(`#${hashIDName} .nowEquipment td`).innerHTML = nowBootsName
        break
      case 'Accessory':
        let nowAccessoryName = item[2][`${nowGear[`${hashIDName}`]}`].name
        document.querySelector(`#${hashIDName} .nowEquipment td`).innerHTML = nowAccessoryName
        break
      default:
        document.querySelector(`#${hashIDName} .nowEquipment td`).innerHTML = 'エラーが発生しました'
    }
  }
}

//タブをクリックしたら
$('.tab button').on('click', function () {
  var idName = $(this).attr('href') //タブ内のリンク名を取得
  GethashID(idName) //設定したタブの読み込みと
  return false //aタグを無効にする
})

// 上記の動きをページが読み込まれたらすぐに動かす
$(window).on('load', function () {
  $('.tab li:first-of-type').addClass('active') //最初のliにactiveクラスを追加
  $('.area:first-of-type').addClass('is-active') //最初の.areaにis-activeクラスを追加
  var hashName = '#Helmet' //リンク元の指定されたURLのハッシュタグを取得
  GethashID(hashName) //設定したタブの読み込み
})

async function viewGear(dataCategoryID, CategoryName) {
  let nowGear = await getGear()
  if (nowGear[`${CategoryName}`] == null) {
    document.querySelector(`#${CategoryName} .nowEquipment td`).innerHTML = '装備していません'
  } else {
    let nowGearName = item[`${dataCategoryID}`][`${nowGear[`${CategoryName}`]}`].name
    document.querySelector(`#${CategoryName} .nowEquipment td`).innerHTML = nowGearName
  }
}
