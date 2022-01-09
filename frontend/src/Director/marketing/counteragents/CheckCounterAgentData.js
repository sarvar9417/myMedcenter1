
export const CheckCounterAgentData = (data) => {
    if (data.firstname === '') {
        return "Counteragentning ismi kiritilmagan. Iltimos shifokor ismini kiriting!"
    }
    if (data.lastname === '') {
        return "Counteragentning familiyasi kiritilmagan. Iltimos shifokor familiyasini kiriting!"
    }
    return false
}
