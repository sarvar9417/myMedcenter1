
export const CheckAddWare = (ware) => {
    if (ware.name === '') {
        return "Mahsulot nomi  kiritilmagan. Iltimos mahsulot nomini kiriting!"
    }
    if (ware.type === '') {
        return "Mahsulot turi kiritilmagan. Iltimos mahsulot turi kiriting!"
    }
    if (ware.price === '') {
        return "Mahsulot narxi kiritilmagan. Iltimos mahsulot narxini kiriting!"
    }
    if (ware.pieces === '' || ware.pieces === 0) {
        return "Mahsulot soni kiritilmagan. Iltimos mahsulot sonini kiriting!"
    }
    if (ware.comment.length < 5 && parseInt(ware.pieces) < 0) {
        console.log(ware.comment.length)
        return "Diqqat! Mahsulot soni kamayganda izoh qolditish majburiy"
    }
    return false

}
