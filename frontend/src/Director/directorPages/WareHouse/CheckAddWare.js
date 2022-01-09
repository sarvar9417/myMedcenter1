
export const CheckAddWare = (ware) => {

    if (ware.price === '') {
        return "Mahsulot narxi kiritilmagan. Iltimos mahsulot narxini kiriting!"
    }
    if (ware.pieces === '' || ware.pieces === 0) {
        return "Mahsulot soni kiritilmagan. Iltimos mahsulot sonini kiriting!"
    }
    return false

}
