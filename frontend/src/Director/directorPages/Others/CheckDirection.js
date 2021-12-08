
export const CheckDirection = (direction) => {
    if (direction.value === '') {
        return "Xizmat nomi  kiritilmagan. Iltimos xizmat nomini kiriting!"
    }
    if (direction.price === '') {
        return "Xizmat narxi kiritilmagan. Iltimos xizmat narxini kiriting!"
    }
    return false

}
