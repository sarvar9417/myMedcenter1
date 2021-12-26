import React from 'react'

export const CheckCounterAgentData = (data) => {
    if (data.firstname === '') {
        return "Shifokorning ismi kiritilmagan. Iltimos shifokor ismini kiriting!"
    }
    if (data.lastname === '') {
        return "Shifokorning familiyasi kiritilmagan. Iltimos shifokor familiyasini kiriting!"
    }
    if (data.fathername === '') {
        return "Shifokor otasining ismi kiritilmagan. Iltimos shifokor otasining ismi kiriting!"
    }
    if (data.phone.toString().length < 12) {
        return "Telefon raqami kiritishda xatolikka yo'l qo'yilgan. Iltimos tekshirib qayta kiriting!"
    }
    if (data.clinic === '') {
        return "Shifokorning klinikasi kiritlmagan. Iltimos shifokorning klinikasini kiriting!"
    }
    if (data.section === '') {
        return "Shifokorning ixtisosligi belgilanmagan. Iltimos shifokorning ixtisosligini belgiling!"
    }
    return false
}
