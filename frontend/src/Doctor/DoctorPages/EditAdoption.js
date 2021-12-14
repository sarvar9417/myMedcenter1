import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import Modal from 'react-modal';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};


export const EditAdoption = () => {
    const { request, loading } = useHttp()
    const sectionId = useParams().id
    const auth = useContext(AuthContext)
    const [section, setSection] = useState()
    const history = useHistory()
    const [client, setClient] = useState({
        id: "",
        lastname: "",
        firstname: "",
        fathername: "",
        born: "",
        phone: "",
        price: ""
    })

    //Modal oyna
    const [modal, setModal] = useState(false)

    const getSection = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctor/${sectionId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            console.log(fetch)
            getClient(fetch.client)
            setSection(fetch)
        } catch (error) {

        }
    }, [request, auth, sectionId])

    const getClient = useCallback(async (id) => {
        try {
            const fetch = await request(`/api/clients/doctor/${id}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(fetch)
        } catch (e) {

        }
    }, [request, auth])


    // Comment yozish
    // const comments = [
    //     ` Contrary to popular belief, Lorem Ipsum is not simply `,
    //     ` . It has roots in a piece of classical Latin literature from 45 BC, making it over `,
    //     ` years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, `,
    //     ` , from a Lorem Ipsum passage, and going through the cites of the word in `,
    //     ` , discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" ( `,
    //     ` )by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. `,
    //     ` Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section `,
    //     ` .`
    // ]
    const changeComment = (event) => {
        // let s = ""
        // for (let i = 0; i < comments.length-1; i++) {
        //     let n = document.getElementsByClassName("comment")[i].value
        //     s = s + comments[i] + n

        // }
        // s = s + comments[comments.length-1]
        setSection({ ...section, [event.target.name]: event.target.value })
    }

    // Xulosa yozish
    // const summary = [
    //     `  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, `,
    //     ` ,or randomised words which don't look even slightly believable. `,
    //     ` to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. `,
    //     ` generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of `,
    //     ` words, combined with a handful of model sentence structures, `,
    //     ` Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition,
    //         injected humour, or non-characteristic words etc.
    //     `
    // ]
    const changeSummary = (event) => {
        // let s = ""
        // for (let i = 0; i < summary.length - 1; i++) {
        //     let n = document.getElementsByClassName("summary")[i].value
        //     s = s + summary[i] + n

        // }
        // s = s + summary[summary.length - 1]
        setSection({ ...section, [event.target.name]: event.target.value })
    }

    // const checkUp = (event) => {
    //     setSection({ ...section, [event.target.name]: event.target.id })
    //     openModal1()
    // }

    const dontCome = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctordontcome/${sectionId}`, 'PUT', { checkUp: "kelmagan" }, {
                Authorization: `Bearer ${auth.token}`
            })
            history.push(`/doctor`)
        } catch (e) {

        }
    }, [request, auth])


    const doneCome = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctordone/${sectionId}`, 'PUT',
                {
                    checkUp: "kelgan",
                    comment: section.comment,
                    summary: section.summary,
                    done: "tasdiqlangan"
                },
                {
                    Authorization: `Bearer ${auth.token}`
                })
            console.log(fetch)
            history.push(`/doctor`)
        } catch (e) {

        }
    }, [request, auth, section, sectionId])

    useEffect(() => {
        getSection()
    }, [getSection])


    return (
        <div style={{ marginTop: "70px" }}>
            <div className="container-lg">
                <div style={{ textAlign: "right", }}>
                    <h1 style={{ color: "#14A479", marginBottom: "50px" }}>MedicalCenter For Navoi</h1>
                    <h3>MedicalCenter Islom</h3>
                    <p style={{ margin: "0", fontWeight: "500" }}>"Nosirov Islom MedicalCenter"</p>
                    <p style={{ margin: "0", fontWeight: "500" }}>Naviy Navoiy 42</p>
                    <p style={{ margin: "0", fontWeight: "500" }}>Uzbekistan Naviy Navoiy</p>
                    <p style={{ margin: "0", fontWeight: "500" }}>+12312367890</p>
                    <p style={{ margin: "0", fontWeight: "500" }}>nosirovislom071221312@gmail.com</p>

                </div>
                <div className="forms">
                    <h2 style={{ color: "#14A479" }}>Mijoz ma'lumotlari</h2>
                    <div className="row mt-5">
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-md-4 col-sm-4">
                                    <label style={{ fontSize: "20px", marginRight: "20%" }}>
                                        ID:
                                    </label>
                                </div>
                                <div className="col-md-8 col-sm-8">
                                    <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                        {client.id}
                                    </h3>
                                </div>
                                <div className="col-md-4 col-sm-4">
                                    <label style={{ fontSize: "20px", marginRight: "16.5%" }}>
                                        F.I.O:
                                    </label>
                                </div>
                                <div className="col-md-8 col-sm-8">
                                    <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                        {client.firstname} {client.lastname} {client.fathername}
                                    </h3>
                                </div>
                                <div className="col-md-4 col-sm-4">
                                    <label style={{ fontSize: "20px", marginRight: "4%" }}>
                                        Tug'ilgan yili:
                                    </label>
                                </div>
                                <div className="col-md-8 col-sm-8">
                                    <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                        {new Date(client.born).toLocaleDateString()}
                                    </h3>
                                </div>
                                <div className="col-md-4 col-sm-4">
                                    <label style={{ fontSize: "20px", marginRight: "13%" }}>
                                        Phone:
                                    </label>
                                </div>
                                <div className="col-md-8 col-sm-8">
                                    <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                        +{client.phone}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-md-4 col-sm-4">
                                    <label style={{ fontSize: "20px", marginRight: "15%" }}>
                                        Maqsad:
                                    </label>
                                </div>
                                <div className="col-md-8 col-sm-8">
                                    <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                        {section && section.subname}
                                    </h3>
                                </div>
                                <div className="col-md-4 col-sm-4">
                                    <label style={{ fontSize: "20px", marginRight: "15%" }}>
                                        Navbati:
                                    </label>
                                </div>
                                <div className="col-md-8 col-sm-8">
                                    <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                        {section && (section.turn ? section.turn : section.bronTime)}
                                    </h3>
                                </div>
                                <div className="col-md-4 col-sm-4">
                                    <label style={{ fontSize: "20px", marginRight: "15%" }}>
                                        To'lov summasi:
                                    </label>
                                </div>
                                <div className="col-md-8 col-sm-8">
                                    <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                        {section && section.price} so'm
                                    </h3>
                                </div>
                                <div className="col-md-4 col-sm-4">
                                    <label style={{ fontSize: "20px", marginRight: "15%" }}>
                                        To'lovlangan summa:
                                    </label>
                                </div>
                                <div className="col-md-8 col-sm-8">
                                    <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                        {section && section.priceCashier} so'm
                                    </h3>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="tt " style={{ fontFamily: "times" }}>

                    <h1 className="mt-5" style={{ marginBottom: "50px", textAlign: "center" }}>MedicalCenter  Navoi</h1>
                    <h5>{new Date().toLocaleDateString()}</h5>
                    <h5>Bemor: <span className="fs-4">{client.firstname} {client.lastname} {client.fathername}</span></h5>
                    <textarea name="comment" onChange={changeComment} style={{ height: "200px" }} className="form-control" defaultValue={section && section.comment}></textarea>
                    <br />
                    <textarea name="summary" onChange={changeSummary} style={{ height: "200px" }} className="form-control" defaultValue={section && section.summary}></textarea>

                    <br />

                    <h5>Doctor: <span className="fs-4">{auth.doctor.lastname} {auth.doctor.firstname[0]}</span></h5>
                    <div className="row mt-5 mb-5">
                        <div className="col-12">
                            {/* <button id="kelmagan" name="checkup" onClick={checkUp} className="btn btn-danger">Mijoz kelmadi</button> */}
                            <button className="btn" onClick={()=>{window.scrollTo({top:0}); setModal(true)}} style={{ color: "#fff", backgroundColor: "#14A479" }}>Tasdiqlash</button>
                        </div>
                    </div>
                </div>
            </div >





            {/* Modal oynaning ochilishi
            <div>
                <Modal
                    isOpen={modalIsOpen1}
                    onRequestClose={closeModal1}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div className="row m-1">
                        <div className="col-12 text-center mb-4 ">
                            <h4>Mijoz kelmaganini tasdiqlaysizmi?</h4>
                        </div>
                    </div>
                    <div className="row m-1">
                        <div className="col-12 text-center">
                            <button onClick={dontCome} className="btn btn-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                            <button onClick={closeModal1} className="btn btn-danger" >Qaytish</button>
                        </div>
                    </div>

                </Modal>
            </div> */}

            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card p-4" style={{ fontFamily: "times" }}>
                        <div className="row m-1">
                            <div className="col-12 ">
                                <h5>
                                    Izoh:<br />
                                    {section && section.comment}
                                </h5>
                            </div>
                        </div>
                        <div className="row m-1">
                            <div className="col-12 ">
                                <h5 >
                                    Xulosa: <br />
                                    {section && section.summary}
                                </h5>
                            </div>
                        </div>
                        <div className="row m-1">
                            <div className="col-12 text-center">
                                <button onClick={doneCome} className="btn btn-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={()=>setModal(false)} className="btn btn-danger" >Qaytish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}