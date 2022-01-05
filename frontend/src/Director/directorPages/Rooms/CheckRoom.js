
export const CheckRoom = (room) => {
    if (room.room === '') {
        return "Xona nomi  kiritilmagan. Iltimos xona nomini kiriting!"
    }
    if (room.type === '') {
        return "Xona turi kiritilmagan. Iltimos xona turi kiriting!"
    }
    if (room.price === '') {
        return "Koyka narxi kiritilmagan. Iltimos Koyka narxini kiriting!"
    }
    if (room.bed === '') {
        return "Koyka raqami kiritilmagan. Iltimos koyka raqamini kiriting!"
    }
    return false

}
