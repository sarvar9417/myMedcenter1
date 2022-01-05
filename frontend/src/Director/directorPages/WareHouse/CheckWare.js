
export const CheckWare = (ware) => {
    if (ware.name === '') {
        return "Mahsulot nomi  kiritilmagan. Iltimos mahsulot nomini kiriting!"
    }
    if (ware.type === '') {
        return "Mahsulot turi kiritilmagan. Iltimos mahsulot turi kiriting!"
    }
    if (ware.price === '') {
        return "Mahsulot narxi kiritilmagan. Iltimos mahsulot narxini kiriting!"
    }
    if (ware.pieces === '') {
        return "Mahsulot soni kiritilmagan. Iltimos mahsulot sonini kiriting!"
    }
    return false

}
