
export const CheckClentData = (client) => {
    if (client.firstname === '') {
        return "Mijozning ismi kiritilmagan. Iltimos mijoz ismini kiriting!"
    }
    if (client.lastname === '') {
        return "Mijozning familiyasi kiritilmagan. Iltimos mijoz familiyasini kiriting!"
    }
    if (client.fathername === '') {
        return "Mijoz otasining ismi kiritilmagan. Iltimos mijoz otasining ismi kiriting!"
    }
    if (client.gender === '') {
        return "Mijoz jinsi tanlanmagan. Iltimos mijoz jinsini belgilang!"
    }
    if (client.phone.toString().length < 12) {
        return "Telefon raqami kiritishda xatolikka yo'l qo'yilgan. Iltimos tekshirib qayta kiriting!"
    }
    if (client.born === '') {
        return "Mijozning tug'ilgan yili belgilanmagan. Iltimos mijozning tug'ilgan yilini belgiling!"
    }
    return false

}
