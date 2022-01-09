
export const CheckCounterDoctorData = (data) => {
    if (data.firstname === '') {
        return "Shiforningning ismi kiritilmagan. Iltimos shifokor ismini kiriting!"
    }
    if (data.lastname === '') {
        return "Shiforningning familiyasi kiritilmagan. Iltimos shifokor familiyasini kiriting!"
    }
    if (data.clinic === '') {
        return "Klinikaning nomi kiritilmagan. Iltimos klinika nomini kiriting!"
    }
    return false
}
