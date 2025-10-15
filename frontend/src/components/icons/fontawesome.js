import { library } from '@fortawesome/fontawesome-svg-core'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'
import * as regularIcons from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

const iconNames = [
  'heart-circle-check',
  'heart-circle-plus',
  'heart-circle-minus',
  'house-chimney',
  'people-robbery',
  'comment-dots',
  'clipboard-list',
  'truck-fast',
  'bars',
  'chevron-down',
  'pen'
]

const iconNameRegular = [
  'heart'
]

function toPascalCaseIconName(name) {
  return 'fa' + name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

// loop แล้วเพิ่มเข้า library
iconNames.forEach(iconName => {
  const faIconName = toPascalCaseIconName(iconName)
  if (solidIcons[faIconName]) {
    library.add(solidIcons[faIconName])
  } else {
    console.warn(`[FontAwesome] ไม่พบไอคอน: ${faIconName}`)
  }
})

library.add(faHeartRegular)