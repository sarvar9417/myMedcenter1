
export const CheckDoctorData = (doctor) => {
    if (doctor.firstname === '') {
        return "Shifokorning ismi kiritilmagan. Iltimos shifokor ismini kiriting!"
    }
    if (doctor.lastname === '') {
        return "Shifokorning familiyasi kiritilmagan. Iltimos shifokor familiyasini kiriting!"
    }
    if (doctor.fathername === '') {
        return "Shifokor otasining ismi kiritilmagan. Iltimos shifokor otasining ismi kiriting!"
    }
    if (doctor.phone.toString().length < 12) {
        return "Telefon raqami kiritishda xatolikka yo'l qo'yilgan. Iltimos tekshirib qayta kiriting!"
    }
    if (doctor.born === '') {
        return "Shifokorning tug'ilgan yili belgilanmagan. Iltimos shifokorning tug'ilgan yilini belgiling!"
    }
    if (doctor.section === '') {
        return "Shifokorning ixtisosligi belgilanmagan. Iltimos shifokorning ixtisosligini belgiling!"
    }
    return false

}
