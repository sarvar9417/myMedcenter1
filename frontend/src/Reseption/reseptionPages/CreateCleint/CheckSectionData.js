
export const CheckSectionsData = (sections) => {
    sections.map((section)=>{
        if (section.price === '') {
            return `${section.name} xizmatining summasi kiritilmagan. Iltimos xizmat narxini kiriting. Agar xizmat narxi mavjud bo'lmasa 0 summa kiriting!`
        }
    })
    return false

}
